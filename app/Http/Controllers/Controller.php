<?php

namespace App\Http\Controllers;

abstract class Controller
{
    /**
     * Helper function to log user activity.
     * Call this from any controller: $this->logActivity('Action Name', 'Details');
     */
    protected function logActivity($action, $details = null)
    {
        // Check if the AuditLog model exists before trying to create a log
        if (class_exists(\App\Models\AuditLog::class)) {
            \App\Models\AuditLog::create([
                'user_id' => auth()->id(),
                'action' => $action,
                'details' => $details,
                'ip_address' => request()->ip(),
            ]);
        }
    }
}
