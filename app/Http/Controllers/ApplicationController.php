<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Application;
use Inertia\Inertia;

class ApplicationController extends Controller
{
    public function create()
    {
        return Inertia::render('Application/Create', [
            'auth' => Auth::user()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
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
            'attachments.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
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
                // THIS IS THE FIX: Check if the file is valid before storing it
                if ($file) {
                    $path = $file->store('attachments', 'public');
                }
            }
        }

        return to_route('dashboard')->with('message', 'Application submitted successfully!');
    }

    // ... your other methods ...
}
