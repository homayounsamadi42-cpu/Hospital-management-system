<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();

            $table->string('invoice_number')->unique();

            $table->foreignId('patient_id')
                ->constrained('patients')
                ->restrictOnDelete();

            $table->foreignId('appointment_id')
                ->nullable()
                ->constrained('appointments')
                ->restrictOnDelete();

            $table->date('invoice_date');
            $table->date('due_date')->nullable();

            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->decimal('paid_amount', 12, 2)->default(0);

            $table->string('currency', 3)->default('AFN');

            $table->string('status')->default('unpaid');
            $table->text('notes')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['patient_id', 'invoice_date']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
