<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Services\CloudinaryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

        // Upload first, then DB-insert. If the insert fails we destroy the just-uploaded
        // assets so we don't leave orphan blobs in Cloudinary.
        $uploaded = $this->uploadNewFiles($request);

        try {
            $data['images'] = $uploaded ?: null;
            DB::transaction(fn () => Vehicle::create($data));
        } catch (\Throwable $e) {
            foreach ($uploaded as $img) {
                $this->cloudinary->destroy($img['public_id'] ?? null);
            }
            throw $e;
        }

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
        $uploaded = $this->uploadNewFiles($request);

        // Trust server-side data for kept images: client only tells us which existing
        // URLs to keep; we look up the matching {url, public_id} from $previousImages
        // ourselves so a hostile admin can't inject arbitrary public_ids via the DOM.
        $keptUrls = array_values(array_intersect(
            $request->input('existing_images', []) ?: [],
            array_column($previousImages, 'url')
        ));
        $kept = array_values(array_filter(
            $previousImages,
            fn ($img) => in_array($img['url'] ?? null, $keptUrls, true)
        ));

        $combined = array_values(array_merge($kept, $uploaded));
        $data['images'] = $combined ?: null;

        // Anything in $previousImages that didn't survive the keep-set is a candidate
        // for Cloudinary delete — but only after the DB commit succeeds. Otherwise a
        // failing update would orphan still-referenced URLs as 404s.
        $keptPublicIds = array_filter(array_column($kept, 'public_id'));
        $toDelete = array_filter(
            array_column($previousImages, 'public_id'),
            fn ($pid) => $pid && ! in_array($pid, $keptPublicIds, true)
        );

        try {
            DB::transaction(fn () => $vehicle->update($data));
        } catch (\Throwable $e) {
            // DB write failed — undo the just-uploaded files so they don't orphan.
            foreach ($uploaded as $img) {
                $this->cloudinary->destroy($img['public_id'] ?? null);
            }
            throw $e;
        }

        foreach ($toDelete as $publicId) {
            $this->cloudinary->destroy($publicId);
        }

        return redirect()->route('admin.vehicles.index')
            ->with('success', 'Vehicle updated successfully.');
    }

    public function destroy(Vehicle $vehicle): RedirectResponse
    {
        $images = $vehicle->images ?? [];

        $vehicle->delete();

        foreach ($images as $img) {
            $this->cloudinary->destroy($img['public_id'] ?? null);
        }

        return redirect()->route('admin.vehicles.index')
            ->with('success', 'Vehicle deleted.');
    }

    /**
     * Upload each new file and return `{url, public_id}` pairs.
     *
     * @return array<int, array{url: string, public_id: string}>
     */
    private function uploadNewFiles(Request $request): array
    {
        $uploaded = [];
        foreach ((array) $request->file('new_files', []) as $file) {
            if ($file && $file->isValid()) {
                $uploaded[] = $this->cloudinary->upload($file);
            }
        }
        return $uploaded;
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

            // Images: the client sends a flat list of URL strings it wants kept (not
            // the full {url, public_id} objects — public_id is server-owned). New
            // uploads come through `new_files`. Combined cap of 20.
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

        // The image fields aren't fillable on the model — they're rebuilt in the
        // store/update flow above.
        unset($data['existing_images'], $data['new_files']);

        return $data;
    }
}
