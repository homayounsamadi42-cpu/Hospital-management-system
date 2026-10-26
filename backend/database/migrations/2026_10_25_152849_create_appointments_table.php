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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();

            $table->string('appointment_number')->unique();

            $table->foreignId('patient_id')
                ->constrained('patients')
                ->restrictOnDelete();

            $table->foreignId('doctor_id')
                ->constrained('doctors')
                ->restrictOnDelete();

            $table->date('appointment_date');
            $table->time('appointment_time');

            $table->string('reason');
            $table->string('status')->default('scheduled');
            $table->text('notes')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['doctor_id', 'appointment_date']);
            $table->index(['patient_id', 'appointment_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }

};
