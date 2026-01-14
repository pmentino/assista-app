<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssistanceProgram extends Model
{
    use HasFactory;

    // FIX: Added 'default_amount' to fillable
    protected $fillable = ['title', 'description', 'icon_path', 'is_active', 'requirements', 'default_amount'];

    // Cast the JSON column to an array automatically
    protected $casts = [
        'requirements' => 'array',
        'default_amount' => 'decimal:2', // Optional: casts to float/decimal
    ];
}
