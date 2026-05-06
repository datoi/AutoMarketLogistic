<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only([
            'search', 'make', 'year_min', 'year_max',
            'price_min', 'price_max', 'condition', 'status',
            'fuel_type', 'transmission', 'sort',
        ]);

        $vehicles = Vehicle::filter($filters)
            ->sorted($filters['sort'] ?? null)
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Inventory', [
            'vehicles' => $vehicles,
            'filters'  => $filters,
            'makes'    => Vehicle::query()->select('make')->distinct()->orderBy('make')->pluck('make'),
        ]);
    }

    public function show(Vehicle $vehicle): Response
    {
        $related = Vehicle::where('make', $vehicle->make)
            ->where('id', '!=', $vehicle->id)
            ->where('status', '!=', 'Sold')
            ->limit(3)
            ->get();

        return Inertia::render('Vehicles/Show', [
            'vehicle' => $vehicle,
            'related' => $related,
        ]);
    }
}
