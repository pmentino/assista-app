<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Mail;
use App\Mail\ApplicationStatusUpdated;
use App\Notifications\ApplicationStatusAlert;
use App\Notifications\ApplicationResubmitted; // <--- NEW IMPORT
use App\Models\Setting;
use App\Models\Application;
use App\Models\User; // <--- NEW IMPORT
use App\Models\AuditLog;
use App\Models\AssistanceProgram;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use App\Models\MonthlyBudget;
use Illuminate\Validation\ValidationException;

class ApplicationController extends Controller
{
    // ... (create, store, edit methods remain the same) ...
    public function create()
    {
        $programs = AssistanceProgram::where('is_active', true)
            ->select('id', 'title', 'requirements')
            ->get();

        $locale = session('locale', 'en');
        $path = base_path("resources/lang/{$locale}.json");
        $translations = [];

        if (file_exists($path)) {
            $translations = json_decode(file_get_contents($path), true) ?? [];
        }

        return Inertia::render('Applications/Create', [
            'auth' => ['user' => Auth::user()],
            'programs' => $programs,
            'translations' => $translations,
            'locale' => $locale
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        if (Application::where('user_id', $user->id)->where('status', 'Pending')->exists()) {
             return Inertia::render('Applications/Create', [
                'errors' => ['error' => '⚠️ STOP: You already have a pending application.'],
                'programs' => AssistanceProgram::where('is_active', true)->select('id', 'title', 'requirements')->get(),
                'auth' => ['user' => Auth::user()],
                'translations' => [],
                'locale' => 'en'
            ]);
        }

        $request->validate([
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
            'valid_id' => 'required|file|max:10240',
            'indigency_cert' => 'required|file|max:10240',
        ]);

        $paths = [];
        if ($request->hasFile('valid_id')) $paths['valid_id'] = $request->file('valid_id')->store('documents', 'public');
        if ($request->hasFile('indigency_cert')) $paths['indigency_cert'] = $request->file('indigency_cert')->store('documents', 'public');

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $index => $file) {
                if($file) $paths[$index] = $file->store('documents', 'public');
            }
        }

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
                'city' => $request->city ?? 'Roxas City',
                'contact_number' => $request->contact_number,
                'email' => $request->email,
                'facebook_link' => $request->facebook_link,
                'valid_id' => $paths['valid_id'] ?? null,
                'indigency_cert' => $paths['indigency_cert'] ?? null,
                'attachments' => $paths,
                'status' => 'Pending',
            ]);

        } catch (\Exception $e) {
            return redirect()->route('applications.create')->with('error', 'Error creating application: ' . $e->getMessage());
        }

        return redirect()->route('dashboard')->with('message', 'Application submitted successfully.');
    }

    public function edit(Application $application)
    {
        return Inertia::render('Applications/Edit', [
            'application' => $application,
            'auth' => ['user' => Auth::user()]
        ]);
    }

    public function update(Request $request, Application $application)
    {
        $application->fill($request->except(['valid_id', 'indigency_cert', 'attachments']));

        if ($request->hasFile('valid_id')) {
            if ($application->valid_id) Storage::disk('public')->delete($application->valid_id);
            $application->valid_id = $request->file('valid_id')->store('documents', 'public');
        }
        if ($request->hasFile('indigency_cert')) {
            if ($application->indigency_cert) Storage::disk('public')->delete($application->indigency_cert);
            $application->indigency_cert = $request->file('indigency_cert')->store('documents', 'public');
        }

        $currentAttachments = $application->attachments ?? [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $index => $file) {
                if ($file) {
                    $currentAttachments[$index] = $file->store('documents', 'public');
                }
            }
            $application->attachments = $currentAttachments;
        }

        // --- RESUBMISSION LOGIC START ---
        if ($application->status === 'Rejected') {
            $application->status = 'Pending';
            $application->remarks = null;

            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => 'Resubmitted Application',
                'details' => "Resubmitted App #{$application->id} for review"
            ]);

            // FIX: Notify all Admins and Staff about the resubmission
            try {
                $recipients = User::whereIn('role', ['admin', 'staff'])
                                  ->orWhereIn('type', ['admin', 'staff']) // Check 'type' if your user model uses it
                                  ->get();

                foreach ($recipients as $recipient) {
                    $recipient->notify(new ApplicationResubmitted($application));
                }
            } catch (\Exception $e) {
                // Keep silent if notification fails so user flow isn't interrupted
            }
        }
        // --- RESUBMISSION LOGIC END ---

        $application->save();

        return redirect()->route('dashboard')->with('message', 'Application updated successfully.');
    }

    // --- ADMIN ACTIONS (APPROVAL AUTHORITY) ---

    public function approve(Request $request, Application $application)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1'
        ]);

        $now = Carbon::now();
        $monthlyBudget = MonthlyBudget::where('month', $now->month)->where('year', $now->year)->first();

        if (!$monthlyBudget) {
            return Inertia::render('Admin/ApplicationShow', [
                'application' => $application,
                'errors' => ['amount' => 'SYSTEM HALT: No budget allocated for this month.']
            ]);
        }

        $totalReleased = Application::where('status', 'Approved')
            ->whereMonth('approved_date', $now->month)
            ->whereYear('approved_date', $now->year)
            ->sum('amount_released');

        $remainingBalance = (float)($monthlyBudget->amount ?? 0) - (float)($totalReleased ?? 0);
        $requestedAmount = (float)$request->amount;

        if ($requestedAmount > $remainingBalance) {
            return Inertia::render('Admin/ApplicationShow', [
                'application' => $application,
                'errors' => [
                    'amount' => 'DISBURSEMENT FAILED: Insufficient funds. Balance: ₱' . number_format($remainingBalance, 2)
                ]
            ]);
        }

        $application->update([
            'status' => 'Approved',
            'amount_released' => $request->amount,
            'remarks' => null,
            'approved_date' => now(),
        ]);

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'Approved Disbursement',
            'details' => "Authorized release of ₱" . number_format($request->amount, 2) . " for App #{$application->id}"
        ]);

        // Send Email & Notification
        if ($application->user) {
            $application->user->notify(new ApplicationStatusAlert($application));

            if ($application->user->email) {
                // Send Email for Approval
                try {
                    Mail::to($application->user->email)->send(new ApplicationStatusUpdated($application));
                } catch (\Exception $e) { }
            }
        }

        return redirect()->back()->with('message', 'Application approved and funds authorized for release.');
    }

    // Reject (No Reason Provided)
    public function reject(Request $request, Application $application)
    {
        $application->update(['status' => 'Rejected']);

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'Rejected Application',
            'details' => "Officially Denied App #{$application->id}"
        ]);

        // FIX: Send Email & Notification for Rejection
        if ($application->user) {
            $application->user->notify(new ApplicationStatusAlert($application));

            if ($application->user->email) {
                // Send Email for Rejection
                try {
                    Mail::to($application->user->email)->send(new ApplicationStatusUpdated($application));
                } catch (\Exception $e) { }
            }
        }

        return redirect()->back()->with('warning', 'Application has been officially denied.');
    }

    public function addRemark(Request $request, Application $application)
    {
        $request->validate(['remarks' => 'required|string|max:1000']);

        $application->update([
            'status' => 'Rejected',
            'remarks' => $request->remarks,
        ]);

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'Rejected Application',
            'details' => "Denied App #{$application->id} - Reason: {$request->remarks}"
        ]);

        // FIX: Send Email & Notification for Rejection
        if ($application->user) {
            $application->user->notify(new ApplicationStatusAlert($application));

            if ($application->user->email) {
                // Send Email for Rejection
                try {
                    Mail::to($application->user->email)->send(new ApplicationStatusUpdated($application));
                } catch (\Exception $e) { }
            }
        }

        return redirect()->back()->with('warning', 'Application rejected and applicant notified.');
    }

    public function generateClaimStub(Application $application)
    {
        if ($application->status !== 'Approved') {
            abort(403, 'This application is not approved yet.');
        }

        $signatories = [
            'assessed_by' => Setting::where('key', 'signatory_social_worker')->value('value') ?? 'BIVIEN B. DELA CRUZ, RSW',
            'approved_by' => Setting::where('key', 'signatory_cswdo_head')->value('value') ?? 'PERSEUS L. CORDOVA',
            'office_hotline' => Setting::where('key', 'office_hotline')->value('value') ?? '(036) 52026-83',
            'office_address' => Setting::where('key', 'office_address')->value('value') ?? 'Inzo Arnaldo Village, Roxas City',
        ];

        $verificationUrl = route('track.index', [
            'ref' => $application->id,
            'name' => $application->last_name
        ]);

        $qrCode = base64_encode(
            \SimpleSoftwareIO\QrCode\Facades\QrCode::format('svg')
                ->size(100)
                ->errorCorrection('H')
                ->generate($verificationUrl)
        );

        $pdf = Pdf::loadView('pdf.claim_stub', [
            'application' => $application,
            'signatories' => $signatories,
            'qrCode' => $qrCode,
        ]);

        $pdf->setPaper([0, 0, 612, 936], 'portrait');

        return $pdf->stream('Certificate_Eligibility_' . $application->id . '.pdf');
    }

    public function saveNote(Request $request, Application $application)
    {
        $request->validate([
            'remarks' => 'required|string|max:1000',
        ]);

        $application->update([
            'remarks' => $request->remarks,
        ]);

        return redirect()->back()->with('message', 'Verification note saved successfully.');
    }

    // ==========================================================
    //  PUBLIC TRACKING FEATURE
    // ==========================================================

    public function showTrack()
    {
        return Inertia::render('Track');
    }

    public function track(Request $request)
    {
        $request->validate([
            'birth_date'   => 'required|date',
            'reference_id' => 'nullable|numeric',
            'first_name'   => 'nullable|string',
            'last_name'    => 'nullable|string',
        ]);

        $query = Application::query();

        if ($request->filled('reference_id')) {
            $query->where('id', $request->reference_id);
        } elseif ($request->filled('first_name') && $request->filled('last_name')) {
            $query->where('first_name', 'like', $request->first_name)
                  ->where('last_name', 'like', $request->last_name);
        } else {
            return back()->withErrors(['error' => 'Please enter either an Application ID or your Full Name.']);
        }

        $application = $query->whereDate('birth_date', $request->birth_date)->first();

        if (!$application) {
            return back()->withErrors(['error' => 'No record found. Please check your details and birthdate.']);
        }

        return Inertia::render('Track', [
            'result' => [
                'id' => $application->id,
                'first_name' => $application->first_name,
                'last_name' => $application->last_name,
                'status' => $application->status,
                'program' => $application->program,
                'remarks' => $application->remarks,
                'updated_at' => $application->updated_at,
            ]
        ]);
    }
}
