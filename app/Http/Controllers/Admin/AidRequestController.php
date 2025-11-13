<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use Illuminate\Http\Request; // <-- Import Request
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AidRequestController extends Controller
{
    // The index method now accepts the Request object
    public function index(Request $request)
    {
        // Get filter and sort parameters from the URL, with defaults
        $filters = $request->only('status', 'program');
        $sortBy = $request->input('sort_by', 'created_at'); // Default sort by date
        $sortDirection = $request->input('sort_direction', 'desc'); // Default newest first

        // Validate sort direction to prevent errors
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'desc';
        }

        // Build the query
        $applicationsQuery = Application::with('user')
            // Apply status filter if provided
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            // Apply program filter if provided
            ->when($request->input('program'), function ($query, $program) {
                $query->where('program', $program);
            })
            // Apply sorting
            ->orderBy($sortBy, $sortDirection);

        // Execute the query with pagination (15 items per page)
        $applications = $applicationsQuery->paginate(15)->withQueryString();

        return Inertia::render('Admin/ApplicationsIndex', [ // <-- Ensure this matches your frontend file path
            // Note: We don't need to pass 'auth' here, middleware handles it.
            'applications' => $applications,
            'filters' => $filters, // Pass the current filters back to the view
            'sort_by' => $sortBy, // Pass current sort column
            'sort_direction' => $sortDirection, // Pass current sort direction
        ]);
    }
}
