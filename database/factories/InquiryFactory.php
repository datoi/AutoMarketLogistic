<?php

namespace Database\Factories;

use App\Models\Inquiry;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Inquiry>
 */
class InquiryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'  => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => '+1 555 ' . fake()->numerify('### ####'),
            'message' => fake()->sentence(),
            'status' => 'new',
        ];
    }
}
