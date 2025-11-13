<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Application; // <-- Import the Application model

class ApplicationStatusUpdated extends Mailable
{
    use Queueable, SerializesModels;

    // Make the application data available to the email template
    public Application $application;

    /**
     * Create a new message instance.
     * We now accept the Application model here.
     */
    public function __construct(Application $application)
    {
        $this->application = $application;
    }

    /**
     * Get the message envelope.
     * Make the subject line dynamic based on the status.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Assista Application Status has been Updated to: ' . $this->application->status,
        );
    }

    /**
     * Get the message content definition.
     * Pass the application data to the view.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.application-status',
            with: [
                'application' => $this->application, // Make $application available in the template
            ],
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
