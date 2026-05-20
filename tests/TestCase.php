<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\URL;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Production sets this in the SetLocale middleware on every request.
        // Tests generate URLs before any middleware fires, so we seed the same
        // default here — otherwise route('home') etc. would render `/{locale}`
        // placeholders and the request would 404.
        URL::defaults(['locale' => config('locales.default', 'en')]);
    }
}
