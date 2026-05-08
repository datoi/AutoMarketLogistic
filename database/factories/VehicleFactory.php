<?php

namespace Database\Factories;

use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Vehicle>
 */
class VehicleFactory extends Factory
{
    public function definition(): array
    {
        return [
            'year'             => fake()->numberBetween(2010, (int) date('Y')),
            'make'             => fake()->randomElement(['BMW', 'Tesla', 'Ford', 'Toyota', 'Lexus']),
            'model'            => fake()->randomElement(['X5', 'Model 3', 'Escape', 'Camry', 'NX']),
            'trim'             => fake()->optional()->word(),
            'price'            => fake()->numberBetween(5000, 50000),
            'mileage'          => fake()->numberBetween(0, 200000),
            'condition'        => fake()->randomElement(['Excellent', 'Good', 'Fair', 'Poor']),
            'status'           => 'Available',
            'lot_number'       => fake()->unique()->numerify('CP-########'),
            // VIN is exactly 17 chars per the schema/validator.
            'vin'              => strtoupper(fake()->unique()->bothify('???###???########')),
            'estimated_arrival' => fake()->optional()->dateTimeBetween('+1 day', '+90 days'),
            'is_featured'      => false,
        ];
    }

    public function sold(): static
    {
        return $this->state(fn () => ['status' => 'Sold']);
    }

    public function featured(): static
    {
        return $this->state(fn () => ['is_featured' => true]);
    }

    /** Pre-populate the new {url, public_id} image shape. */
    public function withImages(int $count = 2): static
    {
        return $this->state(fn () => [
            'images' => collect(range(1, $count))->map(fn ($i) => [
                'url'       => "https://res.cloudinary.com/test/image/upload/v1/folder/img-{$i}.jpg",
                'public_id' => "folder/img-{$i}",
            ])->all(),
        ]);
    }
}
