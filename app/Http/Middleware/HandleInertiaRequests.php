<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\File;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $locale = $request->session()->get('locale', config('app.locale'));
        App::setLocale($locale);

        $path = base_path("resources/lang/{$locale}.json");
        $translations = [];

        if (File::exists($path)) {
            $translations = json_decode(File::get($path), true);
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                // Ensure notifications are passed for the Bell
                'notifications' => $request->user() ? $request->user()->unreadNotifications : [],
            ],
            'locale' => $locale,
            'translations' => $translations,
            // --- FIX: ADDED 'warning' KEY HERE ---
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'), // <--- CRITICAL FIX
            ],
        ];
    }
}
