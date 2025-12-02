<?php

namespace App\Http\Controllers;

use App\Models\Application as ApplicationModel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage; // Added for deleting old files if needed

class ApplicationController extends Controller
{
    public function create()
    {
        return Inertia::render('Application/Create');
    }

    public function store(Request $request)
    {
        // 1. Duplicate Check
        $existingApplication = ApplicationModel::where('user_id', Auth::id())
            ->where('program', $request->program)
            ->whereIn('status', ['Pending', 'Approved'])
            ->first();

        if ($existingApplication) {
            return redirect()->back()->withErrors(['program' => 'You already have a pending or approved application for this program.']);
        }

        // 2. Validation
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
            'attachments.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
        ]);

        // 3. Create Application Instance
        $dataToSave = collect($validatedData)->except(['valid_id', 'indigency_cert', 'attachments'])->toArray();
        $application = new ApplicationModel($dataToSave);
        $application->user_id = Auth::id();

        // 4. Handle File Uploads
        $attachmentPaths = [];

        if ($request->hasFile('valid_id')) {
            $attachmentPaths['valid_id'] = $request->file('valid_id')->store('attachments', 'public');
        }

        if ($request->hasFile('indigency_cert')) {
            $attachmentPaths['indigency_cert'] = $request->file('indigency_cert')->store('attachments', 'public');
        }

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $attachmentPaths[] = $file->store('attachments', 'public');
            }
        }

        $application->attachments = $attachmentPaths;
        $application->save();

        return redirect()->route('dashboard')->with('message', 'Application submitted successfully!');
    }

    // --- NEW: Edit Page for Resubmission ---
    public function edit(ApplicationModel $application)
    {
        // Security: Only allow owner to edit, and ONLY if Rejected
        if ($application->user_id !== Auth::id()) {
            abort(403);
        }
        if ($application->status !== 'Rejected') {
             return redirect()->route('dashboard')->with('error', 'You can only edit rejected applications.');
        }

        return Inertia::render('Application/Edit', [
            'application' => $application
        ]);
    }

    // --- NEW: Update Logic for Resubmission ---
    public function update(Request $request, ApplicationModel $application)
    {
        if ($application->user_id !== Auth::id()) {
            abort(403);
        }

        // Validation: Files are NULLABLE here because they might keep the old ones
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
            // Files are optional on update
            'valid_id' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'indigency_cert' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'attachments.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
        ]);

        // Update text fields
        $dataToUpdate = collect($validatedData)->except(['valid_id', 'indigency_cert', 'attachments'])->toArray();
        $application->fill($dataToUpdate);

        // Handle File Updates
        // We start with the existing attachments
        $currentAttachments = $application->attachments ?? [];

        // If a new file is uploaded, replace the old one
        if ($request->hasFile('valid_id')) {
            $currentAttachments['valid_id'] = $request->file('valid_id')->store('attachments', 'public');
        }

        if ($request->hasFile('indigency_cert')) {
            $currentAttachments['indigency_cert'] = $request->file('indigency_cert')->store('attachments', 'public');
        }

        // Append new extra attachments if any
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $currentAttachments[] = $file->store('attachments', 'public');
            }
        }

        $application->attachments = $currentAttachments;
        $application->status = 'Pending'; // RESET STATUS TO PENDING
        $application->remarks = null; // Clear the rejection remark
        $application->save();

        return redirect()->route('dashboard')->with('message', 'Application resubmitted successfully!');
    }

    public function approve(ApplicationModel $application)
    {
        $application->update(['status' => 'Approved', 'remarks' => null]);
        $application->load('user');

        $webhookUrl = env('MAKE_WEBHOOK_URL');
        if ($application->user && $application->user->email && $webhookUrl) {
            Http::post($webhookUrl, [
                'email' => $application->user->email,
                'name' => $application->user->name,
                'status' => 'Approved',
                'program' => $application->program,
                'remarks' => $application->remarks,
            ]);
        }

        return redirect()->back()->with('message', 'Application has been approved.');
    }

    public function reject(ApplicationModel $application)
    {
        $application->update(['status' => 'Rejected']);
        $application->load('user');

        $webhookUrl = env('MAKE_WEBHOOK_URL');
        if ($application->user && $application->user->email && $webhookUrl) {
            Http::post($webhookUrl, [
                'email' => $application->user->email,
                'name' => $application->user->name,
                'status' => 'Rejected',
                'program' => $application->program,
                'remarks' => $application->remarks,
            ]);
        }

        return redirect()->back()->with('message', 'Application has been rejected.');
    }

    public function addRemark(Request $request, ApplicationModel $application)
    {
        $request->validate([
            'remarks' => 'nullable|string',
        ]);

        $application->update([
            'remarks' => $request->remarks,
        ]);

        return redirect()->back()->with('message', 'Remark saved successfully.');
    }
}
