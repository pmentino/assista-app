<?php

namespace App\Http\Controllers\Admin;

use App\Models\Setting;
use App\Http\Controllers\Controller;
use App\Models\Application;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Application::query();

        // 1. Filter by Status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // 2. Filter by Program
        if ($request->filled('program')) {
            $query->where('program', $request->program);
        }

        // 3. Filter by Date Range (Start)
        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        // 4. Filter by Date Range (End)
        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        // Fetch Data: Newest Created First
        $applications = $query->orderBy('created_at', 'desc')
                              ->paginate(15)
                              ->withQueryString();

        // Stats for cards
        $stats = [
            'total' => Application::count(),
            'approved' => Application::where('status', 'Approved')->count(),
            'pending' => Application::where('status', 'Pending')->count(),
            'rejected' => Application::where('status', 'Rejected')->count(),
        ];

        return Inertia::render('Admin/Reports/Index', [
            'applications' => $applications,
            'filters' => $request->only(['status', 'program', 'start_date', 'end_date']),
            'stats' => $stats,
            'auth' => ['user' => Auth::user()]
        ]);
    }

    public function exportPdf(Request $request)
    {
        // --- FIX START: Define the query and apply filters again ---
        $query = Application::query();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('program')) {
            $query->where('program', $request->program);
        }
        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }
        // --- FIX END ---

        $applications = $query->orderBy('created_at', 'desc')->get();

        // 1. Fetch Dynamic Signatories
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

        return $pdf->download('Assista_Report_' . date('Y-m-d') . '.pdf');
    }
}
