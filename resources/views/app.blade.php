<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        {{-- hreflang alternates for search engines. Only rendered for locale-prefixed
             public pages — admin/auth/legacy redirects don't need alternates. --}}
        @php
            $path = trim(request()->path(), '/');
            $supportedCodes = array_keys(config('locales.supported'));
            $segments = explode('/', $path, 2);
            $hasLocalePrefix = in_array($segments[0] ?? null, $supportedCodes, true);
            $rest = $hasLocalePrefix ? ($segments[1] ?? '') : '';
        @endphp
        @if ($hasLocalePrefix)
            @foreach ($supportedCodes as $code)
                <link rel="alternate" hreflang="{{ $code }}" href="{{ url('/' . $code . ($rest !== '' ? '/' . $rest : '')) }}" />
            @endforeach
            <link rel="alternate" hreflang="x-default" href="{{ url('/' . config('locales.default') . ($rest !== '' ? '/' . $rest : '')) }}" />
        @endif

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
