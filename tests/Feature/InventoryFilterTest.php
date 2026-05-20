<?php

namespace Tests\Feature;

use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class InventoryFilterTest extends TestCase
{
    use RefreshDatabase;

    public function test_inventory_index_renders(): void
    {
        Vehicle::factory()->count(3)->create();

        $this->get(route('inventory.index'))->assertOk();
    }

    /** Regression: BUG-1 — search was case-sensitive on Postgres after the SQLite switch. */
    public function test_search_is_case_insensitive_on_configured_driver(): void
    {
        Vehicle::factory()->create(['make' => 'Tesla', 'model' => 'Model 3']);
        Vehicle::factory()->create(['make' => 'BMW', 'model' => 'X5']);

        $this->get(route('inventory.index', ['search' => 'tesla']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Inventory')
                ->where('vehicles.total', 1)
                ->where('vehicles.data.0.make', 'Tesla')
            );
    }

    public function test_excessive_price_filter_returns_empty_not_500(): void
    {
        Vehicle::factory()->count(2)->create(['price' => 25000]);

        $this->get(route('inventory.index', ['price_max' => '99999999999']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('vehicles.total', 2));
    }

    public function test_unknown_vehicle_id_returns_404(): void
    {
        $default = config('locales.default');
        $this->get("/{$default}/inventory/99999")->assertNotFound();
    }

    /** Regression: BUG-8 — sold vehicles stay viewable so old links don't 404. */
    public function test_sold_vehicle_detail_page_still_loads(): void
    {
        $sold = Vehicle::factory()->sold()->create();

        $this->get(route('inventory.show', $sold))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Vehicles/Show')
                ->where('vehicle.status', 'Sold')
            );
    }
}
