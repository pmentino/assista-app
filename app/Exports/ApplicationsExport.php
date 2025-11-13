<?php

namespace App\Exports;

use App\Models\Application;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ApplicationsExport implements FromQuery, WithHeadings, WithMapping
{
    protected $filters;

    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    public function query()
    {   

        $query = Application::with('user');


        if (!empty($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }

        if (!empty($this->filters['program'])) {
            $query->where('program', $this->filters['program']);
        }

        return $query;
    }

    public function headings(): array
    {
        return [
            'ID', 'Applicant Name', 'Email', 'Contact Number',
            'Program', 'Status', 'Date Submitted',
        ];
    }

    public function map($application): array
    {
        return [
            $application->id,
            $application->user->name,
            $application->email,
            $application->contact_number,
            $application->program,
            $application->status,
            $application->created_at->format('Y-m-d'),
        ];
    }
}
