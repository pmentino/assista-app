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
            'attachments' => 'nullable|array',
            'attachments.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
        ]);

        $dataToSave = collect($validatedData)->except(['valid_id', 'indigency_cert', 'attachments'])->toArray();

        $application = new ApplicationModel($dataToSave);
        $application->user_id = Auth::id();
        $application->status = 'Pending';

        $filePaths = [];
        if ($request->hasFile('valid_id')) {
            $filePaths['valid_id'] = $request->file('valid_id')->store('attachments', 'public');
        }
        if ($request->hasFile('indigency_cert')) {
            $filePaths['indigency_cert'] = $request->file('indigency_cert')->store('attachments', 'public');
        }
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $index => $file) {
                if ($file) {
                    $filePaths[$index] = $file->store('attachments', 'public');
                }
            }
        }

        $application->attachments = $filePaths;
        $application->save();

        return redirect()->route('dashboard')->with('message', 'Application submitted successfully!');
    }

    public function edit(ApplicationModel $application)
    {
        if ($application->user_id !== Auth::id()) {
            abort(403);
        }
        if (!in_array($application->status, ['Rejected', 'Pending'])) {
             return redirect()->route('dashboard')->with('error', 'You cannot edit this application.');
        }

        return Inertia::render('Application/Edit', [
            'application' => $application
        ]);
    }

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

    // --- THIS IS THE FIX FOR THE DATABASE (APPROVED DATE) ---
    public function approve(Request $request, ApplicationModel $application)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0',
        ]);

        $application->update([
            'status' => 'Approved',
            'amount_released' => $request->amount,
            'approved_date' => now(), // <--- SAVES THE TIME
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
            'status' => 'Rejected'
        ]);

        return redirect()->back()->with('message', 'Remark saved.');
    }

    public function generateClaimStub(ApplicationModel $application)
    {
        if ($application->user_id !== Auth::id() && Auth::user()->type !== 'admin') {
            abort(403);
        }

        if ($application->status !== 'Approved') {
            return redirect()->back()->with('error', 'Claim stub is only available for approved applications.');
        }

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.claim_stub', [
            'application' => $application
        ]);

        return $pdf->download('Claim_Stub_' . $application->id . '.pdf');
    }
}
