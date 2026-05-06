<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InquiryController extends Controller
{
    public function index(Request $request): Response
    {
        $inquiries = Inquiry::with('vehicle')
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Inquiries/Index', [
            'inquiries' => $inquiries,
            'filters'   => $request->only('status'),
            'counts'    => (function () {
                $counts = Inquiry::selectRaw('status, COUNT(*) as count')
                    ->groupBy('status')
                    ->pluck('count', 'status');
                return [
                    'all'       => $counts->sum(),
                    'new'       => $counts->get('new', 0),
                    'contacted' => $counts->get('contacted', 0),
                    'closed'    => $counts->get('closed', 0),
                ];
            })(),
        ]);
    }

    public function destroy(Inquiry $inquiry): RedirectResponse
    {
        $inquiry->delete();

        return redirect()->route('admin.inquiries.index')
            ->with('success', 'Inquiry deleted.');
    }

    public function update(Request $request, Inquiry $inquiry): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:new,contacted,closed',
        ]);

        $inquiry->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Inquiry status updated.');
    }
}
