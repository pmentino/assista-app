<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BudgetLog extends Model
{
    use HasFactory;

    // THIS LINE IS CRITICAL - DO NOT SKIP
    protected $fillable = ['user_id', 'amount', 'action', 'balance_after'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
