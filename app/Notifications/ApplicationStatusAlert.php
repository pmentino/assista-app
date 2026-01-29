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

    // --- THIS WAS MISSING ---
    // This tells Laravel to store the notification in the 'notifications' table
    public function via($notifiable)
    {
        return ['database'];
    }

    // This defines the data saved in the database
    public function toArray($notifiable)
    {
        // Smart Link Logic
        $actionLink = $this->application->status === 'Rejected'
            ? route('applications.edit', $this->application->id)
            : route('dashboard');

        return [
            'id' => $this->application->id,

            // --- DATA FOR TRANSLATION ---
            'status' => $this->application->status,
            'program' => $this->application->program,
            'applicant_name' => $this->application->first_name . ' ' . $this->application->last_name,

            // --- FALLBACK MESSAGES (For Email or plain text) ---
            'message' => "Application {$this->application->status}",
            'description' => "The {$this->application->program} request for {$this->application->first_name} {$this->application->last_name} has been processed.",

            'link' => $actionLink,
        ];
    }
}
