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
        Schema::table('manuscripts', function (Blueprint $table) {
            $table->foreignId('section_editor_id')->nullable()->constrained('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('manuscripts', function (Blueprint $table) {
            $table->dropForeign(['section_editor_id']);
            $table->dropColumn('section_editor_id');
        });
    }
};
