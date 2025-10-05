<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\AdminDashboardController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Application Routes
Route::middleware(['auth:sanctum'])->post('/applications', [ApplicationController::class, 'store']);
Route::middleware(['auth:sanctum'])->get('/applications', [ApplicationController::class, 'index']);
Route::middleware(['auth:sanctum'])->get('/applications/{application}', [ApplicationController::class, 'show']);
Route::middleware(['auth:sanctum'])->patch('/applications/{application}/status', [ApplicationController::class, 'updateStatus']);

// Admin Dashboard Route
Route::middleware(['auth:sanctum'])->get('/admin/stats', [AdminDashboardController::class, 'index']);
