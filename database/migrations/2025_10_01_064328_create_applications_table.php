<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('applications', function (Blueprint $table) {
        $table->id(); // A unique ID for each application
        $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Links this application to a user
        $table->string('first_name');
        $table->string('last_name');
        $table->date('birth_date');
        $table->string('address');
        $table->string('contact_number');
        $table->string('assistance_type'); // This will store things like 'Medical Aid', 'Burial Aid', etc.
        $table->text('details')->nullable(); // An optional field for more details from the applicant
        $table->string('status')->default('Pending'); // The default status for every new application
        $table->timestamps(); // Automatically adds 'created_at' and 'updated_at' columns
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
