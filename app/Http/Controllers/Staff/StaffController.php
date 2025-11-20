<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Application;
use Illuminate\Support\Facades\Auth;

class StaffController extends Controller
{
    public function dashboard()
    {
        // Staff dashboard logic - maybe just show pending applications assigned to them?
        // For now, let's just show counts like the admin dashboard but simpler.
        $stats = [
            'total' => Application::count(),
            'pending' => Application::where('status', 'Pending')->count(),
        ];

        return Inertia::render('Staff/Dashboard', [
            'stats' => $stats
        ]);
    }

    public function applicationsIndex()
    {
        // Staff view of all applications
        $applications = Application::with('user')->latest()->paginate(15);

        return Inertia::render('Staff/ApplicationsIndex', [
            'applications' => $applications
        ]);
    }

    public function applicationsShow(Application $application)
    {
        return Inertia::render('Staff/ApplicationShow', [
            'application' => $application->load('user')
        ]);
    }
}
