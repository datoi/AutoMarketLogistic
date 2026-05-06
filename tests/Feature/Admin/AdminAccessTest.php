<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $response = $this->get(route('admin.vehicles.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_regular_user_gets_403(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('admin.vehicles.index'));

        $response->assertForbidden();
    }

    public function test_admin_user_can_access_vehicles(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->get(route('admin.vehicles.index'));

        $response->assertOk();
    }
}
