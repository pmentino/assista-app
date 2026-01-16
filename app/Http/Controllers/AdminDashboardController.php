<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\AssistanceProgram;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

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

        // Search Filter (Queue Specific)
        if ($request->filled('q_search')) {
            $search = $request->q_search;
            $queueQuery->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('id', 'like', "%{$search}%");
            });
        }

        // Program Filter (Queue Specific)
        if ($request->filled('q_program')) {
            $queueQuery->where('program', $request->q_program);
        }

        // Sorting (Queue Specific)
        if ($request->input('q_sort') === 'newest') {
            $queueQuery->latest();
        } else {
            $queueQuery->oldest(); // Default: First-In-First-Out (FIFO)
        }

        // FIX: Use get() instead of paginate() for Dashboard widgets
        $pendingApplications = $queueQuery->take(10)->get();

        // 4. Dropdown Data
        $allBarangays = Application::distinct()->orderBy('barangay')->pluck('barangay');
        $programs = AssistanceProgram::where('is_active', true)->pluck('title');

        // 5. Chart Data (Placeholder structure)
        $chartData = [
            'labels' => ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            'values' => [0, 0, 0, 0]
        ];
        $barangayStats = [];

        return Inertia::render('Admin/Dashboard', [
            'stats'               => $stats,
            'budgetStats'         => $budgetStats,
            'chartData'           => $chartData,
            'barangayStats'       => $barangayStats,
            'allBarangays'        => $allBarangays,
            'programs'            => $programs, // Pass programs for dropdown
            'pendingApplications' => $pendingApplications, // Pass the list
            'filters'             => $request->all(), // Pass all filters back to maintain state
            'auth'                => ['user' => Auth::user()],
        ]);
    }
}
