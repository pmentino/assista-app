<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\Admin\AidRequestController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\AssistanceProgramController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Application as ApplicationModel;
use App\Models\News;
use App\Models\AssistanceProgram;
use App\Http\Controllers\Admin\SettingController;

// --- PUBLIC ROUTES ---

Route::get('/', function () {
    $news = [];
    $programs = [];
    $settings = [];

    try {
        if (\Illuminate\Support\Facades\Schema::hasTable('news')) {
             $news = News::latest()->take(3)->get();
        }
        if (\Illuminate\Support\Facades\Schema::hasTable('assistance_programs')) {
            $programs = AssistanceProgram::where('is_active', true)->get();
        }
        if (\Illuminate\Support\Facades\Schema::hasTable('settings')) {
            $settings = \App\Models\Setting::all()->pluck('value', 'key');
        }
    } catch (\Exception $e) { }

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'news' => $news,
        'programs' => $programs,
        'settings' => $settings,
        'auth' => ['user' => Auth::user()],
    ]);
});

Route::get('/news', function () {
    return Inertia::render('News/Index', [
        'news' => \App\Models\News::latest()->get(),
        'auth' => ['user' => Auth::user()]
    ]);
})->name('news.index');

Route::get('/news/{news}', function (\App\Models\News $news) {
    return Inertia::render('News/Show', [
        'news' => $news,
        'auth' => ['user' => Auth::user()]
    ]);
})->name('news.show');


// --- USER AUTHENTICATED ROUTES ---

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

    Route::get('/applications/{application}/claim-stub', [ApplicationController::class, 'generateClaimStub'])->name('applications.claim-stub');
});


// --- ADMIN ROUTES ---

