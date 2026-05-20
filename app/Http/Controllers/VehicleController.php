<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
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
            // Distinct-makes is a full-table scan; cache for 5 min so the inventory
            // page stays cheap as the catalog grows. Admin save flow doesn't bust this
            // proactively — a 5-min stale dropdown is acceptable.
            'makes'    => Cache::remember(
                'inventory.makes',
                300,
                fn () => Vehicle::query()->select('make')->distinct()->orderBy('make')->pluck('make'),
            ),
        ]);
    }

    public function show(string $locale, Vehicle $vehicle): Response
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
