<?php

namespace App\Http\Controllers\Staff;

use App\Notifications\ApplicationStatusAlert;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Application;
use App\Models\AssistanceProgram;
use App\Models\AuditLog;
use App\Models\Setting;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\ApplicationStatusUpdated;

class StaffController extends Controller
{
    public function dashboard(Request $request)
    {
        $stats = [
            'total'   => Application::count(),
            'pending' => Application::where('status', 'Pending')->count(),
            'today'   => Application::whereDate('created_at', \Carbon\Carbon::today())->count(),
        ];

        $query = Application::where('status', 'Pending')->with('user');

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('first_name', 'like', "%{$request->search}%")
                  ->orWhere('last_name', 'like', "%{$request->search}%")
                  ->orWhere('id', 'like', "%{$request->search}%");
            });
        }

        if ($request->program) {
            $query->where('program', $request->program);
        }

        $query->oldest();

        $queue = $query->take(10)->get();

        $programs = AssistanceProgram::where('is_active', true)
                    ->orderBy('title')
                    ->pluck('title');

        return Inertia::render('Staff/Dashboard', [
            'stats' => $stats,
            'queue' => $queue,
            'programs' => $programs,
            'filters' => $request->only(['search', 'program', 'sort']) ?: [],
            'auth' => ['user' => Auth::user()]
        ]);
    }

    public function applicationsIndex(Request $request)
    {
        $query = Application::with('user');

        if ($request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhere('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->status) $query->where('status', $request->status);
        if ($request->program) $query->where('program', $request->program);
        if ($request->barangay) $query->where('barangay', $request->barangay);

        if ($request->sort_by) {
            $direction = $request->sort_direction === 'desc' ? 'desc' : 'asc';
            $query->orderBy($request->sort_by, $direction);
        } else {
            $query->latest();
        }

        $applications = $query->paginate(10)->withQueryString();

        $allBarangays = Application::distinct()->orderBy('barangay')->pluck('barangay');
        $programs = AssistanceProgram::where('is_active', true)->pluck('title');

        return Inertia::render('Staff/ApplicationsIndex', [
            'applications' => $applications,
            'filters' => $request->only(['search', 'status', 'program', 'barangay']),
            'sort_by' => $request->sort_by,
            'sort_direction' => $request->sort_direction,
            'allBarangays' => $allBarangays,
            'programs' => $programs,
            'auth' => ['user' => Auth::user()]
        ]);
    }

    public function applicationsShow(Application $application)
    {
        $programSettings = AssistanceProgram::where('title', $application->program)->first();

        return Inertia::render('Staff/ApplicationShow', [
            'application' => $application->load('user'),
            'programSettings' => $programSettings,
            'auth' => ['user' => Auth::user()]
        ]);
    }

    // --- STAFF ACTIONS (VERIFICATION ONLY) ---

    // 1. Verify / Add Note (Does NOT Approve)
    public function storeRemark(Request $request, Application $application)
    {
        $request->validate([ 'remarks' => 'required|string|max:1000' ]);

        $application->update([ 'remarks' => $request->remarks ]);

        AuditLog::create([
            'user_id' => Auth::id(),
            'action'  => 'Verified Application',
            'details' => "Staff verification complete for App #{$application->id}. Note: {$request->remarks}",
            'ip_address' => $request->ip()
        ]);

        return redirect()->back()->with('message', 'Verification assessment recorded. Forwarded for Admin approval.');
    }

    // 2. Reject / Return (If documents are invalid)
    public function reject(Request $request, Application $application)
    {
        $request->validate([ 'remarks' => 'required|string|max:1000' ]);

        $application->update([
            'status' => 'Rejected',
            'remarks' => $request->remarks,
        ]);

        // FIX: Trigger the notification!
        if ($application->user) {
            $application->user->notify(new ApplicationStatusAlert($application));
        }

        AuditLog::create([
            'user_id' => Auth::id(),
            'action'  => 'Returned Application',
            'details' => "Staff returned App #{$application->id}. Reason: {$request->remarks}",
            'ip_address' => $request->ip()
        ]);

        return redirect()->back()->with('warning', 'Application returned to applicant for correction.');
    }

    // ... (Reports and Exports) ...
    public function reportsIndex(Request $request) {
        $query = Application::query();
        if ($request->filled('status')) $query->where('status', $request->status);
        if ($request->filled('program')) $query->where('program', $request->program);
        if ($request->filled('barangay')) $query->where('barangay', $request->barangay);
        if ($request->filled('start_date')) $query->whereDate('created_at', '>=', $request->start_date);
        if ($request->filled('end_date')) $query->whereDate('created_at', '<=', $request->end_date);

        $applications = $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString();
        $stats = [
            'total' => Application::count(),
            'approved' => Application::where('status', 'Approved')->count(),
            'pending' => Application::where('status', 'Pending')->count(),
            'rejected' => Application::where('status', 'Rejected')->count(),
        ];
        $allBarangays = Application::distinct()->orderBy('barangay')->pluck('barangay');

        return Inertia::render('Staff/Reports/Index', [
            'applications' => $applications,
            'filters' => $request->only(['status', 'program', 'barangay', 'start_date', 'end_date']),
            'stats' => $stats,
            'allBarangays' => $allBarangays,
            'auth' => ['user' => Auth::user()]
        ]);
    }

    public function exportPdf(Request $request) {
        $query = Application::query();
        if ($request->filled('status')) $query->where('status', $request->status);
        if ($request->filled('program')) $query->where('program', $request->program);
        if ($request->filled('barangay')) $query->where('barangay', $request->barangay);
        if ($request->filled('start_date')) $query->whereDate('created_at', '>=', $request->start_date);
        if ($request->filled('end_date')) $query->whereDate('created_at', '<=', $request->end_date);

        $applications = $query->orderBy('created_at', 'desc')->get();
        $signatories = [
            'prepared_by' => Auth::user()->name,
            'reviewed_by' => Setting::where('key', 'signatory_social_worker')->value('value') ?? 'SOCIAL WORKER',
            'approved_by' => Setting::where('key', 'signatory_cswdo_head')->value('value') ?? 'CSWDO HEAD',
        ];

        $pdf = Pdf::loadView('pdf.assistance_report', [
            'applications' => $applications,
            'filters' => $request->all(),
            'signatories' => $signatories
        ]);
        return $pdf->download('Staff_Report_' . date('Y-m-d') . '.pdf');
    }

    public function exportExcel(Request $request) {
        $fileName = 'Staff_Report_' . date('Y-m-d_H-i') . '.csv';
        $query = Application::query();
        if ($request->filled('status')) $query->where('status', $request->status);
        if ($request->filled('program')) $query->where('program', $request->program);
        if ($request->filled('barangay')) $query->where('barangay', $request->barangay);
        if ($request->filled('start_date')) $query->whereDate('created_at', '>=', $request->start_date);
        if ($request->filled('end_date')) $query->whereDate('created_at', '<=', $request->end_date);

        $applications = $query->orderBy('created_at', 'desc')->get();
        $headers = [ "Content-type" => "text/csv", "Content-Disposition" => "attachment; filename=$fileName", "Pragma" => "no-cache", "Cache-Control" => "must-revalidate, post-check=0, pre-check=0", "Expires" => "0" ];
        $columns = ['Application ID', 'Applicant Name', 'Program Type', 'Status', 'Amount Released', 'Date Submitted', 'Date Approved', 'Contact Number', 'Barangay'];

        $callback = function() use($applications, $columns) {
            $file = fopen('php://output', 'w');
            fputs($file, "\xEF\xBB\xBF");
            fputcsv($file, $columns);
            foreach ($applications as $app) {
                fputcsv($file, [
                    $app->id,
                    $app->first_name . ' ' . $app->last_name,
                    $app->program,
                    $app->status,
                    $app->amount_released,
                    $app->created_at->format('Y-m-d'),
                    $app->approved_date ? date('Y-m-d', strtotime($app->approved_date)) : 'N/A',
                    "'" . $app->contact_number,
                    $app->barangay
                ]);
            }
            fclose($file);
        };
        return response()->stream($callback, 200, $headers);
    }
}
