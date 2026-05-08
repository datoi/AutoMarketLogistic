<?php

namespace Tests\Feature;

use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class InquiryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // throttle: middleware persists hits in cache across tests within a single
        // PHPUnit run; flush so each test starts at zero hits.
        Cache::flush();
    }

    public function test_guest_can_submit_inquiry(): void
    {
        $this->post(route('contact.store'), [
            'name'    => 'Jane Doe',
            'email'   => 'jane@example.com',
            'phone'   => '+995 555 123 456',
            'message' => 'Looking for a 2021 BMW X5',
        ])->assertRedirect()->assertSessionHas('success');

        $this->assertDatabaseHas('inquiries', [
            'email'  => 'jane@example.com',
            'status' => 'new',
        ]);
    }

    public function test_inquiry_validates_required_fields(): void
    {
        $this->post(route('contact.store'), [])
            ->assertSessionHasErrors(['name', 'email', 'phone']);
    }

    public function test_inquiry_associates_vehicle_when_id_valid(): void
    {
        $v = Vehicle::factory()->create();

        $this->post(route('contact.store'), [
            'vehicle_id' => $v->id,
            'name'       => 'X',
            'email'      => 'x@y.test',
            'phone'      => '5551234',
        ])->assertRedirect();

        $this->assertDatabaseHas('inquiries', ['vehicle_id' => $v->id]);
    }

    public function test_inquiry_rejects_unknown_vehicle_id(): void
    {
        $this->post(route('contact.store'), [
            'vehicle_id' => 99999,
            'name'       => 'X',
            'email'      => 'x@y.test',
            'phone'      => '5551234',
        ])->assertSessionHasErrors('vehicle_id');
    }

    /** Regression: BUG-10 — phone field used to accept anything. */
    public function test_inquiry_rejects_invalid_phone_characters(): void
    {
        $this->post(route('contact.store'), [
            'name'  => 'X',
            'email' => 'x@y.test',
            'phone' => '<script>alert(1)</script>',
        ])->assertSessionHasErrors('phone');
    }

    public function test_inquiry_rejects_too_short_phone(): void
    {
        $this->post(route('contact.store'), [
            'name'  => 'X',
            'email' => 'x@y.test',
            'phone' => '12',
        ])->assertSessionHasErrors('phone');
    }

    /** Regression: BUG-9 — honeypot must drop the submission silently. */
    public function test_honeypot_blocks_bot_submission(): void
    {
        $this->post(route('contact.store'), [
            'name'    => 'Bot',
            'email'   => 'bot@example.com',
            'phone'   => '5551234',
            'website' => 'http://spam.example',
        ])->assertRedirect()->assertSessionHas('success');

        // Even though the response looks successful to the bot, no row was written.
        $this->assertDatabaseMissing('inquiries', ['email' => 'bot@example.com']);
    }

    public function test_throttle_blocks_after_5_per_minute(): void
    {
        $payload = ['name' => 'X', 'email' => 'x@y.test', 'phone' => '5551234'];

        for ($i = 0; $i < 5; $i++) {
            $this->post(route('contact.store'), $payload)->assertRedirect();
        }

        $this->post(route('contact.store'), $payload)->assertStatus(429);
    }
}
