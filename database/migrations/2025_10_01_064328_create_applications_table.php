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
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Final fields from your new form
            $table->string('first_name');
            $table->string('last_name');
            $table->date('birth_date');
            // $table->string('address'); // <-- THIS UNUSED LINE HAS BEEN REMOVED
            $table->string('contact_number');
            $table->string('email');
            $table->string('program');
            $table->date('date_of_incident')->nullable();

            $table->string('status')->default('Pending');
            $table->timestamps();
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
