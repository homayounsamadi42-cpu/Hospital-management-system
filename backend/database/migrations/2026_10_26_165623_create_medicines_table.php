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
    Schema::create('medicines', function (Blueprint $table) {
        $table->id();

        // Basic medicine information
        $table->string('medicine_code')->unique();
        $table->string('name');
        $table->string('category')->nullable();
        $table->string('strength')->nullable();
        $table->string('dosage_form')->nullable();
        $table->string('manufacturer')->nullable();
        $table->string('supplier')->nullable();

        // Inventory quantities
        $table->unsignedInteger('quantity')->default(0);
        $table->unsignedInteger('reorder_level')->default(10);

        // Financial information (AFN by default)
        $table->decimal('purchase_price', 12, 2)->default(0);
        $table->decimal('selling_price', 12, 2)->default(0);
        $table->string('currency', 3)->default('AFN');

        // Expiry and storage information
        $table->date('expiry_date')->nullable();
        $table->string('batch_number')->nullable();
        $table->text('description')->nullable();

        // Supports archiving without permanently deleting records
        $table->softDeletes();
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }
};
