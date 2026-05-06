<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\Vehicle;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $vehicleCounts = Vehicle::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $inquiryCounts = Inquiry::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_vehicles'  => $vehicleCounts->sum(),
                'in_transit'      => $vehicleCounts->get('In Transit', 0),
                'at_port'         => $vehicleCounts->get('At Port', 0),
                'available'       => $vehicleCounts->get('Available', 0),
                'sold'            => $vehicleCounts->get('Sold', 0),
                'total_inquiries' => $inquiryCounts->sum(),
                'new_inquiries'   => $inquiryCounts->get('new', 0),
            ],
            'recentInquiries' => Inquiry::with('vehicle')
                ->latest()
                ->limit(5)
                ->get(),
            'recentVehicles' => Vehicle::latest()->limit(5)->get(),
        ]);
    }
}
