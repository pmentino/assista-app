<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class ApplicationStatusAlert extends Notification
{
    use Queueable;

    public $application;

    public function __construct($application)
    {
        $this->application = $application;
    }

    // We only use 'database' here to populate the Bell Icon
    public function via($notifiable)
    {
        return ['database'];
    }

    // This defines what data is saved into the database for the bell
    public function toArray($notifiable)
    {
        // --- SMART LINK LOGIC ---
        // If Rejected, go straight to Edit form. Otherwise, go to Dashboard.
        $actionLink = $this->application->status === 'Rejected'
            ? route('applications.edit', $this->application->id)
            : route('dashboard');

        return [
            'id' => $this->application->id,

            // 1. CLEAR STATUS HEADER (Professional & Direct)
            'message' => "Application {$this->application->status}",

            // 2. DETAILED CONTEXT (Who & What)
            'description' => "The {$this->application->program} request for {$this->application->first_name} {$this->application->last_name} has been processed.",

            'status' => $this->application->status,

            // 3. THE SMART ACTION LINK
            'link' => $actionLink,
        ];
    }
}
