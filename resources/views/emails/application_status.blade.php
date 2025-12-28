<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Application Status Update</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .email-container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #f3f4f6; padding-bottom: 20px; }
        .header h1 { color: #1e3a8a; margin: 0; font-size: 24px; }
        .logo { font-size: 28px; font-weight: bold; color: #1e3a8a; text-decoration: none; }

        .content { color: #374151; line-height: 1.6; font-size: 16px; }
        .status-box { text-align: center; margin: 25px 0; padding: 20px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; }

        .badge { display: inline-block; padding: 8px 16px; border-radius: 99px; font-weight: bold; text-transform: uppercase; font-size: 14px; letter-spacing: 1px; }
        .approved { background-color: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
        .rejected { background-color: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

        .details-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .details-table td { padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
        .details-table td:first-child { color: #6b7280; width: 40%; }
        .details-table td:last-child { font-weight: bold; color: #111827; }

        .footer { text-align: center; font-size: 12px; color: #9ca3af; margin-top: 30px; border-top: 1px solid #f3f4f6; padding-top: 20px; }

        .button { display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
        .button:hover { background-color: #1d4ed8; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">ASSISTA</div>
            <p>City Social Welfare and Development Office</p>
        </div>

        <div class="content">
            <p>Hello <strong>{{ $application->first_name }}</strong>,</p>

            <p>This is an automated notification regarding your application for the <strong>{{ $application->program }}</strong> program.</p>

            <div class="status-box">
                <p style="margin-bottom: 10px; font-size: 14px; color: #6b7280;">Application Status</p>
                <span class="badge {{ strtolower($application->status) }}">
                    {{ $application->status }}
                </span>
            </div>

            @if($application->status === 'Approved')
                <p>We are pleased to inform you that your request has been approved. Please see the details below:</p>
                <table class="details-table">
                    <tr>
                        <td>Amount Released:</td>
                        <td style="color: #059669;">₱{{ number_format($application->amount_released, 2) }}</td>
                    </tr>
                    <tr>
                        <td>Date Approved:</td>
                        <td>{{ date('F d, Y') }}</td>
                    </tr>
                </table>
                <p style="margin-top: 20px;"><strong>Next Steps:</strong> Please visit the CSWDO office with your valid Government ID to claim your assistance.</p>

            @elseif($application->status === 'Rejected')
                <p>After careful review, we regret to inform you that your request could not be processed at this time.</p>
                <div style="background-color: #fff1f2; padding: 15px; border-left: 4px solid #e11d48; margin: 15px 0; border-radius: 4px;">
                    <strong>Reason for Rejection:</strong><br>
                    {{ $application->remarks ?? 'Documents did not meet the criteria.' }}
                </div>
                <p>You may re-apply once you meet the requirements or after the cooldown period.</p>
            @endif

            <div style="text-align: center;">
                <a href="{{ url('/dashboard') }}" class="button">View Application Details</a>
            </div>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} City Social Welfare and Development Office (CSWDO).<br>Roxas City Government. All rights reserved.</p>
            <p>This is a system-generated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>
