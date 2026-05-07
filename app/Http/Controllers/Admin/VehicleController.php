<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Services\CloudinaryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    public function __construct(private CloudinaryService $cloudinary) {}

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
        $data['images'] = $this->buildImageArray($request, []);

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

        $previousImages = $vehicle->images ?? [];
        $data['images'] = $this->buildImageArray($request, $previousImages);

        // Delete any images that were on the vehicle but are no longer in the kept-set.
        $removedUrls = array_diff($previousImages, $data['images']);
        foreach ($removedUrls as $url) {
            $this->cloudinary->destroyByUrl($url);
        }

        $vehicle->update($data);

        return redirect()->route('admin.vehicles.index')
            ->with('success', 'Vehicle updated successfully.');
    }

    public function destroy(Vehicle $vehicle): RedirectResponse
    {
        foreach ($vehicle->images ?? [] as $url) {
            $this->cloudinary->destroyByUrl($url);
        }

        $vehicle->delete();

        return redirect()->route('admin.vehicles.index')
            ->with('success', 'Vehicle deleted.');
    }

    /**
     * Combine kept existing image URLs with newly-uploaded files.
     * `$previousImages` is the source-of-truth list — clients can only keep URLs that already existed.
     */
    private function buildImageArray(Request $request, array $previousImages): ?array
    {
        $kept = array_values(array_intersect(
            $request->input('existing_images', []) ?: [],
            $previousImages
        ));

        $uploaded = [];
        foreach ((array) $request->file('new_files', []) as $file) {
            if ($file && $file->isValid()) {
                $uploaded[] = $this->cloudinary->upload($file);
            }
        }

        $combined = array_values(array_merge($kept, $uploaded));
        return $combined ?: null;
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
            'year'              => 'required|integer|min:1990|max:' . (date('Y') + 1),
            'make'              => 'required|string|max:100',
            'model'             => 'required|string|max:200',
            'trim'              => 'nullable|string|max:100',
            'price'             => 'required|numeric|min:0',
            'mileage'           => 'required|integer|min:0',
            'condition'         => 'required|in:Excellent,Good,Fair,Poor',
            'status'            => 'required|in:In Transit,At Port,Available,Sold',
            'lot_number'        => $lotRule,
            'location'          => 'nullable|string|max:200',
            'engine'            => 'nullable|string|max:200',
            'fuel_type'         => 'nullable|in:Gasoline,Diesel,Hybrid,Electric,Other',
            'transmission'      => 'nullable|in:Automatic,Manual,CVT,Other',
            'vin'               => $vinRule,
            'primary_damage'    => 'nullable|string|max:500',
            'secondary_damage'  => 'nullable|string|max:500',
            'highlights'        => 'nullable|string',
            'estimated_arrival' => 'nullable|date' . ($vehicleId ? '' : '|after_or_equal:today'),
            'description'       => 'nullable|string|max:5000',
            'color'             => 'nullable|string|max:100',
            'is_featured'       => 'nullable|boolean',

            // Images come in two channels: kept-existing URLs + newly uploaded files. Combined cap of 20.
            'existing_images'   => 'nullable|array|max:20',
            'existing_images.*' => 'string|url',
            'new_files'         => 'nullable|array|max:20',
            'new_files.*'       => 'image|mimes:jpeg,jpg,png,webp|max:5120',
        ]);

        if (isset($data['highlights']) && $data['highlights'] !== '') {
            $data['highlights'] = array_values(array_filter(array_map('trim', explode("\n", $data['highlights']))));
        } else {
            $data['highlights'] = null;
        }

        $totalImages = count($data['existing_images'] ?? []) + count((array) $request->file('new_files', []));
        if ($totalImages > 20) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'new_files' => 'A vehicle can have at most 20 images.',
            ]);
        }

        // The image fields aren't fillable on the model — they're rebuilt in buildImageArray().
        unset($data['existing_images'], $data['new_files']);

        return $data;
    }
}
