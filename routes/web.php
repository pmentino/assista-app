<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\Admin\AidRequestController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\AssistanceProgramController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UserController; // <--- NEW IMPORT
use App\Http\Controllers\Staff\StaffController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Application as ApplicationModel;
use App\Models\News;
use App\Models\AssistanceProgram;

// --- PUBLIC ROUTES ---

Route::get('/', function () {
    $news = [];
    $programs = [];
    $settings = [];

    try {
        // Fetch News
        if (\Illuminate\Support\Facades\Schema::hasTable('news')) {
             $news = News::latest()->take(3)->get();
        }

        // Fetch Programs
        if (\Illuminate\Support\Facades\Schema::hasTable('assistance_programs')) {
            $programs = AssistanceProgram::where('is_active', true)->get();
        }

        // --- FETCH SETTINGS (The Courier Fix) ---
        if (\Illuminate\Support\Facades\Schema::hasTable('settings')) {
            // This converts the database rows into a simple list:
            // { "system_announcement": "text", "accepting_applications": "1" }
            $settings = \App\Models\Setting::all()->pluck('value', 'key');
        }
    } catch (\Exception $e) {
        // Silent fail if DB isn't set up yet
    }

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
        'news' => News::latest()->get(),
        'auth' => ['user' => Auth::user()]
    ]);
})->name('news.index');

Route::get('/news/{news}', function (News $news) {
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
        'auth' => [
            'user' => $user,
            'notifications' => $user ? $user->unreadNotifications : []
        ],
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // --- PROFILE ROUTES ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // --- APPLICATION ROUTES ---
    Route::get('/applications/create', [ApplicationController::class, 'create'])->name('applications.create');
    Route::post('/applications', [ApplicationController::class, 'store'])->name('applications.store');
    Route::get('/applications/{application}/edit', [ApplicationController::class, 'edit'])->name('applications.edit');
    Route::post('/applications/{application}/update', [ApplicationController::class, 'update'])->name('applications.update');
    Route::get('/applications/{application}/claim-stub', [ApplicationController::class, 'generateClaimStub'])->name('applications.claim-stub');

    // --- NOTIFICATION ROUTES ---
    Route::get('/notifications', function (Request $request) {
        return response()->json([
            'notifications' => $request->user()->notifications()->latest()->take(10)->get(),
            'unreadCount' => $request->user()->unreadNotifications()->count()
        ]);
    })->name('notifications.index');

    Route::post('/notifications/{id}/read', function (Request $request, $id) {
        $request->user()->notifications()->where('id', $id)->first()?->markAsRead();
        return response()->noContent();
    })->name('notifications.read');

    Route::post('/notifications/read-all', function (Request $request) {
        $request->user()->unreadNotifications->markAsRead();
        return response()->noContent();
    })->name('notifications.readAll');
});


// --- ADMIN ROUTES ---

