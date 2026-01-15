<?php

namespace App\Http\Controllers\Staff;

use App\Notifications\ApplicationStatusAlert; // <--- Add this line
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Application;
use App\Models\AssistanceProgram; // <--- CRITICAL IMPORT
use App\Models\Setting;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

class StaffController extends Controller
{
    public function dashboard(Request $request)
    {
        // 1. Get Stats
        $stats = [
            'total'   => Application::count(),
            'pending' => Application::where('status', 'Pending')->count(),
            'today'   => Application::whereDate('created_at', \Carbon\Carbon::today())->count(),
        ];

        // 2. Queue Logic
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

        if ($request->sort === 'newest') {
            $query->latest();
        } else {
            $query->oldest();
        }

        $queue = $query->take(10)->get();

        // 3. Get Programs (Safely)
        $programs = AssistanceProgram::where('is_active', true)
                    ->orderBy('title')
                    ->pluck('title');

        return Inertia::render('Staff/Dashboard', [
            'stats' => $stats,
            'queue' => $queue,
            'programs' => $programs,
            // FIX: Ensure filters is an array, never null
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

        return Inertia::render('Staff/ApplicationsIndex', [
            'applications' => $applications,
            'filters' => $request->only(['search', 'status', 'program', 'barangay']),
            'sort_by' => $request->sort_by,
            'sort_direction' => $request->sort_direction,
            'auth' => ['user' => Auth::user()]
        ]);
    }

    public function applicationsShow(Application $application)
    {
        return Inertia::render('Staff/ApplicationShow', [
            'application' => $application->load('user'),
            'auth' => ['user' => Auth::user()]
        ]);
    }

    public function storeRemark(Request $request, Application $application)
    {
        $request->validate([
            'remarks' => 'required|string|max:1000',
        ]);

        $application->update([
            'remarks' => $request->remarks
        ]);

        return redirect()->back()->with('message', 'Remark saved successfully.');
    }

    // --- ADD THIS NEW FUNCTION ---
    public function reject(Request $request, Application $application)
    {
        // 1. Validate that a reason was provided
        $request->validate([
            'remarks' => 'required|string|max:1000',
        ]);

        // 2. Update the status and save the reason
        $application->update([
            'status' => 'Rejected',
            'remarks' => $request->remarks,
        ]);

        // 3. --- FIX: Trigger the Notification Bell ---
        if ($application->user) {
            $application->user->notify(new ApplicationStatusAlert($application));
        }

        // 4. Return to the page
        return redirect()->back()->with('message', 'Application returned/rejected successfully.');
    }

    // --- STAFF REPORTING MODULE ---

    public function reportsIndex(Request $request)
    {
        $query = Application::query();

        // Filters (Same as Admin)
        if ($request->filled('status')) $query->where('status', $request->status);
        if ($request->filled('program')) $query->where('program', $request->program);
        if ($request->filled('start_date')) $query->whereDate('created_at', '>=', $request->start_date);
        if ($request->filled('end_date')) $query->whereDate('created_at', '<=', $request->end_date);

        // Fetch Data
        $applications = $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString();

        // Stats
        $stats = [
            'total' => Application::count(),
            'approved' => Application::where('status', 'Approved')->count(),
            'pending' => Application::where('status', 'Pending')->count(),
            'rejected' => Application::where('status', 'Rejected')->count(),
        ];

        return Inertia::render('Staff/Reports/Index', [
            'applications' => $applications,
            'filters' => $request->only(['status', 'program', 'start_date', 'end_date']),
            'stats' => $stats,
            'auth' => ['user' => Auth::user()]
        ]);
    }

    public function exportPdf(Request $request)
    {
        $query = Application::query();

        if ($request->filled('status')) $query->where('status', $request->status);
        if ($request->filled('program')) $query->where('program', $request->program);
        if ($request->filled('start_date')) $query->whereDate('created_at', '>=', $request->start_date);
        if ($request->filled('end_date')) $query->whereDate('created_at', '<=', $request->end_date);

        $applications = $query->orderBy('created_at', 'desc')->get();

        $signatories = [
            'prepared_by' => Auth::user()->name, // Staff Name
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

    public function exportExcel(Request $request)
    {
        // Re-use exactly the same logic as Admin, just accessible by Staff
        $fileName = 'Staff_Report_' . date('Y-m-d_H-i') . '.csv';
        $query = Application::query();

        if ($request->filled('status')) $query->where('status', $request->status);
        if ($request->filled('program')) $query->where('program', $request->program);
        if ($request->filled('start_date')) $query->whereDate('created_at', '>=', $request->start_date);
        if ($request->filled('end_date')) $query->whereDate('created_at', '<=', $request->end_date);

        $applications = $query->orderBy('created_at', 'desc')->get();

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['Application ID', 'Applicant Name', 'Program Type', 'Status', 'Amount Released', 'Date Submitted', 'Date Approved', 'Contact Number', 'Barangay'];

        $callback = function() use($applications, $columns) {
            $file = fopen('php://output', 'w');
            fputs($file, "\xEF\xBB\xBF"); // BOM for Excel
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
                    "'" . $app->contact_number, // Force text format
                    $app->barangay
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
