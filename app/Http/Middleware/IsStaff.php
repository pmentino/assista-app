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
        // Check if the user is logged in AND has the 'staff' role
        if (Auth::check() && Auth::user()->role === 'staff') {
            return $next($request);
        }

        // If not staff, redirect them to the homepage or show an error
        return redirect('/')->with('message', 'You do not have access to this page.');
    }
}
