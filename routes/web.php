<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\Admin\AidRequestController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\AssistanceProgramController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Staff\StaffController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Application as ApplicationModel;
use App\Models\News;
use App\Models\AssistanceProgram;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// --- PUBLIC ROUTES (No Login Required) ---

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
    } catch (\Exception $e) {}

    // --- MANUAL TRANSLATION LOADER (Added for Welcome Page) ---
    $locale = session('locale', 'en');
    $path = resource_path("lang/{$locale}.json");
    $translations = [];

    if (file_exists($path)) {
        $translations = json_decode(file_get_contents($path), true) ?? [];
    }
    // ----------------------------------------------------------

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'news' => $news,
        'programs' => $programs,
        'settings' => $settings,
        'auth' => ['user' => Auth::user()],
        // Pass Translation Data
        'translations' => $translations,
        'locale' => $locale
    ]);
});

// Language Switcher
    Route::get('language/{locale}', function ($locale) {
        if (in_array($locale, ['en', 'fil', 'hil'])) {
            session()->put('locale', $locale);
            session()->save();
        }
        return back();
    })->name('language.switch');

// Tracking Routes
Route::get('/track', [ApplicationController::class, 'showTrack'])->name('track.index');
Route::post('/track', [ApplicationController::class, 'track'])->name('track.check');

// Public News Routes
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


// --- AUTHENTICATED ROUTES (Login Required) ---

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('/dashboard', function () {
        $user = Auth::user();
        $applications = $user ? $user->applications()->latest()->get() : [];

        // Manual Translation Loader
        $locale = session('locale', 'en');
        $path = resource_path("lang/{$locale}.json");
        $translations = [];

        if (file_exists($path)) {
            $translations = json_decode(file_get_contents($path), true) ?? [];
        }

        return Inertia::render('Dashboard', [
            'applications' => $applications,
            'auth' => [
                'user' => $user,
                'notifications' => $user ? $user->unreadNotifications : []
            ],
            'translations' => $translations,
            'locale' => $locale
        ]);
    })->name('dashboard');


    // FAQs
    Route::get('/faqs', function () {
        $locale = session('locale', 'en');
        $path = base_path("resources/lang/{$locale}.json");
        $translations = file_exists($path) ? json_decode(file_get_contents($path), true) : [];

        return Inertia::render('Faqs', [
            'auth' => ['user' => Auth::user()],
            'translations' => $translations,
            'locale' => $locale
        ]);
    })->name('faqs');

    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Application Routes
    Route::get('/applications/create', [ApplicationController::class, 'create'])->name('applications.create');
    Route::post('/applications', [ApplicationController::class, 'store'])->name('applications.store');
    Route::get('/applications/{application}/edit', [ApplicationController::class, 'edit'])->name('applications.edit');
    Route::post('/applications/{application}/update', [ApplicationController::class, 'update'])->name('applications.update');
    Route::get('/applications/{application}/claim-stub', [ApplicationController::class, 'generateClaimStub'])->name('applications.claim-stub');

    // Notification Routes
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
    });
});


// --- ADMIN ROUTES ---

Route::middleware(['auth', 'verified', 'is_admin'])->prefix('admin')->name('admin.')->group(function () {

    // Dashboard
    Route::get('/dashboard', function (Request $request) {
        $now = \Carbon\Carbon::now();

        // Budget Logic
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

        // Stats Logic
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

        // Chart Logic
        $chartQuery = ApplicationModel::where('status', 'Approved');
        if ($request->has('start_date') && $request->start_date) { $chartQuery->whereDate('updated_at', '>=', $request->start_date); }
        else { $chartQuery->whereDate('updated_at', '>=', $now->copy()->subDays(30)); }
        if ($request->has('end_date') && $request->end_date) { $chartQuery->whereDate('updated_at', '<=', $request->end_date); }
        if ($request->has('barangay') && $request->barangay != '') { $chartQuery->where('barangay', $request->barangay); }

        $dailyData = $chartQuery->selectRaw('DATE(updated_at) as date, SUM(amount_released) as total')->groupBy('date')->orderBy('date')->get();
        $chartData = ['labels' => $dailyData->pluck('date'), 'values' => $dailyData->pluck('total')];

        // Barangay Stats
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

    // Audit Logs
    Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit-logs');

    // Budget Update
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

    // Applications Management
    Route::get('/applications', [AidRequestController::class, 'index'])->name('applications.index');

    Route::get('/applications/{application}', function (ApplicationModel $application) {
        $programSettings = \App\Models\AssistanceProgram::where('title', $application->program)->first();
        return Inertia::render('Admin/ApplicationShow', [
            'application' => $application->load('user'),
            'programSettings' => $programSettings,
            'auth' => [ 'user' => Auth::user() ]
        ]);
    })->name('applications.show');

    Route::delete('/applications/{application}', [AidRequestController::class, 'destroy'])->name('applications.destroy');
    Route::post('/applications/{application}/approve', [App\Http\Controllers\ApplicationController::class, 'approve'])->name('applications.approve');
    Route::get('/applications/{application}/reject', [App\Http\Controllers\ApplicationController::class, 'reject'])->name('applications.reject');
    Route::post('/applications/{application}/remarks', [App\Http\Controllers\ApplicationController::class, 'addRemark'])->name('applications.remarks.store');
    Route::post('/applications/{application}/note', [App\Http\Controllers\ApplicationController::class, 'saveNote'])->name('applications.note.store');

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export-pdf', [ReportController::class, 'exportPdf'])->name('reports.export-pdf');
    Route::get('/reports/export-excel', [ReportController::class, 'exportExcel'])->name('reports.export-excel');

    // News
    Route::resource('news', NewsController::class);

    // Programs
    Route::get('/programs', [AssistanceProgramController::class, 'index'])->name('programs.index');
    Route::post('/programs', [AssistanceProgramController::class, 'store'])->name('programs.store');
    Route::put('/programs/{program}', [AssistanceProgramController::class, 'update'])->name('programs.update');
    Route::delete('/programs/{program}', [AssistanceProgramController::class, 'destroy'])->name('programs.destroy');

    // Settings
    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');

    // Users
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
    Route::post('/applications/{application}/reject', [StaffController::class, 'reject'])->name('applications.reject');

    // Staff Reports
    Route::get('/reports', [StaffController::class, 'reportsIndex'])->name('reports.index');
    Route::get('/reports/export-pdf', [StaffController::class, 'exportPdf'])->name('reports.export-pdf');
    Route::get('/reports/export-excel', [StaffController::class, 'exportExcel'])->name('reports.export-excel');
});

require __DIR__.'/auth.php';
