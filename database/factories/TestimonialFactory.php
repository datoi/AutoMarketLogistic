<?php

namespace Database\Factories;

use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Testimonial>
 */
class TestimonialFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'          => fake()->firstName() . ' ' . strtoupper(fake()->randomLetter()) . '.',
            'city'          => fake()->randomElement(['Tbilisi', 'Batumi', 'Kutaisi', 'Rustavi']),
            'vehicle_label' => fake()->numberBetween(2018, 2024) . ' ' . fake()->randomElement(['BMW X5', 'Mercedes GLE', 'Toyota Camry', 'Audi A6']),
            'quote'         => fake()->paragraph(3),
            'rating'        => 5,
            'is_active'     => true,
            'sort_order'    => 0,
        ];
    }
}
