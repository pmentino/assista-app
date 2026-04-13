<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Auth\Notifications\VerifyEmail; // <-- BAGONG ADD
use Illuminate\Notifications\Messages\MailMessage; // <-- BAGONG ADD

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
        if (env('APP_ENV') === 'production') {
            URL::forceScheme('https');
        }

        // --- BAGONG CODE PARA SA CUSTOM EMAIL VERIFICATION ---
        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
            return (new MailMessage)
                ->subject('I-verify ang iyong Email - Assista')
                ->greeting('Magandang araw, ' . $notifiable->name . '!')
                ->line('Salamat sa pag-register sa Assista (CSWDO Roxas City). I-click ang button sa ibaba para ma-verify ang iyong email address at tuluyan nang ma-activate ang iyong account.')
                ->action('I-verify ang Email', $url)
                ->line('Kung hindi ka gumawa ng account sa Assista, maaari mo na lamang balewalain ang email na ito.');
        });
    }
}
