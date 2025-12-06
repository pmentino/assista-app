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
});

Route::middleware(['auth', 'verified', 'is_admin'])->prefix('admin')->name('admin.')->group(function () {

    // --- UPDATED ADMIN DASHBOARD LOGIC ---
    Route::get('/dashboard', function (Illuminate\Http\Request $request) {
        $now = \Carbon\Carbon::now();

        $stats = [
            'total' => ApplicationModel::count(),
            'pending' => ApplicationModel::where('status', 'Pending')->count(),
            'approved' => ApplicationModel::where('status', 'Approved')->count(),
            'rejected' => ApplicationModel::where('status', 'Rejected')->count(),
            'total_released' => ApplicationModel::where('status', 'Approved')->sum('amount_released'),

            // Fixed: Uses $now->copy() so the original $now variable doesn't get messed up
            'released_today' => ApplicationModel::where('status', 'Approved')
                ->whereDate('updated_at', $now->today())
                ->sum('amount_released'),

            'released_week' => ApplicationModel::where('status', 'Approved')
                ->whereBetween('updated_at', [
                    $now->copy()->startOfWeek(),
                    $now->copy()->endOfWeek()
                ])
                ->sum('amount_released'),

            'released_month' => ApplicationModel::where('status', 'Approved')
                ->whereMonth('updated_at', $now->month)
                ->whereYear('updated_at', $now->year)
                ->sum('amount_released'),
        ];

        // 2. Chart Data Logic
        $chartQuery = ApplicationModel::where('status', 'Approved');

        if ($request->has('start_date') && $request->start_date) {
            $chartQuery->whereDate('updated_at', '>=', $request->start_date);
        } else {
            $chartQuery->whereDate('updated_at', '>=', $now->copy()->subDays(30));
        }

        if ($request->has('end_date') && $request->end_date) {
            $chartQuery->whereDate('updated_at', '<=', $request->end_date);
        }

        if ($request->has('barangay') && $request->barangay != '') {
            $chartQuery->where('barangay', $request->barangay);
        }

        $dailyData = $chartQuery->selectRaw('DATE(updated_at) as date, SUM(amount_released) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $chartData = [
            'labels' => $dailyData->pluck('date'),
            'values' => $dailyData->pluck('total'),
        ];

        // 3. Barangay Stats
        // 3. Barangay Stats (Fixed Query)
        $barangayStats = ApplicationModel::where('status', 'Approved')
            ->whereNotNull('barangay') // Exclude rows without a barangay
            ->select('barangay', \Illuminate\Support\Facades\DB::raw('count(*) as total'), \Illuminate\Support\Facades\DB::raw('COALESCE(sum(amount_released), 0) as amount'))
            ->groupBy('barangay')
            ->orderByDesc('amount')
            ->limit(5)
            ->get();

        $allBarangays = ApplicationModel::select('barangay')->distinct()->orderBy('barangay')->pluck('barangay');

        $currentFilters = $request->only(['barangay', 'start_date', 'end_date']);

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'chartData' => $chartData,
            'barangayStats' => $barangayStats,
            'allBarangays' => $allBarangays,
            'filters' => $currentFilters,
            'auth' => [ 'user' => Auth::user() ]
        ]);
    })->name('dashboard');

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
