<?php

namespace App\Http\Controllers;

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

        return Inertia::render('Home', ['featured' => $featured]);
    }
}
