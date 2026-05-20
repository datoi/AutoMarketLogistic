<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use App\Services\CloudinaryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function __construct(private CloudinaryService $cloudinary) {}

    public function index(): Response
    {
        $testimonials = Testimonial::query()
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->paginate(20);

        return Inertia::render('Admin/Testimonials/Index', [
            'testimonials' => $testimonials,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Testimonials/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        $uploaded = $this->uploadPhoto($request);
        if ($uploaded) {
            $data['photo_url']       = $uploaded['url'];
            $data['photo_public_id'] = $uploaded['public_id'];
        }

        try {
            Testimonial::create($data);
        } catch (\Throwable $e) {
            if ($uploaded) {
                $this->cloudinary->destroy($uploaded['public_id']);
            }
            throw $e;
        }

        return redirect()->route('admin.testimonials.index')
            ->with('success', 'Testimonial created.');
    }

    public function edit(Testimonial $testimonial): Response
    {
        return Inertia::render('Admin/Testimonials/Edit', [
            'testimonial' => $testimonial,
        ]);
    }

    public function update(Request $request, Testimonial $testimonial): RedirectResponse
    {
        $data = $this->validated($request);

        $previousPublicId = $testimonial->photo_public_id;

        // The client tells us whether to keep the existing photo; new uploads override it.
        $keepPhoto = $request->boolean('keep_photo', true);
        $uploaded  = $this->uploadPhoto($request);

        if ($uploaded) {
            $data['photo_url']       = $uploaded['url'];
            $data['photo_public_id'] = $uploaded['public_id'];
        } elseif (! $keepPhoto) {
            $data['photo_url']       = null;
            $data['photo_public_id'] = null;
        }

        try {
            $testimonial->update($data);
        } catch (\Throwable $e) {
            if ($uploaded) {
                $this->cloudinary->destroy($uploaded['public_id']);
            }
            throw $e;
        }

        // Only delete the previous photo after the DB write commits, mirroring the
        // VehicleController pattern (avoid orphaning a still-referenced asset).
        $replacedOrCleared = $uploaded || ! $keepPhoto;
        if ($replacedOrCleared && $previousPublicId) {
            $this->cloudinary->destroy($previousPublicId);
        }

        return redirect()->route('admin.testimonials.index')
            ->with('success', 'Testimonial updated.');
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $publicId = $testimonial->photo_public_id;

        $testimonial->delete();

        if ($publicId) {
            $this->cloudinary->destroy($publicId);
        }

        return redirect()->route('admin.testimonials.index')
            ->with('success', 'Testimonial deleted.');
    }

    public function toggle(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->update(['is_active' => ! $testimonial->is_active]);

        return back()->with('success', $testimonial->is_active ? 'Testimonial shown.' : 'Testimonial hidden.');
    }

    private function uploadPhoto(Request $request): ?array
    {
        $file = $request->file('photo');
        if (! $file || ! $file->isValid()) {
            return null;
        }
        return $this->cloudinary->upload($file);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name'          => 'required|string|max:150',
            'city'          => 'nullable|string|max:150',
            'vehicle_label' => 'nullable|string|max:200',
            'quote'         => 'required|string|min:10|max:500',
            'rating'        => 'required|integer|min:1|max:5',
            'is_active'     => 'nullable|boolean',
            'sort_order'    => 'nullable|integer|min:0|max:9999',
            'photo'         => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
        ]);
    }
}
