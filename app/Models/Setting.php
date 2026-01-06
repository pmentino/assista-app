<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    // --- THIS IS THE MISSING KEY ---
    // Without this, Laravel silently ignores the 'value' you try to save.
    protected $fillable = ['key', 'value'];
}
