<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Doctor extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'doctor_number',
        'first_name',
        'last_name',
        'specialization',
        'phone',
        'email',
        'gender',
        'qualification',
        'license_number',
        'department',
        'consultation_fee',
        'address',
    ];

    protected function casts(): array
    {
        return [
            'consultation_fee' => 'decimal:2',
        ];
    }
}
