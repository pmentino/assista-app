<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AidRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = Application::query();

        // Search Logic
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('id', 'like', "%{$request->search}%")
                  ->orWhere('first_name', 'like', "%{$request->search}%")
                  ->orWhere('last_name', 'like', "%{$request->search}%");
            });
        }

        // Status Filter
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Program Filter
        if ($request->program) {
            $query->where('program', $request->program);
        }

        // --- SORTING FIX ---
        // 1. Set a default field if 'sort_by' is empty
        $sortField = $request->input('sort_by') ?: 'created_at';

        // 2. Set a default direction if 'sort_direction' is empty or invalid
        $sortDirection = $request->input('sort_direction');
        if (!in_array(strtolower($sortDirection), ['asc', 'desc'])) {
            $sortDirection = 'desc'; // Default fallback
        }

        // Apply sorting
        $applications = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/AidRequests/Index', [
            'applications' => $applications,
            'filters' => $request->only(['search', 'status', 'program']),
            'sort_by' => $sortField,
            'sort_direction' => $sortDirection,
            'auth' => ['user' => Auth::user()]
        ]);
    }
}
