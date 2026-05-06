<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    public function index(Request $request): Response
    {
        $vehicles = Vehicle::query()
            ->when($request->search, fn ($q, $s) => $q->where(fn ($inner) => $inner
                ->where('make', 'like', "%{$s}%")
                ->orWhere('model', 'like', "%{$s}%")
            ))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Vehicles/Index', [
            'vehicles' => $vehicles,
            'filters'  => $request->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Vehicles/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        Vehicle::create($data);

        return redirect()->route('admin.vehicles.index')
            ->with('success', 'Vehicle created successfully.');
    }

    public function edit(Vehicle $vehicle): Response
    {
        return Inertia::render('Admin/Vehicles/Edit', [
            'vehicle' => $vehicle,
        ]);
    }

    public function update(Request $request, Vehicle $vehicle): RedirectResponse
    {
        $data = $this->validated($request, $vehicle->id);
        $vehicle->update($data);

        return redirect()->route('admin.vehicles.index')
            ->with('success', 'Vehicle updated successfully.');
    }

    public function destroy(Vehicle $vehicle): RedirectResponse
    {
        $vehicle->delete();

        return redirect()->route('admin.vehicles.index')
            ->with('success', 'Vehicle deleted.');
    }

    private function validated(Request $request, ?int $vehicleId = null): array
    {
        $vinRule = $vehicleId
            ? "required|string|size:17|unique:vehicles,vin,{$vehicleId}"
            : 'required|string|size:17|unique:vehicles,vin';

        $lotRule = $vehicleId
            ? "required|string|max:50|unique:vehicles,lot_number,{$vehicleId}"
            : 'required|string|max:50|unique:vehicles,lot_number';

        $data = $request->validate([
            'year'             => 'required|integer|min:1990|max:' . (date('Y') + 1),
            'make'             => 'required|string|max:100',
            'model'            => 'required|string|max:200',
            'trim'             => 'nullable|string|max:100',
            'price'            => 'required|numeric|min:0',
            'mileage'          => 'required|integer|min:0',
            'condition'        => 'required|in:Excellent,Good,Fair,Poor',
            'status'           => 'required|in:In Transit,At Port,Available,Sold',
            'lot_number'       => $lotRule,
            'location'         => 'nullable|string|max:200',
            'engine'           => 'nullable|string|max:200',
            'fuel_type'        => 'nullable|in:Gasoline,Diesel,Hybrid,Electric,Other',
            'transmission'     => 'nullable|in:Automatic,Manual,CVT,Other',
            'vin'              => $vinRule,
            'primary_damage'   => 'nullable|string|max:500',
            'secondary_damage' => 'nullable|string|max:500',
            'highlights'       => 'nullable|string',
            'images'           => 'nullable|string',
            'estimated_arrival'=> 'nullable|date' . ($vehicleId ? '' : '|after_or_equal:today'),
            'description'      => 'nullable|string|max:5000',
            'color'            => 'nullable|string|max:100',
            'is_featured'      => 'nullable|boolean',
        ]);

        // Convert newline-delimited strings to arrays
        if (isset($data['highlights']) && $data['highlights'] !== '') {
            $data['highlights'] = array_filter(array_map('trim', explode("\n", $data['highlights'])));
        } else {
            $data['highlights'] = null;
        }

        if (isset($data['images']) && $data['images'] !== '') {
            $urls = array_filter(array_map('trim', explode("\n", $data['images'])));
            $invalid = array_values(array_filter($urls, fn ($url) =>
                !preg_match('#^https?://#i', $url) || filter_var($url, FILTER_VALIDATE_URL) === false
            ));
            if (!empty($invalid)) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'images' => 'The following image URLs are invalid: ' . implode(', ', $invalid),
                ]);
            }
            $data['images'] = array_values($urls);
        } else {
            $data['images'] = null;
        }

        return $data;
    }
}
