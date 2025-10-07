<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // <-- 1. IMPORT AUTH
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ApplicationsExport;

class ReportController extends Controller
{
    public function index()
    {
        $stats = [
            'pending' => Application::where('status', 'Pending')->count(),
            'approved' => Application::where('status', 'Approved')->count(),
            'rejected' => Application::where('status', 'Rejected')->count(),
            'total' => Application::count(),
        ];

        // 2. PASS THE AUTH USER TO THE PAGE
        return Inertia::render('Admin/Reports/Index', [
            'auth' => Auth::user(),
            'stats' => $stats
        ]);
    }

    public function export()
    {
        return Excel::download(new ApplicationsExport, 'applications.csv');
    }
}
