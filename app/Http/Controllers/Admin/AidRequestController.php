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
        // Get filter, search, and sort parameters
        // We added 'search' to the list of filters we accept
        $filters = $request->only('status', 'program', 'search');

        $sortBy = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');

        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'desc';
        }

        $applicationsQuery = Application::with('user')
            // --- NEW: Search Logic ---
            ->when($request->input('search'), function ($query, $search) {
                $query->where(function($q) use ($search) {
                    // Search by ID, First Name, or Last Name
                    $q->where('id', 'like', "%{$search}%")
                      ->orWhere('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%")
                      // Optional: Search by user email if you want
                      ->orWhereHas('user', function($q2) use ($search) {
                          $q2->where('email', 'like', "%{$search}%");
                      });
                });
            })
            // --- End Search Logic ---

            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->input('program'), function ($query, $program) {
                $query->where('program', $program);
            })
            ->orderBy($sortBy, $sortDirection);

        $applications = $applicationsQuery->paginate(15)->withQueryString();

        return Inertia::render('Admin/ApplicationsIndex', [
            'applications' => $applications,
            'filters' => $filters, // 'search' will be passed back here automatically
            'sort_by' => $sortBy,
            'sort_direction' => $sortDirection,
        ]);
    }
}
