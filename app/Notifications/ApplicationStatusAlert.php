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
        return [
            'application_id' => $this->application->id,
            'status' => $this->application->status,
            'message' => 'Your application status is now: ' . $this->application->status,
            // When they click the notification, it goes here:
            'link' => route('dashboard'),
        ];
    }
}
