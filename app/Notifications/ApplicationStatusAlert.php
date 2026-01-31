<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\Application;

// FIX: Removed "implements ShouldQueue" to force instant database save
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
        // FIX: Added 'program' and 'applicant_name' for your custom design
        return [
            'application_id' => $this->application->id,
            'status'         => $this->application->status, // 'Approved' or 'Rejected'
            'program'        => $this->application->program,
            'applicant_name' => $this->application->first_name . ' ' . $this->application->last_name,
            'link'           => route('applications.edit', $this->application->id),
            'message'        => 'Your application for ' . $this->application->program . ' has been ' . strtolower($this->application->status) . '.',
        ];
    }
}