Route::middleware(['auth', 'verified', 'is_admin'])->prefix('admin')->name('admin.')->group(function () {

    // 1. ADMIN DASHBOARD ROUTE
    Route::get('/dashboard', function (Request $request) {
        $now = \Carbon\Carbon::now();

        // --- BUDGET LOGIC ---
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

        // --- STATS LOGIC ---
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

        // --- CHART LOGIC ---
        $chartQuery = ApplicationModel::where('status', 'Approved');
        if ($request->has('start_date') && $request->start_date) { $chartQuery->whereDate('updated_at', '>=', $request->start_date); }
        else { $chartQuery->whereDate('updated_at', '>=', $now->copy()->subDays(30)); }
        if ($request->has('end_date') && $request->end_date) { $chartQuery->whereDate('updated_at', '<=', $request->end_date); }
        if ($request->has('barangay') && $request->barangay != '') { $chartQuery->where('barangay', $request->barangay); }

        $dailyData = $chartQuery->selectRaw('DATE(updated_at) as date, SUM(amount_released) as total')->groupBy('date')->orderBy('date')->get();
        $chartData = ['labels' => $dailyData->pluck('date'), 'values' => $dailyData->pluck('total')];

        // --- BARANGAY STATS ---
        $barangayStats = ApplicationModel::where('status', 'Approved')
            ->select('barangay', \Illuminate\Support\Facades\DB::raw('count(*) as total'), \Illuminate\Support\Facades\DB::raw('sum(amount_released) as amount'))
            ->groupBy('barangay')
            ->orderByRaw('CAST(sum(amount_released) as DECIMAL(15,2)) DESC')
            ->get();

        $allBarangays = ApplicationModel::select('barangay')->distinct()->orderBy('barangay')->pluck('barangay');
        $currentFilters = $request->only(['barangay', 'start_date', 'end_date']);

        $pendingApplications = ApplicationModel::where('status', 'Pending')
            ->orderBy('created_at', 'asc')
            ->take(5)
            ->get()
            ->map(function ($app) {
                return [
                    'id' => $app->id,
                    'first_name' => $app->first_name,
                    'last_name' => $app->last_name,
                    'barangay' => $app->barangay,
                    'assistance_type' => $app->program,
                    'created_at' => $app->created_at,
                ];
            })
            ->values();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'budgetStats' => $budgetStats,
            'budgetLogs'  => \App\Models\BudgetLog::with('user')->latest()->take(5)->get(),
            'chartData' => $chartData,
            'barangayStats' => $barangayStats,
            'allBarangays' => $allBarangays,
            'filters' => $currentFilters,
            'pendingApplications' => $pendingApplications,
            'auth' => [
                'user' => Auth::user(),
                'notifications' => Auth::user() ? Auth::user()->unreadNotifications : []
            ],
        ]);
    })->name('dashboard');

    // 2. AUDIT LOGS ROUTE
    Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit-logs');

    // 3. BUDGET UPDATE ROUTE
    Route::post('/dashboard/budget', function (Request $request) {
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

    // Find this route in your Admin Group
    // Find this route in your Admin Group
    Route::get('/applications/{application}', function (ApplicationModel $application) {

        // Fetch program to get default amount
        $programSettings = \App\Models\AssistanceProgram::where('title', $application->program)->first();

        return Inertia::render('Admin/ApplicationShow', [
            'application' => $application->load('user'),
            'programSettings' => $programSettings, // Sending to Frontend
            'auth' => [ 'user' => Auth::user() ]
        ]);
    })->name('applications.show');

    Route::delete('/applications/{application}', [AidRequestController::class, 'destroy'])->name('applications.destroy');
    Route::post('/applications/{application}/approve', [App\Http\Controllers\ApplicationController::class, 'approve'])->name('applications.approve');
    Route::get('/applications/{application}/reject', [App\Http\Controllers\ApplicationController::class, 'reject'])->name('applications.reject');
    Route::post('/applications/{application}/remarks', [App\Http\Controllers\ApplicationController::class, 'addRemark'])->name('applications.remarks.store');
    Route::post('/applications/{application}/note', [App\Http\Controllers\ApplicationController::class, 'saveNote'])->name('applications.note.store');

    // 5. REPORTS ROUTES
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export-pdf', [ReportController::class, 'exportPdf'])->name('reports.export-pdf');
    Route::get('/reports/export-excel', [ReportController::class, 'exportExcel'])->name('reports.export-excel');

    // 6. ADMIN NEWS ROUTES
    Route::resource('news', NewsController::class);

    // 7. ASSISTANCE PROGRAMS MANAGEMENT
    Route::get('/programs', [AssistanceProgramController::class, 'index'])->name('programs.index');
    Route::post('/programs', [AssistanceProgramController::class, 'store'])->name('programs.store');
    Route::put('/programs/{program}', [AssistanceProgramController::class, 'update'])->name('programs.update');
    Route::delete('/programs/{program}', [AssistanceProgramController::class, 'destroy'])->name('programs.destroy');

    // 8. SYSTEM SETTINGS
    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');

    // 9. USER MANAGEMENT (Sir Mark's Suggestion)
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users/{user}/role', [UserController::class, 'changeRole'])->name('users.role');
    Route::post('/users/{user}/status', [UserController::class, 'toggleStatus'])->name('users.status');

});

// --- STAFF ROUTES ---
Route::middleware(['auth', 'verified', 'is_staff'])->prefix('staff')->name('staff.')->group(function () {
    Route::get('/dashboard', [StaffController::class, 'dashboard'])->name('dashboard');
    Route::get('/applications', [StaffController::class, 'applicationsIndex'])->name('applications.index');
    Route::get('/applications/{application}', [StaffController::class, 'applicationsShow'])->name('applications.show');
    Route::post('/applications/{application}/remarks', [StaffController::class, 'storeRemark'])->name('applications.remarks.store');

    // --- ADD THIS NEW LINE HERE: ---
    Route::post('/applications/{application}/reject', [StaffController::class, 'reject'])->name('applications.reject');

    // --- STAFF REPORTS ---
    Route::get('/reports', [StaffController::class, 'reportsIndex'])->name('reports.index');
    Route::get('/reports/export-pdf', [StaffController::class, 'exportPdf'])->name('reports.export-pdf');
    Route::get('/reports/export-excel', [StaffController::class, 'exportExcel'])->name('reports.export-excel');
});

require __DIR__.'/auth.php';
