<?php

namespace App\Http\Controllers;

use App\Models\Application as ApplicationModel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class ApplicationController extends Controller
{
    public function create()
    {
        return Inertia::render('Application/Create');
    }

    public function store(Request $request)
    {
        // 1. Validation
        $validatedData = $request->validate([
            'program' => 'required|string|max:255',
            'date_of_incident' => 'nullable|date',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'suffix_name' => 'nullable|string|max:255',
            'sex' => 'required|string|max:255',
            'civil_status' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'house_no' => 'nullable|string|max:255',
            'barangay' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'contact_number' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'facebook_link' => 'nullable|string|max:255',
            'valid_id' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'indigency_cert' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'attachments' => 'nullable|array', // Allow array of files
            'attachments.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
        ]);

        // 2. Prepare Data
        // Remove file inputs from the main data array so we can handle them manually
        $dataToSave = collect($validatedData)->except(['valid_id', 'indigency_cert', 'attachments'])->toArray();

        $application = new ApplicationModel($dataToSave);
        $application->user_id = Auth::id();
        $application->status = 'Pending'; // Ensure status is set

        // 3. Handle File Uploads
        $filePaths = [];

        // Save Valid ID
        if ($request->hasFile('valid_id')) {
            $filePaths['valid_id'] = $request->file('valid_id')->store('attachments', 'public');
        }

        // Save Indigency
        if ($request->hasFile('indigency_cert')) {
            $filePaths['indigency_cert'] = $request->file('indigency_cert')->store('attachments', 'public');
        }

        // Save Dynamic Attachments (Array)
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $index => $file) {
                if ($file) {
                    // Use index to keep order consistent with requirements list
                    $filePaths[$index] = $file->store('attachments', 'public');
                }
            }
        }

        $application->attachments = $filePaths;
        $application->save();

        // 4. Force Redirect to Dashboard
        return redirect()->route('dashboard')->with('message', 'Application submitted successfully!');
    }

    // --- Edit Page ---
    public function edit(ApplicationModel $application)
    {
        if ($application->user_id !== Auth::id()) {
            abort(403);
        }
        // Allow editing if Rejected OR Pending (for testing)
        if (!in_array($application->status, ['Rejected', 'Pending'])) {
             return redirect()->route('dashboard')->with('error', 'You cannot edit this application.');
        }

        return Inertia::render('Application/Edit', [
            'application' => $application
        ]);
    }

    // --- Update Logic ---
    public function update(Request $request, ApplicationModel $application)
    {
        if ($application->user_id !== Auth::id()) {
            abort(403);
        }

        $validatedData = $request->validate([
            'program' => 'required|string|max:255',
            'date_of_incident' => 'nullable|date',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'suffix_name' => 'nullable|string|max:255',
            'sex' => 'required|string|max:255',
            'civil_status' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'house_no' => 'nullable|string|max:255',
            'barangay' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'contact_number' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'facebook_link' => 'nullable|string|max:255',
            'valid_id' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'indigency_cert' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'attachments' => 'nullable|array',
            'attachments.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
        ]);

        $dataToUpdate = collect($validatedData)->except(['valid_id', 'indigency_cert', 'attachments'])->toArray();
        $application->fill($dataToUpdate);

        // Handle Files
        $currentAttachments = $application->attachments ?? [];

        if ($request->hasFile('valid_id')) {
            $currentAttachments['valid_id'] = $request->file('valid_id')->store('attachments', 'public');
        }
        if ($request->hasFile('indigency_cert')) {
            $currentAttachments['indigency_cert'] = $request->file('indigency_cert')->store('attachments', 'public');
        }
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $index => $file) {
                if ($file) {
                    $currentAttachments[$index] = $file->store('attachments', 'public');
                }
            }
        }

        $application->attachments = $currentAttachments;
        $application->status = 'Pending';
        $application->remarks = null;
        $application->save();

        return redirect()->route('dashboard')->with('message', 'Application resubmitted successfully!');
    }

    public function approve(Request $request, ApplicationModel $application)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0',
        ]);

        $application->update([
            'status' => 'Approved',
            'amount_released' => $request->amount,
            'remarks' => null
        ]);

        return redirect()->back()->with('message', 'Application approved.');
    }

    public function reject(ApplicationModel $application)
    {
        $application->update(['status' => 'Rejected']);
        return redirect()->back()->with('message', 'Application rejected.');
    }

    public function addRemark(Request $request, ApplicationModel $application)
    {
        $request->validate(['remarks' => 'nullable|string']);

        $application->update([
            'remarks' => $request->remarks,
            'status' => 'Rejected' // Force status to Rejected when adding a remark
        ]);

        return redirect()->back()->with('message', 'Remark saved.');
    }
}
