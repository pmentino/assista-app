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

        .instruction-box { background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 4px; }

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
            <p>Mahal nga <strong>{{ $application->first_name }} {{ $application->last_name }}</strong>,</p>

            <p>Ini opisyal nga pahibalo halin sa CSWDO parte sa imo aplikasyon para sa <strong>{{ $application->program }}</strong>.</p>

            <div class="status-box">
                <span class="status-badge status-{{ $application->status }}">
                    @if($application->status === 'Approved')
                        NA-APRUBAHAN
                    @elseif($application->status === 'Rejected')
                        MAY KULANG / BALIK-REVIEW
                    @else
                        {{ strtoupper($application->status) }}
                    @endif
                </span>
            </div>

            @if($application->status === 'Approved')
                <p>Malipayon kami nga nagapahibalo nga ang imo request <strong>na-aprubahan</strong>. Ang kantidad nga inyo mabaton: <strong>₱{{ number_format($application->amount_released, 2) }}</strong>.</p>

                <p>Pwede ka na <strong>magpadayon sa Interview</strong> kag pag-verify sang imo mga dokumento.</p>

                <div class="instruction-box">
                    <p style="margin: 0 0 10px 0; font-weight: bold; color: #1e3a8a; font-size: 14px;">📍 DIIN MAGKADTO (Where):</p>
                    <p style="margin: 0 0 15px 0; padding-left: 15px; color: #1e293b;">CSWDO Office, Inzo Arnaldo Village, Roxas City</p>

                    <p style="margin: 0 0 10px 0; font-weight: bold; color: #1e3a8a; font-size: 14px;">📅 SAN-O (When):</p>
                    <p style="margin: 0; padding-left: 15px; color: #1e293b;">Lunes - Biyernes (8:00 AM - 5:00 PM)</p>
                </div>

                <div class="requirements-section">
                    <h3>📂 Mga Kinahanglan Dal-on (Requirements):</h3>
                    <p style="font-size: 13px; margin-bottom: 10px; color: #92400e;">Palihog dal-a ang <strong>ORIGINAL</strong> copy sang mga masunod:</p>
                    <ul>
                        @foreach($requirements as $req)
                            <li>{{ $req }}</li>
                        @endforeach
                        <li><strong>Valid Government ID</strong></li>
                        <li><strong>Printed Claim Stub</strong> (Pislita ang button sa idalom)</li>
                    </ul>
                </div>

                <a href="{{ route('applications.claim-stub', $application->id) }}" class="btn">I-download ang Claim Stub</a>

            @elseif($application->status === 'Rejected')
                <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 4px; color: #991b1b;">
                    <strong>⚠️ Gin-balik ang Aplikasyon / May Dapat Kay-uhon</strong><br><br>
                    <strong>Rason kung ngaa wala nabaton:</strong><br>
                    {{ $application->remarks }}
                </div>

                <p style="margin-top: 20px;"><strong>Indi magkabalaka.</strong> Pwede mo pa ini ma-kwa. Palihog sunda ang mga steps sa idalom:</p>

                <ol style="font-size: 14px; color: #334155; padding-left: 20px;">
                    <li style="margin-bottom: 5px;">Pislita ang <strong>"I-edit ang Aplikasyon"</strong> button.</li>
                    <li style="margin-bottom: 5px;">Kay-uha ang sala ukon i-upload ang kulang nga dokumento.</li>
                    <li style="margin-bottom: 5px;">I-pislit ang <strong>"Save"</strong> para ma-review namon liwat.</li>
                </ol>

                <a href="{{ route('applications.edit', $application->id) }}" class="btn" style="background-color: #ef4444;">I-edit ang Aplikasyon</a>

                <p style="font-size: 13px; color: #64748b; text-align: center;">(Ang pag-pislit sini nga button magadala sa imo sa dashboard para ma-edit ang form)</p>
            @endif

            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="font-size: 13px; color: #64748b;">Para sa mga pamangkot, magtawag sa hotline: <strong>(036) 52026-83</strong></p>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} City Social Welfare and Development Office. All rights reserved.</p>
            <p>Inzo Arnaldo Village, Roxas City, Capiz, Philippines</p>
            <p>Ini nga mensahe automatic nga ginpadala sang system. Indi mag-reply diri.</p>
        </div>
    </div>
</body>
</html>
