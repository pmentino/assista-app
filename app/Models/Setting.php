<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    // This property allows 'key' and 'value' to be saved to the database
    protected $fillable = ['key', 'value', 'label', 'type'];
}
