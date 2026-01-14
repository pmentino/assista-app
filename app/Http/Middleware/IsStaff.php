<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class IsStaff
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // FIX: Check 'type' instead of 'role' (since we are using the 'type' column now)
        // We also allow 'admin' to access staff routes if needed, or strictly 'staff'.
        // For now, let's strictly check if they are Staff.
        if (Auth::check() && (Auth::user()->type === 'staff' || Auth::user()->role === 'staff')) {
            return $next($request);
        }

        // If not staff, redirect them to the homepage with an error
        return redirect('/')->with('message', 'You do not have access to this page.');
    }
}
