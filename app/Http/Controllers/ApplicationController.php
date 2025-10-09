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
        return Inertia::render('ApplicationForm');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'address' => 'required|string|max:255',
            'contact_number' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'program' => 'required|string|max:255',
            'date_of_incident' => 'nullable|date',
        ]);

        $application = new ApplicationModel($validatedData);
        $application->user_id = Auth::id();
        $application->save();

        return redirect()->route('dashboard')->with('message', 'Application submitted successfully!');
    }

    public function updateStatus(Request $request, ApplicationModel $application)
    {
        $validated = $request->validate([
            'status' => 'required|in:Approved,Rejected',
        ]);

        $application->update(['status' => $validated['status']]);

        return redirect()->back()->with('message', 'Application status updated.');
    }

    // These are the two new functions that our GET routes will use
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
