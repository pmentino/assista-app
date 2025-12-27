<!DOCTYPE html>
<html>
<head>
    <title>AICS Report</title>
    <style>
        body { font-family: sans-serif; font-size: 10pt; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h3, .header h4 { margin: 2px; }
        .meta-table { width: 100%; margin-bottom: 20px; font-size: 9pt; }
        .meta-table td { padding: 2px; }

        /* Main Table Styling */
        table.main { width: 100%; border-collapse: collapse; }
        table.main th, table.main td { border: 1px solid #000; padding: 6px; text-align: left; }
        table.main th { background-color: #f0f0f0; text-align: center; font-weight: bold; }

        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .footer { margin-top: 40px; width: 100%; }
        .footer td { vertical-align: top; padding: 10px; }
        .signature-line { border-top: 1px solid #000; display: inline-block; width: 80%; margin-top: 30px; }
    </style>
</head>
<body>

    <div class="header">
        <h4>Republic of the Philippines</h4>
        <h4>Province of Capiz</h4>
        <h3>CITY OF ROXAS</h3>
        <h4>Office of the City Social Welfare and Development Officer</h4>
        <h3>REPORT OF ASSISTANCE RELEASED (AICS)</h3>
    </div>

    <table class="meta-table">
        <tr>
            <td width="15%"><strong>Period Covered:</strong></td>
            <td>
                {{ isset($filters['start_date']) ? date('F j, Y', strtotime($filters['start_date'])) : 'Start' }} -
                {{ isset($filters['end_date']) ? date('F j, Y', strtotime($filters['end_date'])) : 'Present' }}
            </td>
            <td width="15%"><strong>Date Printed:</strong></td>
            <td>{{ date('F j, Y h:i A') }}</td>
        </tr>
        <tr>
            <td><strong>Program:</strong></td>
            <td>
                {{ $filters['program'] ?? 'All Programs' }}
                (Status: {{ $filters['status'] ?? 'All' }})
            </td>
            <td><strong>Printed By:</strong></td>
            <td>{{ auth()->user()->name ?? 'Admin' }}</td>
        </tr>
    </table>

    <table class="main">
        <thead>
            <tr>
                <th width="5%">NO.</th>
                <th width="15%">DATE & TIME<br>APPROVED</th>
                <th width="25%">BENEFICIARY NAME</th>
                <th width="15%">BARANGAY</th>
                <th width="20%">TYPE OF ASSISTANCE</th>
                <th width="10%">STATUS</th>
                <th width="10%">AMOUNT</th>
            </tr>
        </thead>
        <tbody>
            @foreach($applications as $index => $app)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td class="text-center">
                    @if($app->approved_date)
                        {{ \Carbon\Carbon::parse($app->approved_date)->format('m/d/Y') }}<br>
                        <small>{{ \Carbon\Carbon::parse($app->approved_date)->format('h:i A') }}</small>
                    @else
                        {{ $app->created_at->format('m/d/Y') }}
                    @endif
                </td>
                <td>
                    <span style="text-transform: uppercase;">
                        {{ $app->last_name }}, {{ $app->first_name }}
                    </span>
                </td>
                <td>{{ $app->barangay }}</td>
                <td>{{ $app->program }}</td>
                <td class="text-center">{{ $app->status }}</td>
                <td class="text-right">
                    {{ $app->amount_released > 0 ? number_format($app->amount_released, 2) : '-' }}
                </td>
            </tr>
            @endforeach

            <tr>
                <td colspan="6" class="text-right"><strong>GRAND TOTAL RELEASED:</strong></td>
                <td class="text-right"><strong>{{ number_format($applications->sum('amount_released'), 2) }}</strong></td>
            </tr>
        </tbody>
    </table>

    <div style="margin-top: 15px; font-size: 9pt;">
        Summary: A total of <strong>{{ $applications->count() }}</strong> beneficiaries were served for this period with a total allocation of <strong>PHP {{ number_format($applications->sum('amount_released'), 2) }}</strong>.
    </div>

    <table class="footer">
    <tr>
        <td width="33%">
            Prepared by:<br>
            <div class="text-center">
                <br><br>
                {{-- Logged in Admin Name --}}
                <span style="font-weight: bold; text-transform: uppercase;">{{ strtoupper($signatories['prepared_by']) }}</span><br>
                <div class="signature-line"></div>
                Admin / Staff
            </div>
        </td>
        <td width="33%">
            Reviewed by:<br>
            <div class="text-center">
                <br><br>
                {{-- Dynamic Social Worker Name --}}
                <span style="font-weight: bold; text-transform: uppercase;">{{ strtoupper($signatories['reviewed_by']) }}</span><br>
                <div class="signature-line"></div>
                Social Welfare Officer
            </div>
        </td>
        <td width="33%">
            Approved by:<br>
            <div class="text-center">
                <br><br>
                {{-- Dynamic CSWDO Head Name --}}
                <span style="font-weight: bold; text-transform: uppercase;">{{ strtoupper($signatories['approved_by']) }}</span><br>
                <div class="signature-line"></div>
                CSWD Officer
            </div>
        </td>
    </tr>
</table>

    <div style="position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 8pt; color: #555;">
        System Generated Report | Assista-App v1.0 | This document is for official use only.
    </div>

</body>
</html>
