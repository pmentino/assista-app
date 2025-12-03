<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf; // Ensure you ran: composer require barryvdh/laravel-dompdf
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only('status', 'program', 'start_date', 'end_date');

        // Base Query
        $query = Application::with('user')
            ->when($request->input('status'), fn($q, $status) => $q->where('status', $status))
            ->when($request->input('program'), fn($q, $program) => $q->where('program', $program))
            // Date Range Filtering
            ->when($request->input('start_date'), fn($q, $date) => $q->whereDate('created_at', '>=', $date))
            ->when($request->input('end_date'), fn($q, $date) => $q->whereDate('created_at', '<=', $date));

        // Get Summary Stats (Based on the filtered data)
        $stats = [
            'total' => (clone $query)->count(),
            'approved' => (clone $query)->where('status', 'Approved')->count(),
            'rejected' => (clone $query)->where('status', 'Rejected')->count(),
            'pending' => (clone $query)->where('status', 'Pending')->count(),
        ];

        // Get Paginated Results for the Table
        $applications = (clone $query)->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Reports/Index', [
            'applications' => $applications,
            'filters' => $filters,
            'stats' => $stats, // Pass stats to the frontend
        ]);
    }

    public function exportPdf(Request $request)
    {
        $filters = $request->only('status', 'program', 'start_date', 'end_date');

        // Fetch ALL matching data (no pagination for export)
        $applications = Application::with('user')
            ->when($request->input('status'), fn($q, $status) => $q->where('status', $status))
            ->when($request->input('program'), fn($q, $program) => $q->where('program', $program))
            ->when($request->input('start_date'), fn($q, $date) => $q->whereDate('created_at', '>=', $date))
            ->when($request->input('end_date'), fn($q, $date) => $q->whereDate('created_at', '<=', $date))
            ->latest()
            ->get();

        // Calculate stats for the PDF header
        $stats = [
            'total' => $applications->count(),
            'approved' => $applications->where('status', 'Approved')->count(),
            'rejected' => $applications->where('status', 'Rejected')->count(),
        ];

        // Generate PDF using a Blade View
        $pdf = Pdf::loadView('pdf.report', [
            'applications' => $applications,
            'filters' => $filters,
            'stats' => $stats,
            'date_generated' => Carbon::now()->format('F d, Y h:i A'),
        ]);

        // Set paper to Landscape for better table fit
        $pdf->setPaper('a4', 'landscape');

        return $pdf->download('AICS_Report_' . Carbon::now()->format('Ymd_His') . '.pdf');
    }
}
