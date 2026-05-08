<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InquiryController extends Controller
{
    public function create(Request $request): Response
    {
        return Inertia::render('Contact', [
            'vehicleId'    => $request->query('vehicle_id'),
            'vehicleTitle' => $request->query('vehicle_title'),
            'settings'     => Setting::whereIn('key', [
                'contact_phone', 'contact_hours', 'contact_email',
                'contact_reply_time', 'contact_address_line1', 'contact_address_line2',
            ])->pluck('value', 'key'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        // Honeypot: real visitors leave this blank; bots fill it. Silently 200 so
        // the bot can't tell it was rejected and won't tweak its strategy.
        if ($request->filled('website')) {
            return redirect()->back()->with('success', 'Thank you! We will contact you shortly.');
        }

        $validated = $request->validate([
            'vehicle_id'      => 'nullable|exists:vehicles,id',
            'name'            => 'required|string|max:200',
            'email'           => 'required|email|max:200',
            // Phone format: allow digits and the usual punctuation only. Min 6 digits
            // worth of input rejects obvious junk while staying liberal about formatting.
            'phone'           => ['required', 'string', 'max:50', 'regex:/^[\d\s+\-().]{6,50}$/'],
            'car_of_interest' => 'nullable|string|max:500',
            'message'         => 'nullable|string|max:2000',
        ], [
            'phone.regex' => 'Please enter a valid phone number (digits, spaces, +, -, parentheses only).',
        ]);

        Inquiry::create($validated);

        return redirect()->back()->with('success', 'Thank you! We will contact you shortly.');
    }
}
