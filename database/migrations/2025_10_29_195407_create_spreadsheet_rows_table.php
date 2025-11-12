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
        Schema::create('spreadsheet_rows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_spreadsheet')->constrained('spreadsheets')->onDelete('cascade');
            $table->string('name');
            $table->string('ddi')->default('55');
            $table->string('ddd', 2);
            $table->string('phone', 9);
            $table->string('speciality');
            $table->string('institution');
            $table->string('address');
            $table->date('date');
            $table->time('hour');
            $table->string('identifier');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spreadsheet_rows');
    }
};
