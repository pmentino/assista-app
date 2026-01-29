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
        // --- 1. INITIALIZE QUERY ---
        $query = User::query();

        // --- 2. SEARCH LOGIC ---
        // We group this so OR logic doesn't mess up other filters
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                  ->orWhere('email', 'like', '%'.$request->search.'%');
            });
        }

        // --- 3. FILTER BY ROLE ---
        if ($request->role) {
            $query->where('type', $request->role);
        }

        // --- 4. DETERMINISTIC SORTING (CRITICAL FIX) ---
        // Instead of just 'latest()', we sort by Date AND ID.
        // This stops the list from "shuffling" when timestamps are identical.
        $users = $query->orderBy('created_at', 'desc')
                       ->orderBy('id', 'desc')
                       ->paginate(10)
                       ->withQueryString(); // Keeps your search active on Page 2

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']),
            'auth' => ['user' => Auth::user()]
        ]);
    }

    public function changeRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:admin,staff,user',
        ]);

        // Safety: Admin cannot change their own role
        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', 'You cannot change your own role.');
        }

        $user->update(['type' => $request->role]);

        return redirect()->back()->with('message', "User role updated to {$request->role}.");
    }

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
