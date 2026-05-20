<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic test example.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        $default = config('locales.default');

        // Root redirects to the visitor's locale; the canonical homepage lives
        // under /{locale}.
        $this->get('/')->assertRedirect("/{$default}");
        $this->get("/{$default}")->assertStatus(200);
    }
}
