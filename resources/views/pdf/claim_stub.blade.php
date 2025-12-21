<!DOCTYPE html>
<html>
<head>
    <title>Certificate of Eligibility - {{ $application->last_name }}</title>
    <style>
        /* SET PAPER SIZE TO LONG BOND PAPER (8.5 x 13 inches) */
        @page { size: 21.59cm 33.02cm; margin: 1.5cm 1.5cm; }

        body { font-family: 'Times New Roman', serif; font-size: 11pt; margin: 0; padding: 0; line-height: 1.2; }

        /* Header Layout */
        .header-container { width: 100%; text-align: center; margin-bottom: 10px; position: relative; }

        .header-text h4 { margin: 0; font-weight: normal; font-size: 10pt; font-family: 'Old English Text MT', serif; }
        .header-text h3 { margin: 2px 0; font-weight: bold; font-size: 11pt; }
        .header-text p { margin: 0; font-size: 8pt; }

        /* Title */
        .title { text-align: center; font-weight: bold; text-decoration: underline; font-size: 13pt; margin: 10px 0; text-transform: uppercase; }

        /* Checkboxes Section */
        .checkbox-section { width: 100%; margin-bottom: 5px; font-size: 9pt; }
        .checkbox-section td { vertical-align: top; padding-bottom: 2px; }
        .check-box { display: inline-block; width: 9px; height: 9px; border: 1px solid #000; margin-right: 4px; }
        .checked { background-color: #000; }

        /* Main Body */
        .certify-text { text-align: justify; margin-bottom: 8px; text-indent: 30px; }

        /* FIXED: Added vertical-align to stop floating text */
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
        .family-table th { border-bottom: 1px solid #000; padding: 2px; text-align: center; font-weight: bold; }
        .family-table td { border-bottom: 1px solid #ccc; padding: 3px; }

        /* Signatures */
        .signatures { width: 100%; margin-top: 20px; margin-bottom: 10px; }
        .signatures td { width: 50%; vertical-align: top; padding: 0 10px; }
        .sig-line { border-top: 1px solid #000; margin-top: 25px; width: 90%; }
        .role { font-size: 8pt; font-style: italic; }

        /* Acknowledgement Receipt (Bottom Part) */
        .receipt-section { margin-top: 20px; border-top: 2px dashed #000; padding-top: 15px; }
        .receipt-title { text-align: center; font-weight: bold; font-size: 12pt; margin-bottom: 10px; text-transform: uppercase; }

        /* Declaration Text */
        .declaration { font-size: 7pt; font-style: italic; text-align: justify; margin-top: 10px; color: #555; }
    </style>
</head>
<body>

    <div class="header-container">
        <div class="header-text">
            <h4>Republic of the Philippines</h4>
            <h3>CITY OF ROXAS</h3>
            <h4>Province of Capiz</h4>
            <h3>Office of the City Social Welfare and Development Officer</h3>
            <p>Inzo Arnaldo Village, Roxas City | Tel: (036) 52026-83</p>
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

    <div class="certify-text">
        This is to certify that <span class="details-line" style="min-width: 200px;">{{ strtoupper($application->first_name . ' ' . $application->last_name) }}</span> residing at barangay <span class="details-line" style="min-width: 100px;">{{ $application->barangay }}</span>, Roxas City with the following family members:
    </div>

    <table class="family-table">
        <thead>
            <tr>
                <th width="40%">NAME</th>
                <th width="20%">AGE</th>
                <th width="40%">RELATIONSHIP</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="text-align: center;">{{ strtoupper($application->first_name . ' ' . $application->last_name) }}</td>
                <td style="text-align: center;">{{ \Carbon\Carbon::parse($application->birth_date)->age }}</td>
                <td style="text-align: center;">Beneficiary (Self)</td>
            </tr>
            <tr><td>&nbsp;</td><td></td><td></td></tr>
            <tr><td>&nbsp;</td><td></td><td></td></tr>
        </tbody>
    </table>

    <div class="certify-text">
        The above-named client has been found eligible for financial assistance from <strong>Assistance to Individuals in Crisis Situation (AICS)</strong> program. Based on the assessment, it is strongly recommended that the client be extended financial assistance in the amount of <strong>Php <span class="details-line" style="min-width: 80px;">{{ number_format($application->amount_released, 2) }}</span></strong>.
    </div>

    <div class="certify-text">
        It is further certified that the client is in crisis situation and incapable to cover the expenses due to financial constraint.
    </div>

    <p style="margin: 5px 0;">
        Issued this <span class="details-line" style="min-width: 40px;">{{ date('jS') }}</span> day of <span class="details-line" style="min-width: 80px;">{{ date('F, Y') }}</span> at CSWDO, Roxas City.
    </p>

    <table class="signatures">
        <tr>
            <td>
                Assessed by:<br><br>
                <strong>BIVIEN B. DELA CRUZ, RSW</strong>
                <div class="sig-line"></div>
                <div class="role">Social Welfare Officer I</div>
            </td>
            <td>
                Approved by:<br><br>
                <strong>PERSEUS L. CORDOVA</strong>
                <div class="sig-line"></div>
                <div class="role">City Social Welfare and Development Officer</div>
            </td>
        </tr>
    </table>

    <div class="declaration">
        "I declare under pain of criminal prosecution that all information provided herewith are TRUE and CORRECT. I authorize the Agency Head to verify stated contents."
    </div>

    <div style="text-align: center; width: 200px; margin: 15px auto 0;">
        <div class="sig-line" style="margin-top: 5px;"></div>
        <div style="font-size: 7pt; font-weight: bold;">Signature of Beneficiary</div>
    </div>

    <div class="receipt-section">
        <div class="receipt-title">ACKNOWLEDGEMENT RECEIPT</div>

        <div style="text-align: right; font-size: 9pt; margin-bottom: 5px;">
            NO. <strong>{{ str_pad($application->id, 6, '0', STR_PAD_LEFT) }}</strong>
        </div>

        <div class="certify-text" style="text-indent: 0;">
            I, <span class="details-line" style="min-width: 200px;">{{ strtoupper($application->first_name . ' ' . $application->last_name) }}</span>, acknowledge receipt of cash assistance amounting to Php <span class="details-line" style="min-width: 80px;">{{ number_format($application->amount_released, 2) }}</span> from the Roxas City Government (AICS).
        </div>

        <div class="certify-text" style="text-indent: 0;">
            This assistance is for <span class="details-line" style="min-width: 120px;">{{ $application->program }}</span> expenses. I confirm receipt in full without obligation for repayment.
        </div>

        <table class="signatures" style="margin-top: 20px;">
            <tr>
                <td>
                    Received by:<br><br>
                    <div class="sig-line"></div>
                    <div style="text-align: center; font-size: 8pt;">Client / Beneficiary</div>
                </td>
                <td>
                    Received from:<br><br>
                    <div class="sig-line"></div>
                    <div style="text-align: center; font-size: 8pt;">Special Disbursing Officer (SDO)</div>
                </td>
            </tr>
        </table>

        <div style="margin-top: 5px; font-size: 8pt;">Date: {{ date('F d, Y') }}</div>
    </div>

</body>
</html>
