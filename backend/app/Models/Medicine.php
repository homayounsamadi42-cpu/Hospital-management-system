<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Medicine extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'medicine_code',
        'name',
        'category',
        'strength',
        'dosage_form',
        'manufacturer',
        'supplier',
        'quantity',
        'reorder_level',
        'purchase_price',
        'selling_price',
        'currency',
        'expiry_date',
        'batch_number',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'reorder_level' => 'integer',
            'purchase_price' => 'decimal:2',
            'selling_price' => 'decimal:2',
            'expiry_date' => 'date',
        ];
    }
    public function stockAdjustments(): HasMany
{
    return $this->hasMany(StockAdjustment::class);
}
}
