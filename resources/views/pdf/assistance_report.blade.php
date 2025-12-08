<!DOCTYPE html>
<html>
<head>
    <title>AICS Assistance Report</title>
    <style>
        body { font-family: 'Times New Roman', serif; font-size: 10px; }

        /* Official Header */
        .header { text-align: center; margin-bottom: 20px; }
        .header h4 { margin: 0; font-weight: normal; }
        .header h3 { margin: 2px 0; font-weight: bold; }
        .header h2 { margin: 5px 0; font-weight: bold; text-decoration: underline; }

        /* Meta Info (Date, etc.) */
        .meta-info { width: 100%; margin-bottom: 15px; font-size: 11px; }
        .meta-info td { padding: 2px; }

        /* The Main Data Table */
        table.data-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #000;
        }
        table.data-table th {
            border: 1px solid #000;
            padding: 8px;
            background-color: #f2f2f2;
            text-transform: uppercase;
            font-size: 9px;
        }
        table.data-table td {
            border: 1px solid #000;
            padding: 5px;
            vertical-align: top;
        }

        /* Totals Row */
        .total-row td { font-weight: bold; background-color: #f9f9f9; }

        /* Signatories */
        .signatories { width: 100%; margin-top: 50px; page-break-inside: avoid; }
        .signatories td { width: 33%; vertical-align: top; padding: 0 20px; }
        .sig-line { margin-top: 30px; border-top: 1px solid #000; width: 90%; }
        .sig-name { font-weight: bold; margin-top: 5px; text-transform: uppercase; }
        .sig-role { font-style: italic; font-size: 9px; }

        /* Footer */
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            text-align: center;
            font-size: 8px;
            font-style: italic;
            color: #555;
            border-top: 1px solid #ccc;
            padding-top: 5px;
        }
    </style>
</head>
<body>

    <div class="header">
        <h4>Republic of the Philippines</h4>
        <h4>Province of Capiz</h4>
        <h3>CITY OF ROXAS</h3>
        <h4>Office of the City Social Welfare and Development Officer</h4>
        <br>
        <h2>REPORT OF ASSISTANCE RELEASED (AICS)</h2>
    </div>

    <table class="meta-info">
        <tr>
            <td width="15%"><strong>Period Covered:</strong></td>
            <td>{{ date('F 1, Y') }} - {{ date('F t, Y') }}</td> <td width="15%" align="right"><strong>Date Printed:</strong></td>
            <td width="15%" align="right">{{ date('F d, Y h:i A') }}</td>
        </tr>
        <tr>
            <td><strong>Program:</strong></td>
            <td>Assistance to Individuals in Crisis Situation (AICS)</td>
            <td align="right"><strong>Printed By:</strong></td>
            <td align="right">{{ Auth::user()->name ?? 'Admin' }}</td>
        </tr>
    </table>

    <table class="data-table">
        <thead>
            <tr>
                <th width="5%">No.</th>
                <th width="10%">Date Released</th>
                <th width="20%">Beneficiary Name</th>
                <th width="15%">Barangay</th>
                <th width="20%">Type of Assistance</th>
                <th width="15%">Status</th>
                <th width="15%" align="right">Amount (PHP)</th>
            </tr>
        </thead>
        <tbody>
            @php $grandTotal = 0; @endphp
            @foreach($applications as $index => $app)
                @php $grandTotal += $app->amount_released; @endphp
                <tr>
                    <td align="center">{{ $index + 1 }}</td>
                    <td>{{ \Carbon\Carbon::parse($app->updated_at)->format('m/d/Y') }}</td>
                    <td style="text-transform: uppercase;">{{ $app->last_name }}, {{ $app->first_name }}</td>
                    <td>{{ $app->barangay }}</td>
                    <td>{{ $app->program }}</td>
                    <td align="center">{{ $app->status }}</td>
                    <td align="right">{{ number_format($app->amount_released, 2) }}</td>
                </tr>
            @endforeach

            <tr class="total-row">
                <td colspan="6" align="right">GRAND TOTAL RELEASED:</td>
                <td align="right">{{ number_format($grandTotal, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <div style="margin-top: 20px; font-size: 11px;">
        <strong>Summary:</strong> A total of <strong>{{ count($applications) }}</strong> beneficiaries were served for this period with a total allocation of <strong>PHP {{ number_format($grandTotal, 2) }}</strong>.
    </div>

    <table class="signatories">
        <tr>
            <td>
                Prepared by:
                <br><br>
                <div class="sig-name">{{ strtoupper(Auth::user()->name ?? 'STAFF NAME') }}</div>
                <div class="sig-line"></div>
                <div class="sig-role">Admin / Social Welfare Staff</div>
            </td>
            <td>
                Reviewed by:
                <br><br>
                <div class="sig-name">BIVIEN B. DELA CRUZ, RSW</div>
                <div class="sig-line"></div>
                <div class="sig-role">Social Welfare Officer I</div>
            </td>
            <td>
                Approved by:
                <br><br>
                <div class="sig-name">PERSEUS L. CORDOVA</div>
                <div class="sig-line"></div>
                <div class="sig-role">CSWD Officer</div>
            </td>
        </tr>
    </table>

    <div class="footer">
        System Generated Report | Assista-App v1.0 | This document is for official use only.
    </div>

</body>
</html>
