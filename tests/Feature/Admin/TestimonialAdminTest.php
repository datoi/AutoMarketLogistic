<?php

namespace Tests\Feature\Admin;

use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TestimonialAdminTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->admin()->create();
    }

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'name'          => 'Giorgi M.',
            'city'          => 'Tbilisi',
            'vehicle_label' => '2020 BMW X5',
            'quote'         => 'Great experience start to finish. Highly recommended.',
            'rating'        => 5,
            'is_active'     => true,
            'sort_order'    => 0,
        ], $overrides);
    }

    public function test_guest_cannot_access_admin_testimonials(): void
    {
        $this->get(route('admin.testimonials.index'))->assertRedirect(route('login'));
    }

    public function test_non_admin_user_cannot_access_admin_testimonials(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)
            ->get(route('admin.testimonials.index'))
            ->assertForbidden();
    }

    public function test_admin_can_list_testimonials(): void
    {
        Testimonial::factory()->count(3)->create();

        $this->actingAs($this->admin())
            ->get(route('admin.testimonials.index'))
            ->assertOk();
    }

    public function test_admin_can_create_testimonial(): void
    {
        $this->actingAs($this->admin())
            ->post(route('admin.testimonials.store'), $this->validPayload())
            ->assertRedirect(route('admin.testimonials.index'));

        $this->assertDatabaseHas('testimonials', ['name' => 'Giorgi M.']);
    }

    public function test_create_validates_required_fields(): void
    {
        $this->actingAs($this->admin())
            ->post(route('admin.testimonials.store'), [
                'name'   => '',
                'quote'  => 'too short',
                'rating' => 7,
            ])
            ->assertSessionHasErrors(['name', 'quote', 'rating']);
    }

    public function test_admin_can_update_testimonial(): void
    {
        $testimonial = Testimonial::factory()->create(['name' => 'Original']);

        $this->actingAs($this->admin())
            ->put(route('admin.testimonials.update', $testimonial), $this->validPayload(['name' => 'Updated']))
            ->assertRedirect(route('admin.testimonials.index'));

        $this->assertDatabaseHas('testimonials', ['id' => $testimonial->id, 'name' => 'Updated']);
    }

    public function test_admin_can_toggle_active_state(): void
    {
        $testimonial = Testimonial::factory()->create(['is_active' => true]);

        $this->actingAs($this->admin())
            ->patch(route('admin.testimonials.toggle', $testimonial))
            ->assertRedirect();

        $this->assertFalse($testimonial->fresh()->is_active);
    }

    public function test_admin_can_delete_testimonial(): void
    {
        $testimonial = Testimonial::factory()->create();

        $this->actingAs($this->admin())
            ->delete(route('admin.testimonials.destroy', $testimonial))
            ->assertRedirect(route('admin.testimonials.index'));

        $this->assertDatabaseMissing('testimonials', ['id' => $testimonial->id]);
    }

    public function test_homepage_renders_section_when_three_or_more_active(): void
    {
        Testimonial::factory()->count(3)->create(['is_active' => true]);

        $response = $this->get(route('home'));
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Home')
            ->where('testimonials', fn ($t) => count($t) === 3)
        );
    }

    public function test_homepage_hides_section_when_fewer_than_three_active(): void
    {
        Testimonial::factory()->count(2)->create(['is_active' => true]);
        Testimonial::factory()->count(5)->create(['is_active' => false]);

        $response = $this->get(route('home'));
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Home')
            ->where('testimonials', fn ($t) => count($t) === 0)
        );
    }
}
