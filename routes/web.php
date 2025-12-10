<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\Admin\AidRequestController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\NewsController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Application as ApplicationModel;
use App\Models\News;

Route::get('/', function () {
    $news = [];
    try {
        if (\Illuminate\Support\Facades\Schema::hasTable('news')) {
             $news = News::latest()->take(3)->get();
        }
    } catch (\Exception $e) {
        // Ignore
    }

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'news' => $news,
        'auth' => ['user' => Auth::user()],
    ]);
});

Route::get('/dashboard', function () {
    $user = Auth::user();
    $applications = $user ? $user->applications()->latest()->get() : [];

    return Inertia::render('Dashboard', [
        'applications' => $applications,
        'auth' => [ 'user' => $user ],
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/applications/create', [ApplicationController::class, 'create'])->name('applications.create');
    Route::post('/applications', [ApplicationController::class, 'store'])->name('applications.store');

    Route::get('/applications/{application}/edit', [ApplicationController::class, 'edit'])->name('applications.edit');
    Route::post('/applications/{application}/update', [ApplicationController::class, 'update'])->name('applications.update');

    // Claim Stub Route
    Route::get('/applications/{application}/claim-stub', [ApplicationController::class, 'generateClaimStub'])->name('applications.claim-stub');
});

Route::middleware(['auth', 'verified', 'is_admin'])->prefix('admin')->name('admin.')->group(function () {

    // --- UPDATED ADMIN DASHBOARD LOGIC ---
    Route::get('/dashboard', function (Illuminate\Http\Request $request) {
        $now = \Carbon\Carbon::now();

        // 1. Fetch Budget for Current Month
        $currentBudget = \App\Models\MonthlyBudget::where('month', $now->month)
            ->where('year', $now->year)
            ->first();

        $budgetAmount = $currentBudget ? $currentBudget->amount : 0;

        // 2. Basic Stats & Released Calculation
        $releasedMonth = ApplicationModel::where('status', 'Approved')
            ->whereMonth('updated_at', $now->month)
            ->whereYear('updated_at', $now->year)
            ->sum('amount_released');

        // 3. Calculate Budget Stats
        $budgetStats = [
            'total_budget' => $budgetAmount,
            'total_used' => $releasedMonth,
            'remaining' => $budgetAmount - $releasedMonth,
            'percentage' => $budgetAmount > 0 ? ($releasedMonth / $budgetAmount) * 100 : 0,
        ];

        // ... (Keep existing Chart Data & Barangay Stats logic here) ...
        // ... (I'll condense the rest for brevity, assume the chart/barangay logic stays the same) ...

        // RE-COPY your existing Chart & Barangay logic here if you replaced the whole block,
        // OR just pass 'budgetStats' to Inertia below:

        // --- EXISTING STATS ARRAY ---
        $stats = [
            'total' => ApplicationModel::count(),
            'pending' => ApplicationModel::where('status', 'Pending')->count(),
            'approved' => ApplicationModel::where('status', 'Approved')->count(),
            'rejected' => ApplicationModel::where('status', 'Rejected')->count(),
            'total_released' => ApplicationModel::where('status', 'Approved')->sum('amount_released'),
            'released_today' => ApplicationModel::where('status', 'Approved')->whereDate('updated_at', $now->today())->sum('amount_released'),
            'released_week' => ApplicationModel::where('status', 'Approved')->whereBetween('updated_at', [$now->copy()->startOfWeek(), $now->copy()->endOfWeek()])->sum('amount_released'),
            'released_month' => $releasedMonth, // Use variable calculated above
        ];

        // --- RE-ADD CHART & BARANGAY QUERIES HERE (Same as previous step) ---
        // (Copy the Chart Data & Barangay Stats logic from your previous file version here)
        // ...
        // ...

        // Just to ensure the code works, here is the minimal Chart/Barangay logic again:
        $chartQuery = ApplicationModel::where('status', 'Approved');
        if ($request->has('start_date') && $request->start_date) { $chartQuery->whereDate('updated_at', '>=', $request->start_date); }
        else { $chartQuery->whereDate('updated_at', '>=', $now->copy()->subDays(30)); }
        if ($request->has('end_date') && $request->end_date) { $chartQuery->whereDate('updated_at', '<=', $request->end_date); }
        if ($request->has('barangay') && $request->barangay != '') { $chartQuery->where('barangay', $request->barangay); }

        $dailyData = $chartQuery->selectRaw('DATE(updated_at) as date, SUM(amount_released) as total')->groupBy('date')->orderBy('date')->get();
        $chartData = ['labels' => $dailyData->pluck('date'), 'values' => $dailyData->pluck('total')];

        // 3. Barangay Stats (Fixed Sorting)
        $barangayStats = ApplicationModel::where('status', 'Approved')
            ->select('barangay', \Illuminate\Support\Facades\DB::raw('count(*) as total'), \Illuminate\Support\Facades\DB::raw('sum(amount_released) as amount'))
            ->groupBy('barangay')
            // CAST to DECIMAL ensures 12500 > 2000
            ->orderByRaw('CAST(sum(amount_released) as DECIMAL(15,2)) DESC')
            ->limit(5)
            ->get();
        $allBarangays = ApplicationModel::select('barangay')->distinct()->orderBy('barangay')->pluck('barangay');
        $currentFilters = $request->only(['barangay', 'start_date', 'end_date']);


        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'budgetStats' => $budgetStats, // <--- PASS THIS NEW DATA
            'budgetLogs'  => \App\Models\BudgetLog::with('user')->latest()->take(5)->get(),
            'chartData' => $chartData,
            'barangayStats' => $barangayStats,
            'allBarangays' => $allBarangays,
            'filters' => $currentFilters,
            'auth' => [ 'user' => Auth::user() ]
        ]);
    })->name('dashboard');

    Route::post('/dashboard/budget', function (Illuminate\Http\Request $request) {
        $request->validate([
            'amount' => 'required|numeric|min:0',
        ]);

        $now = \Carbon\Carbon::now();

        // Update Budget
        \App\Models\MonthlyBudget::updateOrCreate(
            ['month' => $now->month, 'year' => $now->year],
            ['amount' => $request->amount]
        );

        // LOGGING (Fixes the red error)
        \App\Models\BudgetLog::create([
            'user_id' => Auth::id(),
            'action' => 'Budget Update',
            'amount' => $request->amount,
            'balance_after' => $request->amount, // <--- YOU MUST HAVE THIS LINE
        ]);

        return redirect()->back()->with('message', 'Budget updated successfully.');
    })->name('dashboard.budget');

    Route::get('/applications', [AidRequestController::class, 'index'])->name('applications.index');

    Route::get('/applications/{application}', function (ApplicationModel $application) {
        return Inertia::render('Admin/ApplicationShow', [
            'application' => $application->load('user'),
            'auth' => [ 'user' => Auth::user() ]
        ]);
    })->name('applications.show');

    Route::post('/applications/{application}/approve', [ApplicationController::class, 'approve'])->name('applications.approve');
    Route::get('/applications/{application}/reject', [ApplicationController::class, 'reject'])->name('applications.reject');
    Route::post('/applications/{application}/remarks', [ApplicationController::class, 'addRemark'])->name('applications.remarks.store');

    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export', [ReportController::class, 'export'])->name('reports.export');
    Route::get('/reports/export-pdf', [ReportController::class, 'exportPdf'])->name('reports.export-pdf');

    Route::resource('news', NewsController::class);
});

require __DIR__.'/auth.php';
