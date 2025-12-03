<!DOCTYPE html>
<html>
<head>
    <title>AICS Report</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 18px; text-transform: uppercase; }
        .header p { margin: 2px; color: #555; }
        .meta { margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .stats { margin-bottom: 20px; }
        .stats span { margin-right: 15px; font-weight: bold; }
        .status-approved { color: green; font-weight: bold; }
        .status-rejected { color: red; font-weight: bold; }
        .status-pending { color: orange; font-weight: bold; }
    </style>
</head>
<body>

    <div class="header">
        <h1>Assistance to Individuals in Crisis Situation (AICS)</h1>
        <p>OFFICIAL GENERATED REPORT</p>
    </div>

    <div class="meta">
        <strong>Date Generated:</strong> {{ $date_generated }} <br>
        <strong>Filters Applied:</strong>
        Status: {{ $filters['status'] ?? 'All' }} |
        Program: {{ $filters['program'] ?? 'All' }} |
        Date Range: {{ $filters['start_date'] ?? 'Start' }} to {{ $filters['end_date'] ?? 'Now' }}
    </div>

    <div class="stats">
        <span>Total Records: {{ $stats['total'] }}</span>
        <span>Approved: {{ $stats['approved'] }}</span>
        <span>Rejected: {{ $stats['rejected'] }}</span>
    </div>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Applicant Name</th>
                <th>Program</th>
                <th>Status</th>
                <th>Date Submitted</th>
            </tr>
        </thead>
        <tbody>
            @foreach($applications as $app)
                <tr>
                    <td>{{ $app->id }}</td>
                    <td>{{ $app->first_name }} {{ $app->last_name }}</td>
                    <td>{{ $app->program }}</td>
                    <td>
                        <span class="status-{{ strtolower($app->status) }}">
                            {{ $app->status }}
                        </span>
                    </td>
                    <td>{{ $app->created_at->format('M d, Y') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>
