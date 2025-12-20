<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AuditLogController extends Controller
{
    public function index()
    {
        // Get all logs, sorted by newest first, with user details
        $logs = AuditLog::with('user:id,name')
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/AuditLogs/Index', [
            'logs' => $logs,
            'auth' => ['user' => Auth::user()]
        ]);
    }
}
