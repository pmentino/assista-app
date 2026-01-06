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

        // 1. Search Filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('id', $search);
            });
        }

        // 2. Status Filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // 3. Program Filter
        if ($request->filled('program')) {
            $query->where('program', $request->program);
        }

        // 4. Barangay Filter (Drill-Down)
        if ($request->filled('barangay')) {
            $query->where('barangay', $request->barangay);
        }

        // Sorting
        $sortDirection = $request->input('sort_direction', 'desc');
        $sortBy = $request->input('sort_by', 'created_at');

        $applications = $query->orderBy($sortBy, $sortDirection)
                              ->paginate(10)
                              ->withQueryString();

        return Inertia::render('Admin/ApplicationsIndex', [
            'applications' => $applications,
            'filters' => $request->only(['search', 'status', 'program', 'barangay']),
            'auth' => ['user' => Auth::user()],
        ]);
    }

    public function destroy(Application $application)
    {
        // --- CRITICAL FIX: PREVENT DELETION OF APPROVED RECORDS ---
        // In a government system, you cannot delete records that have financial implications.
        if ($application->status === 'Approved') {
            return redirect()->back()
                ->with('error', 'CRITICAL ERROR: Cannot delete an Approved application. This record is linked to disbursed funds.')
                ->setStatusCode(303);
        }

        // Optional: Capture name for logs before deleting
        $applicantName = $application->first_name . ' ' . $application->last_name;

        $application->delete();

        \App\Models\AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'Deleted Application',
            'details' => "Permanently deleted App #{$application->id} for {$applicantName}",
        ]);

        return redirect()->back()
            ->with('message', 'Application deleted successfully.')
            ->setStatusCode(303);
    }
}
