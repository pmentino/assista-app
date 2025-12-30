<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Mail;
use App\Mail\ApplicationStatusUpdated;
use App\Models\Setting;
use App\Models\Application;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

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
    // DEBUG: Stop here and show me what data is coming from the form
    // dd($request->all());

    $user = Auth::user();

    // 1. Check for Pending Apps
    $hasPending = Application::where('user_id', $user->id)->where('status', 'Pending')->exists();
    if ($hasPending) {
        return redirect()->back()->withErrors(['program' => 'You already have a pending application.']);
    }

    // 2. Validate Data
    try {
        $validated = $request->validate([
            'program' => 'required|string',
            'date_of_incident' => 'required|date',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'contact_number' => 'required|string|max:20',
            'email' => 'required|email',
            'sex' => 'required|string',
            'civil_status' => 'required|string',
            'birth_date' => 'required|date',
            'barangay' => 'required|string',
            'house_no' => 'required|string',

            // Files
            'valid_id' => 'required|file|max:10240', // Increased limit to 10MB just in case
            'indigency_cert' => 'required|file|max:10240',
        ]);
    } catch (\Illuminate\Validation\ValidationException $e) {
        // DEBUG: If validation fails, dump the errors so we can see them
        dd($e->errors());
    }

    // 3. File Uploads
    $paths = [];
    if ($request->hasFile('valid_id')) {
        $paths['valid_id'] = $request->file('valid_id')->store('documents', 'public');
    }
    if ($request->hasFile('indigency_cert')) {
        $paths['indigency_cert'] = $request->file('indigency_cert')->store('documents', 'public');
    }

    // Dynamic Attachments
    if ($request->hasFile('attachments')) {
        foreach ($request->file('attachments') as $index => $file) {
            if($file) {
                $paths[$index] = $file->store('documents', 'public');
            }
        }
    }

    // 4. Create Record
    try {
        Application::create([
            'user_id' => Auth::id(),
            'program' => $request->program,
            'date_of_incident' => $request->date_of_incident,
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'last_name' => $request->last_name,
            'suffix_name' => $request->suffix_name,
            'sex' => $request->sex,
            'civil_status' => $request->civil_status,
            'birth_date' => $request->birth_date,
            'house_no' => $request->house_no,
            'barangay' => $request->barangay,
            'city' => $request->city ?? 'Roxas City', // Default if null
            'contact_number' => $request->contact_number,
            'email' => $request->email,
            'facebook_link' => $request->facebook_link,
            'valid_id' => $paths['valid_id'] ?? null,
            'indigency_cert' => $paths['indigency_cert'] ?? null,
            'attachments' => $paths,
            'status' => 'Pending',
        ]);
    } catch (\Exception $e) {
        // DEBUG: If Database fails (e.g. missing column), show the exact SQL error
        dd($e->getMessage());
    }

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

    // --- ADMIN ACTIONS (With Logging & Email) ---

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

        // Send Email
        if ($application->user && $application->user->email) {
            Mail::to($application->user->email)->send(new ApplicationStatusUpdated($application));
        }

        // Audit Log
        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'Approved Application',
            'details' => "Approved App #{$application->id} for {$application->first_name}. Amount: ₱" . number_format($request->amount, 2)
        ]);

        return redirect()->back()->with('message', 'Application approved and notification sent.');
    }

    public function reject(Request $request, Application $application)
    {
        $application->update(['status' => 'Rejected']);

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'Rejected Application',
            'details' => "Rejected App #{$application->id}"
        ]);

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

        // Send Email
        if ($application->user && $application->user->email) {
            Mail::to($application->user->email)->send(new ApplicationStatusUpdated($application));
        }

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'Rejected Application',
            'details' => "Rejected App #{$application->id} - Reason: {$request->remarks}"
        ]);

        return redirect()->back()->with('message', 'Application rejected and notification sent.');
    }

    // --- CLAIM STUB GENERATION ---
    public function generateClaimStub(Application $application)
    {
        if ($application->status !== 'Approved') {
            abort(403, 'This application is not approved yet.');
        }

        // 1. Fetch Dynamic Signatories from Settings
        $signatories = [
            'assessed_by' => Setting::where('key', 'signatory_social_worker')->value('value') ?? 'BIVIEN B. DELA CRUZ, RSW',
            'approved_by' => Setting::where('key', 'signatory_cswdo_head')->value('value') ?? 'PERSEUS L. CORDOVA',
        ];

        // 2. Pass them to the View
        $pdf = Pdf::loadView('pdf.claim_stub', [
            'application' => $application,
            'signatories' => $signatories
        ]);

        $pdf->setPaper([0, 0, 612, 936], 'portrait');

        return $pdf->stream('Certificate_Eligibility_' . $application->id . '.pdf');
    }
}
