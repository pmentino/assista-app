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
    return Inertia::render('Welcome', ['canLogin' => Route::has('login'), 'canRegister' => Route::has('register')]);
});

Route::get('/dashboard', function () {
    $applications = Auth::user() ? Auth::user()->applications()->latest()->get() : [];
    return Inertia::render('Dashboard', ['auth' => Auth::user(), 'applications' => $applications]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/applications/create', [ApplicationController::class, 'create'])->name('applications.create');
    Route::post('/applications', [ApplicationController::class, 'store'])->name('applications.store');
});

Route::middleware(['auth', 'verified', 'is_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard', ['auth' => Auth::user()]);
    })->name('dashboard');

    Route::get('/applications', [AidRequestController::class, 'index'])->name('applications.index');

    Route::get('/applications/{application}', function (ApplicationModel $application) {
        return Inertia::render('Admin/ApplicationShow', ['auth' => Auth::user(), 'application' => $application->load('user')]);
    })->name('applications.show');

    // THIS IS THE ROUTE THAT MUST EXIST
    Route::patch('/applications/{application}/status', [ApplicationController::class, 'updateStatus'])->name('applications.status.update');

    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export', [ReportController::class, 'export'])->name('reports.export');
});

require __DIR__.'/auth.php';
