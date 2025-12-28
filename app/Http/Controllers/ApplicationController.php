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
use Carbon\Carbon; // <--- IMPORTANT: Needed for date calculations

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
        $user = Auth::user();

        // --- 1. DUPLICATE CHECK (Prevent spamming) ---
        // If they have ANY application that is currently 'Pending', block them.
        $hasPending = Application::where('user_id', $user->id)
            ->where('status', 'Pending')
            ->exists();

        if ($hasPending) {
            return redirect()->back()->withErrors([
                'program' => 'You already have a pending application. Please wait for the result before applying again.'
            ]);
        }

        // --- 2. COOLDOWN SYSTEM (3 Months Rule) ---
        // Check the last time they were APPROVED.
        $lastApproved = Application::where('user_id', $user->id)
            ->where('status', 'Approved')
            ->orderBy('approved_date', 'desc') // Get the most recent one
            ->first();

        if ($lastApproved && $lastApproved->approved_date) {
            $lastDate = Carbon::parse($lastApproved->approved_date);
            $nextEligibleDate = $lastDate->copy()->addMonths(3); // 3 Month Cooldown

            // If today is BEFORE the next eligible date, block them.
            if (Carbon::now()->lt($nextEligibleDate)) {
                return redirect()->back()->withErrors([
                    'program' => 'You have received assistance recently. Per guidelines, you can apply again on ' . $nextEligibleDate->format('F d, Y') . '.'
                ]);
            }
        }

        // --- 3. STANDARD VALIDATION ---
        $validated = $request->validate([
            'program' => 'required',
            'first_name' => 'required',
            'last_name' => 'required',
            'contact_number' => 'required',
            // Add other specific validations if needed
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
        $app->attachments = $paths;
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

    // --- ADMIN ACTIONS (With Logging) ---

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

    // --- NEW: Send Email ---
    // Ensure the application has a user loaded to get the email
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

    // --- NEW: Send Email ---
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
