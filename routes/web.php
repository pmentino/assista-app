<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\Admin\AidRequestController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\NewsController; // <-- Added Import
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Application as ApplicationModel;
use App\Models\News;
use App\Http\Controllers\Staff\StaffController; // <-- Don't forget to import the model at the top of the file!

Route::get('/', function () {
    // Fetch the latest 3 news articles
    $news = News::latest()->take(3)->get();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'news' => $news, // Pass the news to the frontend
    ]);
});

Route::get('/dashboard', function () {
    $applications = Auth::user() ? Auth::user()->applications()->latest()->get() : [];
    return Inertia::render('Dashboard', [
        'auth' => Auth::user(),
        'applications' => $applications
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/applications/create', [ApplicationController::class, 'create'])->name('applications.create');
    Route::post('/applications', [ApplicationController::class, 'store'])->name('applications.store');
});

Route::middleware(['auth', 'verified', 'is_staff'])->prefix('staff')->name('staff.')->group(function () {

    Route::get('/dashboard', [StaffController::class, 'dashboard'])->name('dashboard');

    // Staff can view applications but maybe with limited actions
    Route::get('/applications', [StaffController::class, 'applicationsIndex'])->name('applications.index');
    Route::get('/applications/{application}', [StaffController::class, 'applicationsShow'])->name('applications.show');

    // Staff can add remarks but maybe NOT approve/reject (depending on your requirements)
    Route::post('/applications/{application}/remarks', [ApplicationController::class, 'addRemark'])->name('applications.remarks.store');
});

Route::middleware(['auth', 'verified', 'is_admin'])->prefix('admin')->name('admin.')->group(function () {

    Route::get('/dashboard', function () {
        $stats = [
            'total' => ApplicationModel::count(),
            'pending' => ApplicationModel::where('status', 'Pending')->count(),
            'approved' => ApplicationModel::where('status', 'Approved')->count(),
            'rejected' => ApplicationModel::where('status', 'Rejected')->count(),
        ];
        return Inertia::render('Admin/Dashboard', [
            'auth' => Auth::user(),
            'stats' => $stats
        ]);
    })->name('dashboard');

    Route::get('/applications', [AidRequestController::class, 'index'])->name('applications.index');

    Route::get('/applications/{application}', function (ApplicationModel $application) {
        return Inertia::render('Admin/ApplicationShow', [
            'auth' => Auth::user(),
            'application' => $application->load('user')
        ]);
    })->name('applications.show');

    Route::get('/applications/{application}/approve', [ApplicationController::class, 'approve'])->name('applications.approve');
    Route::get('/applications/{application}/reject', [ApplicationController::class, 'reject'])->name('applications.reject');

    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export', [ReportController::class, 'export'])->name('reports.export');

    Route::post('/applications/{application}/remarks', [ApplicationController::class, 'addRemark'])->name('applications.remarks.store');

    // --- NEW NEWS ROUTES ---
    Route::resource('news', NewsController::class);
});

require __DIR__.'/auth.php';
