<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\AuditLog; // Import AuditLog model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ApplicationController extends Controller
{
    // Show form
    public function create()
    {
        return Inertia::render('Applications/Create', [
            'auth' => ['user' => Auth::user()]
        ]);
    }

    // Submit new application
    public function store(Request $request)
    {
        // Validation (simplified for brevity, keep your original validation if strict)
        $validated = $request->validate([
            'program' => 'required',
            'first_name' => 'required',
            'last_name' => 'required',
            'contact_number' => 'required',
            // ... add other fields as needed
        ]);

        // Handle File Uploads
        $paths = [];
        if ($request->hasFile('valid_id')) {
            $paths['valid_id'] = $request->file('valid_id')->store('documents', 'public');
        }
        if ($request->hasFile('indigency_cert')) {
            $paths['indigency_cert'] = $request->file('indigency_cert')->store('documents', 'public');
        }
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $index => $file) {
                $paths[$index] = $file->store('documents', 'public');
            }
        }

        // Create Application
        $app = new Application();
        $app->user_id = Auth::id();
        $app->fill($request->except(['valid_id', 'indigency_cert', 'attachments']));
        $app->attachments = $paths; // Assuming cast to array in model
        $app->status = 'Pending';
        $app->save();

        return redirect()->route('dashboard')->with('message', 'Application submitted successfully.');
    }

    // Show details
    public function edit(Application $application)
    {
        return Inertia::render('Applications/Edit', [
            'application' => $application,
            'auth' => ['user' => Auth::user()]
        ]);
    }

    // Update application
    public function update(Request $request, Application $application)
    {
        $application->update($request->all());
        return redirect()->route('dashboard');
    }

    // --- ADMIN ACTIONS (This is where we add LOGGING) ---

    public function approve(Request $request, Application $application)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0',
        ]);

        $application->update([
            'status' => 'Approved',
            'amount_released' => $request->amount,
            'remarks' => null,
            'approved_date' => now(),
        ]);

        // *** LOGGING THE APPROVAL ***
        $this->logActivity('Approved Application', "Approved App #{$application->id} for {$application->first_name} {$application->last_name}. Amount: ₱" . number_format($request->amount, 2));

        return redirect()->back()->with('message', 'Application approved successfully.');
    }

    public function reject(Request $request, Application $application)
    {
        // This might be a GET request in your routes, strictly it should be POST/PUT
        // But adapting to your current setup:
        $application->update(['status' => 'Rejected']);

        $this->logActivity('Rejected Application', "Rejected App #{$application->id}");

        return redirect()->back();
    }

    public function addRemark(Request $request, Application $application)
    {
        $request->validate([
            'remarks' => 'required|string|max:1000',
        ]);

        $application->update([
            'status' => 'Rejected',
            'remarks' => $request->remarks,
        ]);

        // *** LOGGING THE REJECTION ***
        $this->logActivity('Rejected Application', "Rejected App #{$application->id} - Reason: {$request->remarks}");

        return redirect()->back()->with('message', 'Application rejected.');
    }

    public function generateClaimStub(Application $application)
    {
        if ($application->status !== 'Approved') {
            abort(403);
        }

        // Simulating PDF generation or returning a view
        // Ideally use DomPDF here
        return response()->json(['message' => 'Claim stub generation to be implemented']);
    }
}
