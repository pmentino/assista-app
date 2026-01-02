<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        // 1. Validate Fields
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($user->id)],
            'contact_number' => ['nullable', 'string', 'max:20'],
            'civil_status' => ['nullable', 'string'],
            'sex' => ['nullable', 'string'],
            'birth_date' => ['nullable', 'date'],
            'barangay' => ['nullable', 'string'],
            'house_no' => ['nullable', 'string'],
            'photo' => ['nullable', 'image', 'max:5120'],
        ]);

        // 2. Handle Photo Upload
        if ($request->hasFile('photo')) {
            if ($user->profile_photo_path) {
                Storage::disk('public')->delete($user->profile_photo_path);
            }
            $path = $request->file('photo')->store('profile-photos', 'public');
            $user->profile_photo_path = $path;
        }

        // 3. Update User Profile
        $user->fill($request->except(['photo', 'email_verified_at']));
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }
        $user->save();

        // --- 4. SAFE SYNC TO PENDING APPLICATIONS ---
        // We filter the data first. We only update the application if the user provided a value.
        // This prevents overwriting existing application data with "null".

        $syncData = array_filter([
            'first_name' => $request->name,
            'contact_number' => $request->contact_number,
            'civil_status' => $request->civil_status,
            'sex' => $request->sex,
            'birth_date' => $request->birth_date,
            'barangay' => $request->barangay,
            'house_no' => $request->house_no,
        ], function($value) {
            return !is_null($value) && $value !== '';
        });

        if (!empty($syncData)) {
            \App\Models\Application::where('user_id', $user->id)
                ->where('status', 'Pending')
                ->update($syncData);
        }

        return Redirect::route('profile.edit')->with('message', 'Profile updated successfully.');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
