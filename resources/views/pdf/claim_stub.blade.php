<!DOCTYPE html>
<html>
<head>
    <title>Certificate of Eligibility - {{ $application->last_name }}</title>
    <style>
        /* SET PAPER SIZE TO LONG BOND PAPER (8.5 x 13 inches) */
        @page { size: 21.59cm 33.02cm; margin: 1.25cm 1.25cm; }

        body { font-family: 'Times New Roman', serif; font-size: 11pt; margin: 0; padding: 0; line-height: 1.15; color: #000; }

        /* HEADER LAYOUT WITH LOGOS */
        .header-table { width: 100%; border-collapse: collapse; margin-bottom: 5px; }
        .header-table td { vertical-align: middle; text-align: center; }

        .logo-left { width: 80px; text-align: left; }
        .logo-right { width: 80px; text-align: right; }
        .logo-img { width: 80px; height: auto; object-fit: contain; }

        .header-text h4 { margin: 0; font-weight: normal; font-size: 10pt; font-family: 'Old English Text MT', serif; letter-spacing: 1px; }
        .header-text h3 { margin: 2px 0; font-weight: bold; font-size: 12pt; text-transform: uppercase; letter-spacing: 2px; }
        .header-text h5 { margin: 0; font-size: 9pt; font-style: italic; font-weight: normal; }
        .header-text h2 { margin: 2px 0; font-size: 11pt; font-weight: bold; font-family: 'Monotype Corsiva', cursive; }
        .header-text p { margin: 0; font-size: 7pt; }

        /* Title */
        .title { text-align: center; font-weight: bold; text-decoration: underline; font-size: 14pt; margin: 15px 0 10px 0; text-transform: uppercase; letter-spacing: 1px; }

        /* Checkboxes Section */
        .checkbox-section { width: 100%; margin-bottom: 10px; font-size: 8pt; border-collapse: collapse; }
        .checkbox-section td { vertical-align: top; padding-bottom: 1px; }
        .check-box { display: inline-block; width: 8px; height: 8px; border: 1px solid #000; margin-right: 3px; vertical-align: middle; }
        .checked { background-color: #000; }

        /* Main Body */
        .certify-text { text-align: justify; margin-bottom: 8px; text-indent: 30px; font-size: 11pt; }

        .details-line {
            border-bottom: 1px solid #000;
            display: inline-block;
            text-align: center;
            font-weight: bold;
            padding: 0 5px;
            vertical-align: bottom;
        }

        /* Family Table */
        .family-table { width: 100%; border-collapse: collapse; margin: 5px 0; font-size: 10pt; }
        .family-table th { border-bottom: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; text-transform: uppercase; }
        .family-table td { border-bottom: 1px solid #ccc; padding: 4px; text-align: center; }

        /* Signatures */
        .signatures { width: 100%; margin-top: 25px; margin-bottom: 10px; }
        .signatures td { width: 50%; vertical-align: top; padding: 0 15px; }
        .sig-line { border-top: 1px solid #000; margin-top: 30px; width: 95%; margin-left: auto; margin-right: auto; }
        .role { font-size: 8pt; font-style: italic; text-align: center; margin-top: 2px; }
        .signatory-name { text-align: center; font-weight: bold; text-transform: uppercase; font-size: 10pt; }

        /* Acknowledgement Receipt (Bottom Part) */
        .receipt-section { margin-top: 25px; border-top: 2px dashed #000; padding-top: 15px; page-break-inside: avoid; }
        .receipt-title { text-align: center; font-weight: bold; font-size: 13pt; margin-bottom: 15px; text-transform: uppercase; }

        /* Declaration Text */
        .declaration { font-size: 7pt; font-style: italic; text-align: justify; margin-top: 15px; color: #444; width: 90%; margin-left: auto; margin-right: auto; }
    </style>
</head>
<body>

    <table class="header-table">
        <tr>
            <td class="logo-left">
                <img src="{{ public_path('images/cswdo-logo.jpg') }}" class="logo-img" alt="CSWDO Logo">
            </td>

            <td class="header-text">
                <h4>Republic of the Philippines</h4>
                <h3>CITY OF ROXAS</h3>
                <h5>Province of Capiz</h5>
                <h2>Office of the City Social Welfare and Development Officer</h2>
                <p>{{ $signatories['office_address'] }} | Tel: {{ $signatories['office_hotline'] }}</p>
            </td>

            <td class="logo-right">
                <img src="{{ public_path('images/roxas-seal.png') }}" class="logo-img" alt="Roxas Seal">
            </td>
        </tr>
    </table>

    <div class="title">CERTIFICATE OF ELIGIBILITY</div>

    <table class="checkbox-section">
        <tr>
            <td width="25%"><strong>Source of Fund:</strong></td>
            <td width="30%"><strong>Clientele Category:</strong></td>
            <td width="20%"></td>
            <td width="25%"></td>
        </tr>
        <tr>
            <td><span class="check-box checked"></span> CSWDO (AICS)</td>
            <td><span class="check-box"></span> Family Head/Needy Adult</td>
            <td><span class="check-box"></span> PWD</td>
            <td><span class="check-box"></span> Senior Citizen</td>
        </tr>
        <tr>
            <td><span class="check-box"></span> CMO - GAD</td>
            <td><span class="check-box"></span> Out of School Youth</td>
            <td><span class="check-box"></span> Student</td>
            <td><span class="check-box"></span> Solo Parent</td>
        </tr>
        <tr>
            <td><span class="check-box"></span> BLGU/SK</td>
            <td><span class="check-box"></span> 4Ps Beneficiary</td>
            <td></td>
            <td></td>
        </tr>
    </table>

    <div class="certify-text">
        This is to certify that <span class="details-line" style="min-width: 250px;">{{ strtoupper($application->first_name . ' ' . $application->last_name) }}</span> residing at barangay <span class="details-line" style="min-width: 150px;">{{ $application->barangay }}</span>, Roxas City with the following family members:
    </div>

    <table class="family-table">
        <thead>
            <tr>
                <th width="45%">NAME</th>
                <th width="15%">AGE</th>
                <th width="40%">RELATIONSHIP</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ strtoupper($application->first_name . ' ' . $application->last_name) }}</td>
                <td>{{ \Carbon\Carbon::parse($application->birth_date)->age }}</td>
                <td>Beneficiary (Self)</td>
            </tr>
            <tr><td>&nbsp;</td><td></td><td></td></tr>
            <tr><td>&nbsp;</td><td></td><td></td></tr>
        </tbody>
    </table>

    <div class="certify-text">
        The above-named client has been found eligible for financial assistance from <strong>Assistance to Individuals in Crisis Situation (AICS)</strong> program. Based on the assessment conducted by the undersigned social worker, it is strongly recommended that the client/beneficiary be extended financial assistance to defray the <span class="details-line" style="min-width: 100px;">{{ $application->program }}</span> expenses in the amount of <strong>Php <span class="details-line" style="min-width: 80px;">{{ number_format($application->amount_released, 2) }}</span></strong>.
    </div>

    <div class="certify-text">
        It is further certified that the client is in crisis situation, in need of financial assistance and incapable to cover the aforementioned expenses due to financial constraint.
    </div>

    <p style="text-align: center; margin: 15px 0;">
        Issued this <span class="details-line" style="min-width: 40px;">{{ date('jS') }}</span> day of <span class="details-line" style="min-width: 100px;">{{ date('F, Y') }}</span> at Social Services Unit – City Social Welfare and Development Office, Inzo Arnaldo Village, Roxas City.
    </p>

    <table class="signatures">
        <tr>
            <td>
                Assessed by:<br><br>
                <div class="signatory-name">{{ strtoupper($signatories['assessed_by'] ?? 'BIVIEN B. DELA CRUZ, RSW') }}</div>
                <div class="sig-line"></div>
                <div class="role">Social Welfare Officer I</div>
            </td>
            <td>
                Approved by:<br><br>
                <div class="signatory-name">{{ strtoupper($signatories['approved_by'] ?? 'PERSEUS L. CORDOVA') }}</div>
                <div class="sig-line"></div>
                <div class="role">City Social Welfare and Development Officer</div>
            </td>
        </tr>
    </table>

    <div class="declaration">
        "I declare under pain of criminal prosecution that all the information provided herewith are TRUE, CORRECT, VALID and COMPLETE pursuant to existing laws, rules, and regulations of the Republic of the Philippines. I authorize the Agency Head/Authorized Representatives to verify and validate the contents stated herein."
    </div>

    <div style="text-align: center; width: 220px; margin: 15px auto 0;">
        <div class="sig-line" style="margin-top: 5px;"></div>
        <div style="font-size: 8pt; font-weight: bold;">Signature of Beneficiary</div>
    </div>

    <div class="receipt-section">
        <div class="receipt-title">ACKNOWLEDGEMENT RECEIPT</div>

        <div style="text-align: right; font-size: 9pt; margin-bottom: 5px;">
            NO. <strong>{{ str_pad($application->id, 6, '0', STR_PAD_LEFT) }}</strong>
        </div>

        <div class="certify-text" style="text-indent: 0;">
            I, <span class="details-line" style="min-width: 250px;">{{ strtoupper($application->first_name . ' ' . $application->last_name) }}</span>, hereby acknowledge the receipt of cash assistance in the amount of <strong>Php <span class="details-line" style="min-width: 80px;">{{ number_format($application->amount_released, 2) }}</span></strong> from the Roxas City Government – Assistance to Individuals in Crisis Situation (AICS) program.
        </div>

        <div class="certify-text" style="text-indent: 0;">
            This assistance was provided as support for <span class="details-line" style="min-width: 150px;">{{ $application->program }}</span> expenses. I confirm that I have received the said amount in full and understand that it is provided without any obligation for repayment.
        </div>

        <table class="signatures" style="margin-top: 20px;">
            <tr>
                <td>
                    Received by:<br><br>
                    <div class="sig-line"></div>
                    <div class="role">Client / Beneficiary</div>
                </td>
                <td>
                    Received from:<br><br>
                    <div class="sig-line"></div>
                    <div class="role">Special Disbursing Officer (SDO)</div>
                </td>
            </tr>
        </table>

        <div style="margin-top: 5px; font-size: 9pt; margin-left: 15px;">Date: <span class="details-line" style="min-width: 120px;">{{ date('F d, Y') }}</span></div>
    </div>

</body>
</html>
