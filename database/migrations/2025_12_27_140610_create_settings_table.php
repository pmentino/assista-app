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
    Schema::create('settings', function (Blueprint $table) {
        $table->id();
        $table->string('key')->unique(); // e.g., 'signatory_mayor'
        $table->text('value')->nullable(); // e.g., 'Hon. Ronnie Dadivas'
        $table->string('label')->nullable(); // For UI display
        $table->string('type')->default('text'); // text, boolean, number
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
