<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Supported Locales
    |--------------------------------------------------------------------------
    |
    | Keys are the locale codes used in the `locale` cookie and Inertia share.
    | Labels render in the language switcher dropdown.
    | `native` shows in the closed-pill chip (uppercase 2-letter).
    |
    | Add a locale here, drop a matching `lang/<code>.json` file, and the
    | switcher will offer it. No code changes required.
    |
    */

    'supported' => [
        'en' => ['label' => 'English',  'native' => 'EN'],
        'ka' => ['label' => 'ქართული', 'native' => 'KA'],
    ],

    'default' => 'en',
];
