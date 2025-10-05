<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AidRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AidRequestController extends Controller
{
    /**
     * Display a listing of the aid requests.
     */
    public function index()
    {
        // Fetch all requests and include the 'beneficiary' information for each one.
        // This is more efficient than fetching them separately.
        $aidRequests = AidRequest::with('beneficiary')->latest()->get();

        return Inertia::render('Admin/AidRequests/Index', [
            'aidRequests' => $aidRequests,
        ]);
    }
}
