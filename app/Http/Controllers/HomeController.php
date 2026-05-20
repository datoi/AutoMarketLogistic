<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use App\Models\Vehicle;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $featured = Vehicle::where('is_featured', true)
            ->orderByDesc('created_at')
            ->limit(6)
            ->get();

        // Hide the section entirely if we don't have enough social proof — one or two
        // testimonials read sadder than none. Threshold is 3, matching the spec.
        $activeTestimonials = Testimonial::active()->limit(6)->get();
        $testimonials = $activeTestimonials->count() >= 3
            ? $activeTestimonials->take(3)->values()
            : collect();

        return Inertia::render('Home', [
            'featured'     => $featured,
            'testimonials' => $testimonials,
        ]);
    }
}
