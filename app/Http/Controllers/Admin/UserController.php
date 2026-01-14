<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        // 1. Search Logic (Name or Email)
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                  ->orWhere('email', 'like', '%'.$request->search.'%');
            });
        }

        // 2. Filter by Role (Admin, Staff, User)
        if ($request->role) {
            $query->where('type', $request->role);
        }

        // 3. Pagination (10 users per page)
        $users = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']),
            'auth' => ['user' => Auth::user()]
        ]);
    }

    // --- REPLACED: Explicit Role Change Logic ---
    public function changeRole(Request $request, User $user)
    {
        // 1. Validate the input to ensure only valid roles are passed
        $request->validate([
            'role' => 'required|in:admin,staff,user',
        ]);

        // 2. Safety: Admin cannot change their own role
        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', 'You cannot change your own role.');
        }

        // 3. Update the user
        $user->update(['type' => $request->role]);

        return redirect()->back()->with('message', "User role updated to {$request->role}.");
    }

    // --- ACTION: DEACTIVATE / ACTIVATE ---
    public function toggleStatus(User $user)
    {
        // Safety: Admin cannot deactivate themselves
        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', 'You cannot deactivate your own account.');
        }

        $user->update(['is_active' => !$user->is_active]);

        $status = $user->is_active ? 'Activated' : 'Deactivated';
        return redirect()->back()->with('message', "User account {$status}.");
    }
}
