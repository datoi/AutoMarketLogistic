<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\InquiryController as AdminInquiryController;
use App\Http\Controllers\Admin\TestimonialController as AdminTestimonialController;
use App\Http\Controllers\Admin\VehicleController as AdminVehicleController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VehicleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Locale resolution for un-prefixed visits
|--------------------------------------------------------------------------
| Pick the visitor's preferred locale (cookie or default). Used by the root
| redirect and legacy un-prefixed path redirects below.
*/
$preferredLocale = function (Request $request): string {
    $supported = array_keys(config('locales.supported'));
    $default   = config('locales.default', 'en');
    $cookie    = $request->cookie('locale');
    return in_array($cookie, $supported, true) ? $cookie : $default;
};

// Root → /{locale}
Route::get('/', function (Request $request) use ($preferredLocale) {
    return redirect('/' . $preferredLocale($request));
});

// Legacy un-prefixed public paths → bounce to the visitor's locale. These keep
// old bookmarks and indexed URLs working after the URL-locale rollout.
Route::get('/inventory', fn (Request $r) => redirect('/' . $preferredLocale($r) . '/inventory'));
Route::get('/inventory/{vehicle}', fn (Request $r, $vehicle) => redirect('/' . $preferredLocale($r) . '/inventory/' . $vehicle));
Route::get('/contact', fn (Request $r) => redirect('/' . $preferredLocale($r) . '/contact'));

// Locale-prefixed public routes. URL::defaults() in SetLocale auto-injects the
// `locale` param into every named route call, so callers stay locale-agnostic.
Route::prefix('{locale}')
    ->where(['locale' => 'en|ka'])
    ->group(function () {
        Route::get('/', [HomeController::class, 'index'])->name('home');
        Route::get('/inventory', [VehicleController::class, 'index'])->name('inventory.index');
        Route::get('/inventory/{vehicle}', [VehicleController::class, 'show'])->name('inventory.show');
        Route::get('/contact', [InquiryController::class, 'create'])->name('contact');
        Route::post('/contact', [InquiryController::class, 'store'])->middleware('throttle:5,1')->name('contact.store');
    });

// Admin (English-only, no locale prefix)
Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::resource('vehicles', AdminVehicleController::class);
    Route::patch('/testimonials/{testimonial}/toggle', [AdminTestimonialController::class, 'toggle'])->name('testimonials.toggle');
    Route::resource('testimonials', AdminTestimonialController::class)->except('show');
    Route::get('/inquiries', [AdminInquiryController::class, 'index'])->name('inquiries.index');
    Route::patch('/inquiries/{inquiry}', [AdminInquiryController::class, 'update'])->name('inquiries.update');
    Route::delete('/inquiries/{inquiry}', [AdminInquiryController::class, 'destroy'])->name('inquiries.destroy');
});

// Auth profile routes (Breeze, English-only)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
