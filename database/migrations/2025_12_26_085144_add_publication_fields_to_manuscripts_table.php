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
            $table->foreignId('issue_id')->nullable()->constrained()->nullOnDelete();
            $table->string('page_start')->nullable();
            $table->string('page_end')->nullable();
            $table->string('doi')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('manuscripts', function (Blueprint $table) {
            $table->dropForeign(['issue_id']);
            $table->dropColumn(['issue_id', 'page_start', 'page_end', 'doi']);
        });
    }
};
