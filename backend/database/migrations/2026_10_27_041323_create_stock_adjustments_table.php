<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_adjustments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('medicine_id')
                ->constrained('medicines')
                ->cascadeOnDelete();

            $table->string('adjustment_type', 20);
            $table->unsignedInteger('quantity');

            $table->unsignedInteger('quantity_before');
            $table->unsignedInteger('quantity_after');

            $table->string('reason', 255);
            $table->string('reference_number', 100)->nullable();

            $table->foreignId('adjusted_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();

            $table->index(['medicine_id', 'created_at']);
            $table->index('adjustment_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_adjustments');
    }
};
