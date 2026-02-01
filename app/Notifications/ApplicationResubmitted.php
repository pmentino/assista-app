<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\Application;

class ApplicationResubmitted extends Notification
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
        // 1. DYNAMIC LINKING: Check if the receiver is Staff or Admin
        $route = ($notifiable->role === 'staff' || $notifiable->type === 'staff')
            ? route('staff.applications.show', $this->application->id)
            : route('admin.applications.show', $this->application->id);

        return [
            'application_id' => $this->application->id,
            'status'         => 'Resubmitted',
            'program'        => $this->application->program,
            'applicant_name' => $this->application->first_name . ' ' . $this->application->last_name,
            'link'           => $route,
            'message'        => 'Applicant has corrected and resubmitted App #' . $this->application->id . ' for review.',
        ];
    }
}
