<!DOCTYPE html>
<html>
<head>
    <title>Certificate of Eligibility</title>
    <style>
        body { font-family: 'Times New Roman', serif; font-size: 12px; margin: 0; padding: 20px; }

        /* Header Layout */
        .header-container { width: 100%; text-align: center; margin-bottom: 20px; position: relative; }
        .logo-left { position: absolute; left: 0; top: 0; width: 80px; }
        .logo-right { position: absolute; right: 0; top: 0; width: 80px; }
        .header-text h4 { margin: 0; font-weight: normal; font-size: 12px; }
        .header-text h3 { margin: 2px 0; font-weight: bold; font-size: 14px; }
        .header-text p { margin: 0; font-size: 10px; font-style: italic; }

        /* Title */
        .title { text-align: center; font-weight: bold; text-decoration: underline; font-size: 16px; margin: 20px 0; }

        /* Checkboxes Section */
        .checkbox-section { width: 100%; margin-bottom: 15px; font-size: 11px; }
        .checkbox-section td { vertical-align: top; }
        .check-box { display: inline-block; width: 12px; height: 12px; border: 1px solid #000; margin-right: 5px; }
        .checked { background-color: #000; } /* Simple fill for checked */

        /* Main Body */
        .certify-text { text-align: justify; line-height: 1.5; margin-bottom: 10px; text-indent: 30px; }
        .details-line { border-bottom: 1px solid #000; display: inline-block; width: 200px; text-align: center; font-weight: bold; }

        /* Family Table */
        .family-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .family-table th { border-bottom: 1px solid #000; padding: 5px; text-align: center; font-weight: bold; }
        .family-table td { border-bottom: 1px solid #ccc; padding: 5px; }

        /* Signatures */
        .signatures { width: 100%; margin-top: 40px; }
        .signatures td { width: 50%; vertical-align: top; padding: 0 10px; }
        .sig-line { border-top: 1px solid #000; margin-top: 30px; width: 90%; }
        .role { font-size: 10px; font-style: italic; }

        /* Footer Declaration */
        .declaration { font-size: 9px; font-style: italic; text-align: justify; margin-top: 30px; border-top: 1px dotted #ccc; padding-top: 10px; }

        /* QR Code for Validation */
        .qr-code { position: absolute; bottom: 100px; right: 0; opacity: 0.8; }
    </style>
</head>
<body>

    <div class="header-container">
        <div class="header-text">
            <h4>Republic of the Philippines</h4>
            <h3>CITY OF ROXAS</h3>
            <h4>Province of Capiz</h4>
            <h3>Office of the City Social Welfare and Development Officer</h3>
            <p>Inzo Arnaldo Village, Roxas City, 5800 | Tel: (036) 52026-83</p>
        </div>
    </div>

    <div class="title">CERTIFICATE OF ELIGIBILITY</div>

    <table class="checkbox-section">
        <tr>
            <td width="30%"><strong>Source of Fund:</strong></td>
            <td width="35%"><strong>Clientele Category:</strong></td>
            <td width="35%"></td>
        </tr>
        <tr>
            <td><span class="check-box checked"></span> CSWDO (AICS)</td>
            <td><span class="check-box"></span> Family Head/Needy Adult</td>
            <td><span class="check-box"></span> PWD</td>
        </tr>
        <tr>
            <td><span class="check-box"></span> CMO - GAD</td>
            <td><span class="check-box"></span> Out of School Youth</td>
            <td><span class="check-box"></span> Senior Citizen</td>
        </tr>
        <tr>
            <td><span class="check-box"></span> BLGU/SK</td>
            <td><span class="check-box"></span> Solo Parent</td>
            <td><span class="check-box"></span> Student</td>
        </tr>
    </table>

    <p>This is to certify that <span class="details-line" style="width: 250px;">{{ strtoupper($application->first_name . ' ' . $application->last_name) }}</span> residing at barangay <span class="details-line">{{ $application->barangay }}</span>, Roxas City with the following family members:</p>

    <table class="family-table">
        <thead>
            <tr>
                <th>NAME</th>
                <th>AGE</th>
                <th>RELATIONSHIP</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>(Self)</td>
                <td>{{ \Carbon\Carbon::parse($application->birth_date)->age }}</td>
                <td>Beneficiary</td>
            </tr>
            <tr><td>&nbsp;</td><td></td><td></td></tr>
            <tr><td>&nbsp;</td><td></td><td></td></tr>
        </tbody>
    </table>

    <div class="certify-text">
        The above-named client has been found eligible for financial assistance from <strong>Assistance to Individuals in Crisis Situation (AICS)</strong> program. Based on the assessment conducted by the undersigned social worker, it is strongly recommended that the client/beneficiary be extended financial assistance to defray the expenses in the amount of <strong>Php {{ number_format($application->amount_released, 2) }}</strong>.
    </div>

    <div class="certify-text">
        It is further certified that the client is in crisis situation, in need of financial assistance and incapable to cover the aforementioned expenses due to financial constraint.
    </div>

    <p style="margin-top: 20px;">
        Issued this <span class="details-line" style="width: 50px;">{{ date('jS') }}</span> day of <span class="details-line" style="width: 100px;">{{ date('F, Y') }}</span> at City Social Welfare and Development Office, Inzo Arnaldo Village, Roxas City.
    </p>

    <table class="signatures">
        <tr>
            <td>
                Assessed by:<br><br><br>
                <strong>BIVIEN B. DELA CRUZ, RSW</strong>
                <div class="sig-line"></div>
                <div class="role">Social Welfare Officer I</div>
            </td>
            <td>
                Approved by:<br><br><br>
                <strong>PERSEUS L. CORDOVA</strong>
                <div class="sig-line"></div>
                <div class="role">City Social Welfare and Development Officer</div>
            </td>
        </tr>
    </table>

    <div class="qr-code">
        <img src="data:image/svg+xml;base64, {!! base64_encode(QrCode::format('svg')->size(80)->generate($application->id . '-' . $application->first_name)) !!} ">
    </div>

    <div class="declaration">
        "I declare under pain of criminal prosecution that all the information provided herewith are TRUE, CORRECT, VALID, and COMPLETE pursuant to existing laws, rules, and regulations of the Republic of the Philippines. I authorize the Agency Head/Authorized Representatives to verify and validate the contents stated herein."
        <br><br>
        <div style="text-align: center; width: 300px; margin: 20px auto;">
            <div class="sig-line"></div>
            <strong>Name and signature of the client/beneficiary</strong>
        </div>
    </div>

</body>
</html>
