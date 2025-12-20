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
    Schema::create('audit_logs', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Who did it?
        $table->string('action'); // What did they do? (e.g., "Approved Application")
        $table->text('details')->nullable(); // Specifics (e.g., "App #42 - P5,000")
        $table->string('ip_address')->nullable(); // Security tracking
        $table->timestamps(); // When did it happen?
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
