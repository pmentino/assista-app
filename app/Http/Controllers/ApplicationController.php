<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ApplicationController extends Controller
{
    public function create()
    {
        return Inertia::render('Application/Create', ['auth' => Auth::user()]);
    }

    public function store(Request $request): RedirectResponse
    {
        // THIS IS THE SECTION TO UPDATE
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            // --- Other validation rules ---
            'program' => 'required|string|max:255',
            'sex' => 'required|string|max:255',
            'civil_status' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'barangay' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'contact_number' => 'required|string|max:20',
            'attachments.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'date_of_incident' => 'nullable|date',
            'middle_name' => 'nullable|string|max:255',
            'suffix_name' => 'nullable|string|max:255',
            'house_no' => 'nullable|string|max:255',
        ], [
            // --- ADD THIS ARRAY FOR CUSTOM MESSAGES ---
            'first_name.required' => 'Please enter the applicant\'s first name.',
            'last_name.required' => 'Please provide the applicant\'s last name.',
            'email.required' => 'An email address is required to submit an application.',
        ]);

        $fullAddress = trim(($validated['house_no'] ?? '') . ' ' . $validated['barangay'] . ', ' . $validated['city']);

        $dataToSave = array_merge($validated, [
            'address' => $fullAddress,
            'assistance_type' => $validated['program']
        ]);

        $user = Auth::user();
        /** @var \App\Models\User $user */
        $application = $user->applications()->create($dataToSave);

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                if ($file) {
                    $path = $file->store('attachments', 'public');
                }
            }
        }
        return to_route('dashboard')->with('message', 'Application submitted successfully!');
    }

    public function updateStatus(Request $request, Application $application): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:Approved,Rejected',
        ]);

        $application->update(['status' => $validated['status']]);

        return redirect()->back()->with('message', 'Status updated successfully!');
    }
}
