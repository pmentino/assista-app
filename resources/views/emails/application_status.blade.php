<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Application Status Update</title>
    <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; background-color: #f4f6f8; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-top: 6px solid #1e3a8a; }
        .header { background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 1px solid #e5e7eb; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 1px; }
        .header p { margin: 5px 0 0; font-size: 13px; color: #64748b; font-weight: 500; }
        .content { padding: 30px; }
        .status-box { text-align: center; margin: 25px 0; padding: 15px; background: #f8fafc; border-radius: 8px; }
        .status-badge { display: inline-block; padding: 8px 20px; border-radius: 50px; font-weight: bold; font-size: 16px; letter-spacing: 0.5px; }
        .status-Approved { background-color: #d1fae5; color: #065f46; border: 1px solid #34d399; }
        .status-Rejected { background-color: #fee2e2; color: #991b1b; border: 1px solid #f87171; }

        .requirements-section { background-color: #fffbeb; border: 1px solid #fcd34d; padding: 20px; border-radius: 8px; margin-top: 25px; }
        .requirements-section h3 { margin-top: 0; color: #92400e; font-size: 16px; display: flex; align-items: center; }
        .requirements-section ul { margin: 10px 0 0; padding-left: 20px; }
        .requirements-section li { margin-bottom: 6px; color: #78350f; font-size: 14px; }

        .btn { display: block; width: fit-content; margin: 25px auto; background-color: #2563eb; color: white !important; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; text-align: center; }
        .btn:hover { background-color: #1d4ed8; }

        .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>CSWDO Roxas City</h1>
            <p>Assistance to Individuals in Crisis Situation (AICS)</p>
        </div>

        <div class="content">
            <p>Dear <strong>{{ $application->first_name }} {{ $application->last_name }}</strong>,</p>

            <p>This is an official notification regarding your application for <strong>{{ $application->program }}</strong>.</p>

            <div class="status-box">
                <span class="status-badge status-{{ $application->status }}">
                    {{ strtoupper($application->status) }}
                </span>
            </div>

            @if($application->status === 'Approved')
                <p>We are pleased to inform you that your request has been <strong>approved</strong>. The authorized assistance amount is <strong>₱{{ number_format($application->amount_released, 2) }}</strong>.</p>

                <div class="requirements-section">
                    <h3>📂 Requirements for Claiming:</h3>
                    <p style="font-size: 13px; margin-bottom: 10px; color: #92400e;">Please present the original copies of the following at the CSWDO Office:</p>
                    <ul>
                        @foreach($requirements as $req)
                            <li>{{ $req }}</li>
                        @endforeach
                        <li><strong>Valid Government ID</strong></li>
                        <li><strong>Printed Claim Stub</strong> (Button below)</li>
                    </ul>
                </div>

                <a href="{{ route('applications.claim-stub', $application->id) }}" class="btn">Download Claim Stub</a>

            @elseif($application->status === 'Rejected')
                <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 4px; color: #991b1b;">
                    <strong>⚠️ Application Returned for Correction</strong><br><br>
                    <strong>Reason:</strong><br>
                    {{ $application->remarks }}
                </div>

                <p style="margin-top: 20px;"><strong>Action Required:</strong> Please update your application details or documents based on the remarks above and resubmit it for verification.</p>

                <a href="{{ route('applications.edit', $application->id) }}" class="btn" style="background-color: #ef4444;">Edit & Resubmit Application</a>

                <p style="font-size: 13px; color: #64748b; text-align: center;">(Clicking the button will take you to your dashboard to edit the form)</p>
            @endif

            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="font-size: 13px; color: #64748b;">For inquiries, contact our hotline: <strong>(036) 52026-83</strong></p>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} City Social Welfare and Development Office. All rights reserved.</p>
            <p>Inzo Arnaldo Village, Roxas City, Capiz, Philippines</p>
            <p>This is an automated system-generated message.</p>
        </div>
    </div>
</body>
</html>
