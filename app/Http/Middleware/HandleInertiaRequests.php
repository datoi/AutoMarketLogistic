<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id'       => $request->user()->id,
                    'name'     => $request->user()->name,
                    'email'    => $request->user()->email,
                    'is_admin' => $request->user()->isAdmin(),
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],
            // Footer needs settings + popular makes on every public page render.
            // Both are read-mostly and tolerate staleness — cache aggressively.
            'publicSettings' => fn () => Cache::remember(
                'public_settings',
                3600,
                fn () => Setting::pluck('value', 'key')->all(),
            ),
            'popularMakes' => fn () => Cache::remember(
                'popular_makes',
                3600,
                fn () => Vehicle::query()
                    ->selectRaw('make, count(*) as c')
                    ->groupBy('make')
                    ->orderByDesc('c')
                    ->limit(3)
                    ->pluck('make')
                    ->all(),
            ),
            'locale' => fn () => app()->getLocale(),
            'supportedLocales' => fn () => config('locales.supported'),
            // Translations are flat English-as-key JSON. Cache the parsed file so we
            // don't hit disk on every request, but key by mtime so editing the JSON
            // during dev shows up without a manual cache clear.
            'translations' => fn () => $this->loadTranslations(app()->getLocale()),
        ];
    }

    private function loadTranslations(string $locale): array
    {
        $path = lang_path("{$locale}.json");
        if (! File::exists($path)) {
            return [];
        }
        $key = "translations:{$locale}:" . File::lastModified($path);
        return Cache::remember($key, 3600, function () use ($path) {
            $data = json_decode((string) File::get($path), true);
            if (! is_array($data)) {
                return [];
            }
            // Drop comment keys (any key starting with underscore) — they're for
            // translators, not the runtime.
            return array_filter($data, fn ($_, $k) => ! str_starts_with($k, '_'), ARRAY_FILTER_USE_BOTH);
        });
    }
}
