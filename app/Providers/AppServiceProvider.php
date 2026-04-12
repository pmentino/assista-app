<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL; // <-- 1. IDAGDAG ITO SA TAAS

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // 2. IDAGDAG ITONG IF STATEMENT NA ITO
        if (env('APP_ENV') === 'production') {
            URL::forceScheme('https');
        }
    }
}
