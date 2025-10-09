<?php

namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ApplicationController extends Controller
{
    // ... create() and store() methods ...

    public function updateStatus(Request $request, Application $application): RedirectResponse
    {
        $validated = $request->validate(['status' => 'required|string|in:Approved,Rejected']);
        $application->update(['status' => $validated['status']]);
        return redirect()->back()->with('message', 'Status updated successfully!');
    }
}
