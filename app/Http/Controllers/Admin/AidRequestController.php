<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // <-- 1. IMPORT AUTH
use Inertia\Inertia;

class AidRequestController extends Controller
{
    public function index()
    {
        $applications = Application::with('user')->latest()->get();

        // 2. PASS THE AUTH USER TO THE PAGE
        return Inertia::render('Admin/AidRequests/Index', [
            'auth' => Auth::user(),
            'aidRequests' => $applications,
        ]);
    }
}
