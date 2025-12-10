<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Application;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        // 1. QUERY BUILDER
        $query = Application::query();

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }
        if ($request->has('program') && $request->program) {
            $query->where('program', $request->program);
        }
        if ($request->has('start_date') && $request->start_date) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->has('end_date') && $request->end_date) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        // 2. GET PAGINATED RESULTS
        $applications = $query->orderBy('created_at', 'desc')
                              ->paginate(10)
                              ->withQueryString();

        // 3. CALCULATE STATS (This was missing and causing the blank page!)
        // We calculate stats based on the *filtered* query if you want dynamic stats,
        // or global stats. Let's do global stats for the cards.
        $stats = [
            'total' => Application::count(),
            'approved' => Application::where('status', 'Approved')->count(),
            'pending' => Application::where('status', 'Pending')->count(),
            'rejected' => Application::where('status', 'Rejected')->count(),
            'total_amount' => Application::where('status', 'Approved')->sum('amount_released'),
        ];

        // 4. RENDER VIEW
        return Inertia::render('Admin/Reports/Index', [
            'applications' => $applications,
            'filters' => $request->only(['status', 'program', 'start_date', 'end_date']),
            'stats' => $stats, // <--- PASSING THE STATS PROP HERE FIXES THE BLANK PAGE
            'auth' => ['user' => auth()->user()]
        ]);
    }

    // --- PDF EXPORT FUNCTION (Updated for Time & Approved Date) ---
    public function exportPdf(Request $request)
    {
        // 1. Filter by 'Approved' status only
        $query = Application::where('status', 'Approved');

        // 2. Filter by Program
        if ($request->has('program') && $request->program) {
            $query->where('program', $request->program);
        }

        // 3. Filter by Date Range (Using the NEW approved_date column)
        if ($request->has('start_date') && $request->start_date) {
            $query->whereDate('approved_date', '>=', $request->start_date);
        }
        if ($request->has('end_date') && $request->end_date) {
            $query->whereDate('approved_date', '<=', $request->end_date);
        }

        // 4. Get Results sorted by Approval Time
        $applications = $query->orderBy('approved_date', 'desc')->get();

        // 5. Generate PDF
        $pdf = Pdf::loadView('pdf.assistance_report', [
            'applications' => $applications,
            'start_date' => $request->start_date, // Pass dates for the header
            'end_date' => $request->end_date
        ]);

        $pdf->setPaper('a4', 'landscape');

        return $pdf->download('AICS_Report_' . date('Y-m-d') . '.pdf');
    }
}
