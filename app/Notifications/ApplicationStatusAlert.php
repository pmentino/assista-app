<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\Application;

// 1. REMOVED "implements ShouldQueue" so it saves INSTANTLY
class ApplicationStatusAlert extends Notification
{
    use Queueable;

    protected $application;

    public function __construct(Application $application)
    {
        $this->application = $application;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        // 2. ADDED these specific keys so your "Detailed Design" works
        return [
            'application_id' => $this->application->id,
            'status'         => $this->application->status,
            'program'        => $this->application->program, // <--- Required for your design
            'applicant_name' => $this->application->first_name . ' ' . $this->application->last_name, // <--- Required for your design
            'link'           => route('applications.edit', $this->application->id),
            'message'        => 'Your application for ' . $this->application->program . ' has been ' . strtolower($this->application->status) . '.',
        ];
    }
}
