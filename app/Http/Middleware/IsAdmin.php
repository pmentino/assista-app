<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated and if their role is 'admin'
        if (Auth::check() && Auth::user()->role == 'admin') {
            // If they are an admin, allow them to proceed to the requested page
            return $next($request);
        }

        // If not an admin, redirect them to their regular dashboard
        return redirect(route('dashboard'));
    }
}
