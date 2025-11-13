<?php

namespace App\Http\Controllers;

use App\Models\Application as ApplicationModel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http; // <-- ADDED: This is Laravel's tool for sending data

// We no longer need Mailtrap, so these are removed:
// use Illuminate\Support\Facades\Mail;
// use App\Mail\ApplicationStatusUpdated;

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
            'attachments.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
        ]);

        $application = new ApplicationModel($validatedData);
        $application->user_id = Auth::id();

        if ($request->hasFile('attachments')) {
            $attachmentPaths = [];
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('attachments', 'public');
                $attachmentPaths[] = $path;
            }
            $application->attachments = $attachmentPaths;
        }

        $application->save();

        return redirect()->route('dashboard')->with('message', 'Application submitted successfully!');
    }

    public function approve(ApplicationModel $application)
    {
        $application->update(['status' => 'Approved', 'remarks' => null]);
        $application->load('user'); // Make sure user data is loaded

        // --- REPLACED MAILTRAP WITH MAKE.COM WEBHOOK ---
        $webhookUrl = env('MAKE_WEBHOOK_URL'); // Get URL directly from .env
        if ($application->user && $application->user->email && $webhookUrl) {
            Http::post($webhookUrl, [
                'email' => $application->user->email,
                'name' => $application->user->name,
                'status' => 'Approved',
                'program' => $application->program,
                'remarks' => $application->remarks, // This will be null, which is correct
            ]);
        }
        // --- END OF CHANGE ---

        return redirect()->back()->with('message', 'Application has been approved.');
    }

    public function reject(ApplicationModel $application)
    {
        $application->update(['status' => 'Rejected']);
        $application->load('user'); // Make sure user data is loaded

        // --- REPLACED MAILTRAP WITH MAKE.COM WEBHOOK ---
        $webhookUrl = env('MAKE_WEBHOOK_URL'); // Get URL directly from .env
        if ($application->user && $application->user->email && $webhookUrl) {
            Http::post($webhookUrl, [
                'email' => $application->user->email,
                'name' => $application->user->name,
                'status' => 'Rejected',
                'program' => $application->program,
                'remarks' => $application->remarks, // This will include the rejection remark
            ]);
        }
        // --- END OF CHANGE ---

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
