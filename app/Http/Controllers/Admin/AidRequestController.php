<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\AssistanceProgram; // Import this
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\AuditLog; // Import this

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

        // --- FETCH DROPDOWN DATA ---
        // Get unique barangays from existing applications for the filter list
        $allBarangays = Application::select('barangay')
                                   ->distinct()
                                   ->orderBy('barangay')
                                   ->pluck('barangay');

        // Get active programs
        $programs = AssistanceProgram::where('is_active', true)->pluck('title');

        return Inertia::render('Admin/ApplicationsIndex', [
            'applications' => $applications,
            'allBarangays' => $allBarangays, // Passing the list to React
            'programs'     => $programs,     // Passing the programs to React
            'filters'      => $request->only(['search', 'status', 'program', 'barangay', 'sort_by', 'sort_direction']),
            'auth'         => ['user' => Auth::user()],
        ]);
    }

    public function destroy(Application $application)
    {
        // PREVENT DELETION OF APPROVED RECORDS (Financial Integrity)
        if ($application->status === 'Approved') {
            return redirect()->back()
                ->with('error', 'CRITICAL ERROR: Cannot delete an Approved application. This record is linked to disbursed funds.')
                ->setStatusCode(303);
        }

        // Capture name for logs before deleting
        $applicantName = $application->first_name . ' ' . $application->last_name;

        $application->delete();

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'Deleted Application',
            'details' => "Permanently deleted App #{$application->id} for {$applicantName}",
        ]);

        return redirect()->back()
            ->with('message', 'Application deleted successfully.')
            ->setStatusCode(303);
    }
}
