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

    public function export(Request $request)
    {
        return redirect()->back()->with('error', 'Excel export coming soon.');
    }

    // --- PDF EXPORT FUNCTION (Fixed) ---
    public function exportPdf(Request $request)
    {
        // Reuse filters for the report
        $query = Application::where('status', 'Approved'); // Default to Approved

        if ($request->has('program') && $request->program) {
            $query->where('program', $request->program);
        }
        if ($request->has('start_date') && $request->start_date) {
            $query->whereDate('updated_at', '>=', $request->start_date);
        }
        if ($request->has('end_date') && $request->end_date) {
            $query->whereDate('updated_at', '<=', $request->end_date);
        }

        $applications = $query->orderBy('updated_at', 'desc')->get();

        $pdf = Pdf::loadView('pdf.assistance_report', [
            'applications' => $applications
        ]);

        $pdf->setPaper('a4', 'landscape');

        return $pdf->download('AICS_Report_' . date('Y-m-d') . '.pdf');
    }
}
