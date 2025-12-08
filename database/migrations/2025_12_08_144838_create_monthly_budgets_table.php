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
        Schema::create('monthly_budgets', function (Blueprint $table) {
            $table->id();
            $table->integer('month'); // 1 = January, 12 = December
            $table->integer('year');  // 2025
            $table->decimal('amount', 15, 2); // The allocated budget
            $table->timestamps();

            // Ensure we can't have two budgets for "December 2025"
            $table->unique(['month', 'year']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('monthly_budgets');
    }
};
