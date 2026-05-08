<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VehicleAdminTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->admin()->create();
    }

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'year'       => 2021,
            'make'       => 'BMW',
            'model'      => 'X5',
            'price'      => 25000,
            'mileage'    => 30000,
            'condition'  => 'Good',
            'status'     => 'Available',
            'lot_number' => 'CP-' . random_int(10000, 99999),
            'vin'        => strtoupper(substr(str_repeat('ABCDEF1234567890', 2), 0, 17)),
            'fuel_type'  => 'Gasoline',
            'transmission' => 'Automatic',
        ], $overrides);
    }

    public function test_admin_can_create_vehicle(): void
    {
        $this->actingAs($this->admin())
            ->post(route('admin.vehicles.store'), $this->validPayload())
            ->assertRedirect(route('admin.vehicles.index'));

        $this->assertDatabaseHas('vehicles', ['make' => 'BMW', 'model' => 'X5']);
    }

    /**
     * Regression: BUG documented in Edit.jsx:34 — Inertia useForm().transform()
     * returns void, so chaining .post() crashed silently. This test exercises the
     * route end-to-end to make sure the update path stays alive.
     */
    public function test_admin_can_update_vehicle(): void
    {
        $vehicle = Vehicle::factory()->create();

        $this->actingAs($this->admin())
            ->put(route('admin.vehicles.update', $vehicle), $this->validPayload([
                'lot_number' => $vehicle->lot_number,
                'vin'        => $vehicle->vin,
                'price'      => 31337,
            ]))
            ->assertRedirect(route('admin.vehicles.index'));

        $this->assertSame(31337.0, (float) $vehicle->fresh()->price);
    }

    /** Regression: BUG-3 — oversized price used to overflow decimal(10,2) and 500. */
    public function test_oversize_price_returns_422_not_500(): void
    {
        $this->actingAs($this->admin())
            ->post(route('admin.vehicles.store'), $this->validPayload(['price' => 99999999999]))
            ->assertSessionHasErrors('price');
    }

    /** Regression: BUG-3 — same shape, mileage column. */
    public function test_oversize_mileage_returns_422_not_500(): void
    {
        $this->actingAs($this->admin())
            ->post(route('admin.vehicles.store'), $this->validPayload(['mileage' => 99999999999]))
            ->assertSessionHasErrors('mileage');
    }

    /**
     * Defense-in-depth: a hostile admin can edit the existing_images array client-side
     * to inject arbitrary URLs. The controller intersects against DB-known URLs so
     * the injected entry is dropped before save.
     */
    public function test_existing_images_payload_only_keeps_known_urls(): void
    {
        $vehicle = Vehicle::factory()->withImages(1)->create();
        $knownUrl = $vehicle->images[0]['url'];

        $this->actingAs($this->admin())
            ->put(route('admin.vehicles.update', $vehicle), $this->validPayload([
                'lot_number'      => $vehicle->lot_number,
                'vin'             => $vehicle->vin,
                'existing_images' => [
                    $knownUrl,                                           // legit
                    'https://attacker.example.com/evil.jpg',             // injected
                ],
            ]))
            ->assertRedirect();

        $images = $vehicle->fresh()->images;
        $this->assertCount(1, $images);
        $this->assertSame($knownUrl, $images[0]['url']);
    }

    public function test_duplicate_vin_is_rejected(): void
    {
        $existing = Vehicle::factory()->create();

        $this->actingAs($this->admin())
            ->post(route('admin.vehicles.store'), $this->validPayload(['vin' => $existing->vin]))
            ->assertSessionHasErrors('vin');
    }

    public function test_regular_user_cannot_access_admin_crud(): void
    {
        $this->actingAs(User::factory()->create())
            ->post(route('admin.vehicles.store'), $this->validPayload())
            ->assertForbidden();
    }
}
