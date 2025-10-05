<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\Admin\AidRequestController; // <-- 1. IMPORT THE NEW CONTROLLER
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

// Applicant's Dashboard Route
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'auth' => Auth::user()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');


// ALL SECURE ROUTES GO IN THIS GROUP
Route::middleware('auth')->group(function () {
    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Applicant's Application Form Routes
    Route::get('/applications/create', [ApplicationController::class, 'create'])->name('applications.create');
    Route::post('/applications', [ApplicationController::class, 'store'])->name('applications.store');

    // --- ADMIN ROUTES ---
    // 2. ADD THE NEW ADMIN ROUTE HERE
    Route::get('/admin/aid-requests', [AidRequestController::class, 'index'])->name('admin.aid-requests.index');
});

require __DIR__.'/auth.php';
