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
        Schema::table('settingapp', function (Blueprint $table) {
            $table->text('aims_scope')->nullable();
            $table->text('peer_review_process')->nullable();
            $table->text('open_access_policy')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settingapp', function (Blueprint $table) {
            $table->dropColumn(['aims_scope', 'peer_review_process', 'open_access_policy']);
        });
    }
};
