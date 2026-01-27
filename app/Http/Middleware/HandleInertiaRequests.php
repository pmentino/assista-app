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
        // 1. Get Current Locale
        $locale = $request->session()->get('locale', config('app.locale'));
        App::setLocale($locale);

        // 2. DEFINE PATH
        $path = base_path("resources/lang/{$locale}.json");
        $translations = [];

        if (File::exists($path)) {
            $translations = json_decode(File::get($path), true);
        }

        // --- X-RAY DEBUG (START) ---
        // This will print the data to your browser and STOP the app.
        // We need to see if "welcome_message" is inside this list.
        dd([
            'STATUS' => 'Middleware Loaded',
            'CURRENT LOCALE' => $locale,
            'FILE PATH' => $path,
            'FILE EXISTS?' => File::exists($path),
            'LOADED TRANSLATIONS' => $translations
        ]);
        // --- X-RAY DEBUG (END) ---

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'notifications' => $request->user() ? $request->user()->unreadNotifications : [],
            ],
            'locale' => $locale,
            'translations' => $translations,
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
