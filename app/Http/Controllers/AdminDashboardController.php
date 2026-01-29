<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\AssistanceProgram;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        // 1. General Stats
        $stats = [
            'total'    => Application::count(),
            'pending'  => Application::where('status', 'Pending')->count(),
            'approved' => Application::where('status', 'Approved')->count(),
            'rejected' => Application::where('status', 'Rejected')->count(),
        ];

        // 2. Budget Stats
        $totalBudget = (float) Setting::where('key', 'monthly_budget')->value('value') ?? 500000;
        $totalUsed = Application::where('status', 'Approved')
            ->whereMonth('approved_date', now()->month)
            ->whereYear('approved_date', now()->year)
            ->sum('amount_released');

        $budgetStats = [
            'total_budget' => $totalBudget,
            'total_used'   => $totalUsed,
            'remaining'    => $totalBudget - $totalUsed,
            'percentage'   => $totalBudget > 0 ? ($totalUsed / $totalBudget) * 100 : 0,
        ];

        // 3. Queue Filtering Logic (Verification Queue)
        $queueQuery = Application::where('status', 'Pending')->with('user');

        if ($request->filled('q_search')) {
            $search = $request->q_search;
            $queueQuery->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('id', 'like', "%{$search}%");
            });
        }

        if ($request->filled('q_program')) {
            $queueQuery->where('program', $request->q_program);
        }

        if ($request->input('q_sort') === 'newest') {
            $queueQuery->latest();
        } else {
            $queueQuery->oldest();
        }

        $pendingApplications = $queueQuery->take(10)->get();

        // 4. Dropdown Data
        $allBarangays = Application::distinct()->orderBy('barangay')->pluck('barangay');
        $programs = AssistanceProgram::where('is_active', true)->pluck('title');

        // 5. CHART DATA (REAL DATA)

        // A. Financial Trends (Last 6 Months)
        $chartDataRaw = Application::where('status', 'Approved')
            ->selectRaw("DATE_FORMAT(approved_date, '%Y-%m') as label, SUM(amount_released) as total")
            ->groupBy('label')
            ->orderBy('label')
            ->limit(6)
            ->get();

        $chartData = [
            'labels' => $chartDataRaw->pluck('label')->map(function($d) {
                return date('M Y', strtotime($d . '-01')); // Format: "Jan 2026"
            }),
            'values' => $chartDataRaw->pluck('total'),
        ];

        // B. Top Barangays (Count & Amount)
        // This fixes the modal empty data issue
        $barangayStats = Application::select('barangay', DB::raw('count(*) as total'), DB::raw('sum(amount_released) as amount'))
            ->whereNotNull('barangay')
            ->groupBy('barangay')
            ->orderByDesc('total')
            ->take(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats'           => $stats,
            'budgetStats'     => $budgetStats,
            'chartData'       => $chartData,
            'barangayStats'   => $barangayStats, // Passed correctly now
            'allBarangays'    => $allBarangays,
            'programs'        => $programs,
            'pendingApplications' => $pendingApplications,
            'filters'         => $request->all(),
            'queueFilters'    => $request->only(['q_search', 'q_program', 'q_sort']), // Pass queue filters separately
            'auth'            => ['user' => Auth::user()],
        ]);
    }
}
