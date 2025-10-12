<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Application;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Application>
 */
class ApplicationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Application::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Note: user_id, first_name, last_name, email, program, and status
            // are provided by the Seeder, so we don't need them here.

            'middle_name' => $this->faker->lastName(),
            'suffix_name' => $this->faker->randomElement(['Jr.', 'Sr.', 'III', null]),
            'sex' => $this->faker->randomElement(['Male', 'Female']),
            'civil_status' => $this->faker->randomElement(['Single', 'Married', 'Widowed']),
            'birth_date' => $this->faker->date(),
            'house_no' => $this->faker->buildingNumber(),
            'barangay' => $this->faker->streetName(), // Using street name as a good enough fake barangay
            'city' => 'Roxas City',
            'contact_number' => $this->faker->phoneNumber(),
            'date_of_incident' => $this->faker->optional()->date(),
            'attachments' => null,
        ];
    }
}
