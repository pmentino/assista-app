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

        /* NEW: Requirements Box Style */
        .requirements-box { background-color: #eff6ff; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6; margin-top: 20px; font-size: 14px; }
        .requirements-box ul { margin: 10px 0 0 0; padding-left: 20px; }
        .requirements-box li { margin-bottom: 5px; }

        .schedule-info { margin-top: 15px; font-size: 14px; color: #4b5563; border-top: 1px dashed #d1d5db; padding-top: 15px; }

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

            <p>This is an notification regarding your application for <strong>{{ $application->program }}</strong> assistance.</p>

            <div class="status-box">
                <p style="margin-bottom: 10px; font-size: 14px; color: #6b7280;">Application Status</p>
                <span class="badge {{ strtolower($application->status) }}">
                    {{ $application->status }}
                </span>
            </div>

            @if($application->status === 'Approved')
                <p>We are pleased to inform you that your request has been approved.</p>

                <table class="details-table">
                    <tr>
                        <td>Amount Approved:</td>
                        <td style="color: #059669;">₱{{ number_format($application->amount_released, 2) }}</td>
                    </tr>
                    <tr>
                        <td>Reference ID:</td>
                        <td>#{{ str_pad($application->id, 6, '0', STR_PAD_LEFT) }}</td>
                    </tr>
                </table>

                <div class="requirements-box">
                    <strong>📋 IMPORTANT: What to Bring</strong>
                    <p style="margin: 5px 0;">Please bring the <strong>HARD COPIES (Original/Photocopy)</strong> of the following documents you uploaded:</p>
                    <ul>
                        <li><strong>Valid Government ID</strong> (Original for verification)</li>
                        <li><strong>Barangay Certificate of Indigency</strong></li>
                        @if(in_array($application->program, ['Hospitalization', 'Medical Assistance', 'Laboratory Tests', 'Chemotherapy', 'Anti-Rabies Vaccine', 'Diagnostic Blood Tests']))
                            <li>Medical Certificate / Abstract</li>
                            <li>Prescription / Hospital Bill / Quotation</li>
                        @elseif($application->program === 'Funeral Assistance')
                            <li>Death Certificate (Certified True Copy)</li>
                            <li>Funeral Contract</li>
                        @elseif($application->program === 'Educational Assistance')
                            <li>Certificate of Enrollment / Registration Form</li>
                            <li>School ID</li>
                        @else
                            <li>All other supporting documents for {{ $application->program }}</li>
                        @endif
                    </ul>
                </div>

                <div class="schedule-info">
                    <p><strong>📍 Where to Go:</strong><br>
                    CSWDO Office, Inzo Arnaldo Village, Roxas City</p>

                    <p><strong>🕒 When to Claim:</strong><br>
                    Monday to Friday (except Holidays)<br>
                    8:00 AM - 11:30 AM | 1:00 PM - 4:00 PM</p>

                    <p style="color: #ef4444; font-weight: bold; font-size: 13px;">
                        NOTE: Please present this email or your printed Claim Stub to the officer in charge.
                    </p>
                </div>

            @elseif($application->status === 'Rejected')
                <p>After careful review, we regret to inform you that your request could not be processed at this time.</p>
                <div style="background-color: #fff1f2; padding: 15px; border-left: 4px solid #e11d48; margin: 15px 0; border-radius: 4px;">
                    <strong>Reason for Rejection:</strong><br>
                    {{ $application->remarks ?? 'Documents did not meet the criteria.' }}
                </div>
                <p>You may edit your application and resubmit once you have the correct requirements.</p>
            @endif

            <div style="text-align: center;">
                <a href="{{ url('/dashboard') }}" class="button">View Application Details</a>
            </div>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} City Social Welfare and Development Office (CSWDO).<br>Roxas City Government. All rights reserved.</p>
            <p>Hotline: (036) 52026-83</p>
        </div>
    </div>
</body>
</html>
