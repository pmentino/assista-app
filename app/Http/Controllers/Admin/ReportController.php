<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ApplicationsExport;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only('status', 'program');

        $applications = Application::with('user')
            ->when($request->input('status'), fn($query, $status) => $query->where('status', $status))
            ->when($request->input('program'), fn($query, $program) => $query->where('program', $program))
            ->latest()
            ->get();

        return Inertia::render('Admin/Reports/Index', [
            'applications' => $applications,
            'filters' => $filters,
        ]);
    }

    // This function now reads the filters from the request
    public function export(Request $request)
    {
        $filters = $request->only('status', 'program');

        return Excel::download(new ApplicationsExport($filters), 'applications.xlsx');
    }
}
