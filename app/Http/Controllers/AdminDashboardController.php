<?php

namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    /**
     * Retrieve statistics for the admin dashboard.
     */
    public function index()
    {
        $stats = [
            'total' => Application::count(),
            'pending' => Application::where('status', 'Pending')->count(),
            'approved' => Application::where('status', 'Approved')->count(),
            'rejected' => Application::where('status', 'Rejected')->count(),
        ];

        return response()->json($stats);
    }
}
