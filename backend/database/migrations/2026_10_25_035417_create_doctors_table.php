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
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->string('doctor_number')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('specialization');
            $table->string('phone')->nullable();
            $table->string('email')->nullable()->unique();
            $table->string('gender')->nullable();
            $table->string('qualification')->nullable();
            $table->string('license_number')->nullable()->unique();
            $table->string('department')->nullable();
            $table->decimal('consultation_fee', 10, 2)->default(0);
            $table->text('address')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }

};
