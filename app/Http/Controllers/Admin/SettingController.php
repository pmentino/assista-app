<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class SettingController extends Controller
{
    public function index()
    {
        // Fetch all settings and map them to a simple key-value object for the frontend
        $settings = Setting::all()->mapWithKeys(function ($item) {
            return [$item->key => $item->value];
        });

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
            'auth' => ['user' => Auth::user()]
        ]);
    }

    public function update(Request $request)
    {
        // 1. VALIDATION: Ensure data integrity for official fields
        $request->validate([
            'accepting_applications' => 'nullable|in:0,1',
            'system_announcement' => 'nullable|string|max:255',
            'signatory_cswdo_head' => 'nullable|string|max:100',
            'signatory_social_worker' => 'nullable|string|max:100',

            // NEW FIELDS (Added validation to prevent errors)
            'office_hotline' => 'nullable|string|max:50',
            'office_address' => 'nullable|string|max:255',
        ]);

        // 2. DYNAMIC SAVING
        // This loop automatically handles 'office_hotline' and 'office_address'
        // because they are now part of the $request payload.
        $data = $request->except(['_token']);

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return redirect()->back()->with('message', 'System configuration updated successfully.');
    }
}
