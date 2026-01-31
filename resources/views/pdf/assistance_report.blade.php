<!DOCTYPE html>
<html>
<head>
    <title>AICS Report</title>
    <style>
        body { font-family: 'Times New Roman', serif; font-size: 10pt; color: #000; }

        /* --- FIX 1: Special Font for Peso Sign to prevent '?' error --- */
        .peso { font-family: "DejaVu Sans", sans-serif; }

        /* Official Header Layout */
        .header-table { width: 100%; margin-bottom: 20px; border-collapse: collapse; }
        .header-table td { vertical-align: middle; text-align: center; }
        .logo-col { width: 15%; }
        .text-col { width: 70%; }
        .logo-img { width: 80px; height: auto; object-fit: contain; }

        .header-text h4 { margin: 0; font-weight: normal; font-size: 10pt; font-family: 'Old English Text MT', serif; }
        .header-text h3 { margin: 2px 0; font-weight: bold; font-size: 12pt; text-transform: uppercase; }
        .header-text h5 { margin: 0; font-weight: bold; font-size: 11pt; }
        .report-title { margin-top: 10px; font-weight: bold; font-size: 13pt; text-decoration: underline; text-transform: uppercase; }

        /* Meta Data */
        .meta-table { width: 100%; margin-bottom: 15px; font-size: 9pt; border-collapse: collapse; }
        .meta-table td { padding: 3px; }

        /* Main Table Styling */
        table.main { width: 100%; border-collapse: collapse; margin-top: 10px; }
        table.main th, table.main td { border: 1px solid #000; padding: 5px; text-align: left; font-size: 9pt; }
        table.main th { background-color: #e0e0e0; text-align: center; font-weight: bold; text-transform: uppercase; }

        .text-right { text-align: right; }
        .text-center { text-align: center; }

        /* Footer / Signatures */
        .footer { margin-top: 40px; width: 100%; }
        .footer td { vertical-align: top; padding: 10px; text-align: center; }
        .signature-line { border-top: 1px solid #000; display: inline-block; width: 85%; margin-top: 40px; }
        .signatory-name { font-weight: bold; text-transform: uppercase; font-size: 10pt; }
        .signatory-role { font-size: 9pt; font-style: italic; }

        /* Page Numbering */
        @page { margin: 1cm 1cm; }
        .page-number:before { content: counter(page); }
    </style>
</head>
<body>

    <table class="header-table">
        <tr>
            <td class="logo-col text-right">
                {{-- Ensure these images exist in public/images folder --}}
                <img src="{{ public_path('images/cswdo-logo.webp') }}" class="logo-img" alt="CSWDO Logo">
            </td>
            <td class="text-col header-text">
                <h4>Republic of the Philippines</h4>
                <h4>Province of Capiz</h4>
                <h3>CITY OF ROXAS</h3>
                <h5>Office of the City Social Welfare and Development Officer</h5>
                <div class="report-title">REPORT OF ASSISTANCE RELEASED (AICS)</div>
            </td>
            <td class="logo-col text-left">
                <img src="{{ public_path('images/roxas-seal.webp') }}" class="logo-img" alt="Roxas Seal">
            </td>
        </tr>
    </table>

    <table class="meta-table">
        <tr>
            <td width="15%"><strong>Period Covered:</strong></td>
            <td width="35%">
                {{ isset($filters['start_date']) ? date('F j, Y', strtotime($filters['start_date'])) : 'Start' }} -
                {{ isset($filters['end_date']) ? date('F j, Y', strtotime($filters['end_date'])) : 'Present' }}
            </td>
            <td width="15%"><strong>Date Printed:</strong></td>
            <td width="35%">{{ date('F j, Y h:i A') }}</td>
        </tr>
        <tr>
            <td><strong>Program:</strong></td>
            <td>
                {{ $filters['program'] ?? 'All Programs' }}
                @if(isset($filters['status']) && $filters['status'] !== 'All')
                    (Status: {{ $filters['status'] }})
                @endif
            </td>
            <td><strong>Printed By:</strong></td>
            <td>{{ auth()->user()->name ?? 'System Admin' }}</td>
        </tr>
    </table>

    <table class="main">
        <thead>
            <tr>
                <th width="5%">NO.</th>
                <th width="18%">DATE & TIME APPROVED</th>
                <th width="22%">BENEFICIARY NAME</th>
                <th width="15%">BARANGAY</th>
                <th width="20%">TYPE OF ASSISTANCE</th>
                <th width="10%">STATUS</th>
                <th width="10%">AMOUNT</th>
            </tr>
        </thead>
        <tbody>
            @forelse($applications as $index => $app)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td class="text-center" style="font-size: 8pt;">
                    @if($app->approved_date)
                        {{ \Carbon\Carbon::parse($app->approved_date)->format('m/d/Y h:i A') }}
                    @else
                        {{ $app->updated_at->format('m/d/Y h:i A') }}
                    @endif
                </td>
                <td>
                    <span style="text-transform: uppercase;">
                        {{ $app->last_name }}, {{ $app->first_name }}
                    </span>
                </td>
                <td>{{ $app->barangay }}</td>
                <td>{{ $app->program }}</td>
                <td class="text-center" style="font-size: 8pt;">{{ strtoupper($app->status) }}</td>
                <td class="text-right">
                    {{-- FIX: Using the .peso class and HTML entity --}}
                    @if($app->amount_released > 0)
                        <span class="peso">&#8369;</span> {{ number_format($app->amount_released, 2) }}
                    @else
                        -
                    @endif
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="7" class="text-center" style="padding: 20px;">No records found for this period.</td>
            </tr>
            @endforelse

            <tr>
                <td colspan="6" class="text-right" style="background-color: #f9f9f9;"><strong>GRAND TOTAL:</strong></td>
                <td class="text-right" style="background-color: #f9f9f9;">
                    {{-- FIX: Using the .peso class and HTML entity --}}
                    <strong><span class="peso">&#8369;</span> {{ number_format($applications->sum('amount_released'), 2) }}</strong>
                </td>
            </tr>
        </tbody>
    </table>

    <div style="margin-top: 15px; font-size: 9pt;">
        <em>Summary: A total of <strong>{{ $applications->count() }}</strong> beneficiaries were served for this period.</em>
    </div>

    <table class="footer">
        <tr>
            <td width="33%">
                Prepared by:<br>
                <br>
                <span class="signatory-name">{{ strtoupper($signatories['prepared_by']) }}</span><br>
                <div class="signature-line"></div>
                <div class="signatory-role">Admin / Staff</div>
            </td>
            <td width="33%">
                Reviewed by:<br>
                <br>
                <span class="signatory-name">{{ strtoupper($signatories['reviewed_by']) }}</span><br>
                <div class="signature-line"></div>
                <div class="signatory-role">Social Welfare Officer</div>
            </td>
            <td width="33%">
                Noted by:<br>
                <br>
                <span class="signatory-name">{{ strtoupper($signatories['approved_by']) }}</span><br>
                <div class="signature-line"></div>
                <div class="signatory-role">CSWD Officer</div>
            </td>
        </tr>
    </table>

    <div style="position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 8pt; color: #555; border-top: 1px solid #ccc; padding-top: 5px;">
        System Generated Report | Assista-App | Page <span class="page-number"></span>
    </div>

</body>
</html>
