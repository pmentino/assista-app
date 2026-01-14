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
        Schema::table('assistance_programs', function (Blueprint $table) {
            // Stores the default assistance amount (e.g., 5000.00)
            $table->decimal('default_amount', 10, 2)->nullable()->after('requirements');
        });
    }

    public function down(): void
    {
        Schema::table('assistance_programs', function (Blueprint $table) {
            $table->dropColumn('default_amount');
        });
    }
};
