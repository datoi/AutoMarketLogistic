<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $supported = array_keys(config('locales.supported'));
        $default   = config('locales.default', 'en');

        // Resolution order: URL segment wins (shareable links must override cookie),
        // then cookie (remembered preference), then default.
        $urlLocale    = $request->route('locale');
        $cookieLocale = $request->cookie('locale');

        if (in_array($urlLocale, $supported, true)) {
            $locale = $urlLocale;
        } elseif (in_array($cookieLocale, $supported, true)) {
            $locale = $cookieLocale;
        } else {
            $locale = $default;
        }

        app()->setLocale($locale);
        // Auto-inject {locale} into every named route that has the param, so
        // `route('home')` becomes `/en` or `/ka` without callers passing it.
        URL::defaults(['locale' => $locale]);

        $response = $next($request);

        // Sync the cookie when the URL-locale diverges from the cookie — happens
        // when the visitor used the switcher or followed a shared cross-locale link.
        if (in_array($urlLocale, $supported, true) && $urlLocale !== $cookieLocale) {
            $response->headers->setCookie(cookie()->forever('locale', $urlLocale));
        }

        return $response;
    }
}
