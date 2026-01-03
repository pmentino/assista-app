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
        // 1. Get Stats
        $stats = [
            'total'   => Application::count(),
            'pending' => Application::where('status', 'Pending')->count(),
            'today'   => Application::whereDate('created_at', \Carbon\Carbon::today())->count(),
        ];

        // 2. Get Recent Applications (Limit 5)
        $recentApplications = Application::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($app) {
                return [
                    'id' => $app->id,
                    'name' => $app->first_name . ' ' . $app->last_name,
                    'program' => $app->program,
                    'status' => $app->status,
                    'date' => $app->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('Staff/Dashboard', [
            'stats' => $stats,
            'recentApplications' => $recentApplications,
            'auth' => ['user' => Auth::user()] // <--- FIXED: Added this back!
        ]);
    }

    public function applicationsIndex(Request $request)
    {
        $query = Application::with('user');

        // Search Filter
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhere('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filters
        if ($request->has('status') && $request->status) $query->where('status', $request->status);
        if ($request->has('program') && $request->program) $query->where('program', $request->program);
        if ($request->has('barangay') && $request->barangay) $query->where('barangay', $request->barangay);

        // Sorting
        if ($request->has('sort_by') && $request->sort_by) {
            $direction = $request->sort_direction === 'desc' ? 'desc' : 'asc';
            $query->orderBy($request->sort_by, $direction);
        } else {
            $query->latest();
        }

        $applications = $query->paginate(10)->withQueryString();

        return Inertia::render('Staff/ApplicationsIndex', [
            'applications' => $applications,
            'filters' => $request->only(['search', 'status', 'program', 'barangay']),
            'sort_by' => $request->sort_by,
            'sort_direction' => $request->sort_direction,
            'auth' => ['user' => Auth::user()] // Ensures Nav works here too
        ]);
    }

    public function applicationsShow(Application $application)
    {
        return Inertia::render('Staff/ApplicationShow', [
            'application' => $application->load('user'),
            'auth' => ['user' => Auth::user()] // Ensures Nav works here too
        ]);
    }

    public function storeRemark(Request $request, Application $application)
    {
        $request->validate([
            'remarks' => 'required|string|max:1000',
        ]);

        $application->update([
            'remarks' => $request->remarks
        ]);

        return redirect()->back()->with('message', 'Remark saved successfully.');
    }
}
