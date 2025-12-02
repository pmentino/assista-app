<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Form Fields
            $table->string('program');
            $table->date('date_of_incident')->nullable();
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('suffix_name')->nullable();
            $table->string('sex');
            $table->string('civil_status');
            $table->date('birth_date');
            $table->string('house_no')->nullable();
            $table->string('barangay');
            $table->string('city');
            $table->string('contact_number');
            $table->string('email');
            $table->string('facebook_link')->nullable();

            // System Fields
            $table->json('attachments')->nullable(); // This stores the file paths
            $table->string('status')->default('Pending');
            $table->text('remarks')->nullable();
            $table->dateTime('interview_schedule')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
