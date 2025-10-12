<?php

namespace App\Http\Controllers;

use App\Models\Application as ApplicationModel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ApplicationController extends Controller
{
    public function create()
    {
        return Inertia::render('Application/Create');
    }

    public function store(Request $request)
    {
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
            'attachments.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048', // Validation for files
        ]);

        $application = new ApplicationModel($validatedData);
        $application->user_id = Auth::id();

        // --- START OF NEW FILE HANDLING LOGIC ---
        if ($request->hasFile('attachments')) {
            $attachmentPaths = [];
            foreach ($request->file('attachments') as $file) {
                // Store the file in 'public/attachments' and get the path
                $path = $file->store('attachments', 'public');
                $attachmentPaths[] = $path;
            }
            // Save the array of paths to the database
            $application->attachments = $attachmentPaths;
        }
        // --- END OF NEW FILE HANDLING LOGIC ---

        $application->save();

        return redirect()->route('dashboard')->with('message', 'Application submitted successfully!');
    }

    public function approve(ApplicationModel $application)
    {
        $application->update(['status' => 'Approved']);
        return redirect()->back()->with('message', 'Application has been approved.');
    }

    public function reject(ApplicationModel $application)
    {
        $application->update(['status' => 'Rejected']);
        return redirect()->back()->with('message', 'Application has been rejected.');
    }
}
