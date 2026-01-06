<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {

                // --- CUSTOM REDIRECT LOGIC ---
                $user = Auth::user();

                if ($user->role === 'admin' || $user->type === 'admin') {
                    return redirect()->route('admin.dashboard');
                }

                if ($user->role === 'staff' || $user->type === 'staff') {
                    return redirect()->route('staff.dashboard');
                }

                // Default Applicant Dashboard
                return redirect()->route('dashboard');
            }
        }

        return $next($request);
    }
}
