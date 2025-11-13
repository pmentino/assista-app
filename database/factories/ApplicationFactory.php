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


            'middle_name' => $this->faker->lastName(),
            'suffix_name' => $this->faker->randomElement(['Jr.', 'Sr.', 'III', null]),
            'sex' => $this->faker->randomElement(['Male', 'Female']),
            'civil_status' => $this->faker->randomElement(['Single', 'Married', 'Widowed']),
            'birth_date' => $this->faker->date(),
            'house_no' => $this->faker->buildingNumber(),
            'barangay' => $this->faker->streetName(), 
            'city' => 'Roxas City',
            'contact_number' => $this->faker->phoneNumber(),
            'date_of_incident' => $this->faker->optional()->date(),
            'attachments' => null,
        ];
    }
}
