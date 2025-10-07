<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\Admin\AidRequestController;
use App\Http\Controllers\Admin\ReportController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Application as ApplicationModel;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// THIS IS THE CORRECTED APPLICANT DASHBOARD ROUTE
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
    Route::patch('/applications/{application}/status', [ApplicationController::class, 'updateStatus'])->name('applications.status.update');
});

Route::middleware(['auth', 'verified', 'is_admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard', ['auth' => Auth::user()]);
    })->name('admin.dashboard');
    Route::get('/aid-requests', [AidRequestController::class, 'index'])->name('admin.aid-requests.index');
    Route::get('/applications/{application}', function (ApplicationModel $application) {
        return Inertia::render('Admin/ApplicationShow', ['auth' => Auth::user(),'application' => $application->load('user')]);
    })->name('admin.applications.show');
    Route::get('/reports', [ReportController::class, 'index'])->name('admin.reports.index');
    Route::get('/reports/export', [ReportController::class, 'export'])->name('admin.reports.export');
});

require __DIR__.'/auth.php';
