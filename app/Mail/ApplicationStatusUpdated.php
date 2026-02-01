<?php

namespace App\Mail;

use App\Models\Application;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ApplicationStatusUpdated extends Mailable
{
    use Queueable, SerializesModels;

    public $application;

    // Define the map as a static constant or property
    protected $requirementsMap = [
        'Hospitalization' => ['Personal Letter to Mayor', 'Final Hospital Bill', 'Medical Abstract / Certificate', 'Promissory Note (if discharged)'],
        'Medicine Assistance' => ['Personal Letter to Mayor', 'Prescription (with license #)', 'Medical Certificate', 'Quotation of Medicine'],
        'Laboratory / Diagnostic Tests' => ['Personal Letter to Mayor', 'Laboratory Request', 'Medical Certificate', 'Quotation of Procedure'],
        'Chemotherapy' => ['Personal Letter to Mayor', 'Chemotherapy Protocol', 'Medical Certificate', 'Quotation of Medicine'],
        'Anti-Rabies Vaccine' => ['Personal Letter to Mayor', 'Rabies Vaccination Card', 'Medical Certificate'],
        'Funeral Assistance' => ['Personal Letter to Mayor', 'Death Certificate (Certified True Copy)', 'Burial Contract'],
        'Educational Assistance' => ['Personal Letter to Mayor', 'Certificate of Enrollment / Registration', 'School ID']
    ];

    public function __construct(Application $application)
    {
        $this->application = $application;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Update on your AICS Application - CSWDO Roxas City',
        );
    }

    public function content(): Content
    {
        // Logic to get requirements based on program name
        // Default to empty array if program not found
        $reqs = $this->requirementsMap[$this->application->program] ?? [];

        return new Content(
            view: 'emails.application_status',
            with: [
                'requirements' => $reqs, // This passes the variable to the blade file
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