Route::middleware(['auth', 'verified', 'is_admin'])->prefix('admin')->name('admin.')->group(function () {

    // 1. ADMIN DASHBOARD
    Route::get('/dashboard', function (Illuminate\Http\Request $request) {
        $now = \Carbon\Carbon::now();

        $currentBudget = \App\Models\MonthlyBudget::where('month', $now->month)
            ->where('year', $now->year)
            ->first();
        $budgetAmount = $currentBudget ? $currentBudget->amount : 0;

        $releasedMonth = ApplicationModel::where('status', 'Approved')
            ->whereMonth('updated_at', $now->month)
            ->whereYear('updated_at', $now->year)
            ->sum('amount_released');

        $budgetStats = [
            'total_budget' => $budgetAmount,
            'total_used' => $releasedMonth,
            'remaining' => $budgetAmount - $releasedMonth,
            'percentage' => $budgetAmount > 0 ? ($releasedMonth / $budgetAmount) * 100 : 0,
        ];

        $stats = [
            'total' => ApplicationModel::count(),
            'pending' => ApplicationModel::where('status', 'Pending')->count(),
            'approved' => ApplicationModel::where('status', 'Approved')->count(),
            'rejected' => ApplicationModel::where('status', 'Rejected')->count(),
            'total_released' => ApplicationModel::where('status', 'Approved')->sum('amount_released'),
            'released_today' => ApplicationModel::where('status', 'Approved')->whereDate('updated_at', $now->today())->sum('amount_released'),
            'released_week' => ApplicationModel::where('status', 'Approved')->whereBetween('updated_at', [$now->copy()->startOfWeek(), $now->copy()->endOfWeek()])->sum('amount_released'),
            'released_month' => $releasedMonth,
        ];

        $chartQuery = ApplicationModel::where('status', 'Approved');
        if ($request->has('start_date') && $request->start_date) { $chartQuery->whereDate('updated_at', '>=', $request->start_date); }
        else { $chartQuery->whereDate('updated_at', '>=', $now->copy()->subDays(30)); }
        if ($request->has('end_date') && $request->end_date) { $chartQuery->whereDate('updated_at', '<=', $request->end_date); }
        if ($request->has('barangay') && $request->barangay != '') { $chartQuery->where('barangay', $request->barangay); }

        $dailyData = $chartQuery->selectRaw('DATE(updated_at) as date, SUM(amount_released) as total')->groupBy('date')->orderBy('date')->get();
        $chartData = ['labels' => $dailyData->pluck('date'), 'values' => $dailyData->pluck('total')];

        $barangayStats = ApplicationModel::where('status', 'Approved')
            ->select('barangay', \Illuminate\Support\Facades\DB::raw('count(*) as total'), \Illuminate\Support\Facades\DB::raw('sum(amount_released) as amount'))
            ->groupBy('barangay')
            ->orderByRaw('CAST(sum(amount_released) as DECIMAL(15,2)) DESC')
            ->get();

        $allBarangays = ApplicationModel::select('barangay')->distinct()->orderBy('barangay')->pluck('barangay');
        $currentFilters = $request->only(['barangay', 'start_date', 'end_date']);

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'budgetStats' => $budgetStats,
            'budgetLogs'  => \App\Models\BudgetLog::with('user')->latest()->take(5)->get(),
            'chartData' => $chartData,
            'barangayStats' => $barangayStats,
            'allBarangays' => $allBarangays,
            'filters' => $currentFilters,
            'auth' => [ 'user' => Auth::user() ]
        ]);
    })->name('dashboard');

    // 2. AUDIT LOGS ROUTE
    Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit-logs');

    // 3. BUDGET UPDATE ROUTE
    Route::post('/dashboard/budget', function (Illuminate\Http\Request $request) {
        $request->validate([ 'amount' => 'required|numeric|min:0' ]);
        $now = \Carbon\Carbon::now();

        \App\Models\MonthlyBudget::updateOrCreate(
            ['month' => $now->month, 'year' => $now->year],
            ['amount' => $request->amount]
        );

        \App\Models\BudgetLog::create([
            'user_id' => Auth::id(),
            'action' => 'Budget Update',
            'amount' => $request->amount,
            'balance_after' => $request->amount,
        ]);

        \App\Models\AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'Updated Monthly Budget',
            'details' => "Updated budget for " . $now->format('F Y') . " to ₱" . number_format($request->amount, 2),
        ]);

        return redirect()->back()->with('message', 'Budget updated successfully.');
    })->name('dashboard.budget');

    // 4. APPLICATIONS ROUTES
    Route::get('/applications', [AidRequestController::class, 'index'])->name('applications.index');

    Route::get('/applications/{application}', function (ApplicationModel $application) {
        return Inertia::render('Admin/ApplicationShow', [
            'application' => $application->load('user'),
            'auth' => [ 'user' => Auth::user() ]
        ]);
    })->name('applications.show');

    Route::post('/applications/{application}/approve', [App\Http\Controllers\ApplicationController::class, 'approve'])->name('applications.approve');
    Route::get('/applications/{application}/reject', [App\Http\Controllers\ApplicationController::class, 'reject'])->name('applications.reject');
    Route::post('/applications/{application}/remarks', [App\Http\Controllers\ApplicationController::class, 'addRemark'])->name('applications.remarks.store');

    // 5. REPORTS ROUTES
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export-pdf', [ReportController::class, 'exportPdf'])->name('reports.export-pdf');
    Route::get('/reports/export-excel', [ReportController::class, 'exportExcel'])->name('reports.export-excel');

    // 6. ADMIN NEWS ROUTES
    // You mentioned this has a bug too. Using resource here, but we fixed the controller return.
    Route::resource('news', NewsController::class);

    // 7. ASSISTANCE PROGRAMS MANAGEMENT
    // --- MANUAL ROUTES TO FIX 405 ERROR ---
    Route::get('/programs', [AssistanceProgramController::class, 'index'])->name('programs.index');
    Route::post('/programs', [AssistanceProgramController::class, 'store'])->name('programs.store');
    Route::put('/programs/{program}', [AssistanceProgramController::class, 'update'])->name('programs.update');
    // The Explicit Delete:
    Route::delete('/programs/{program}', [AssistanceProgramController::class, 'destroy'])->name('programs.destroy');

    // 8. SYSTEM SETTINGS
    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');

});

require __DIR__.'/auth.php';
