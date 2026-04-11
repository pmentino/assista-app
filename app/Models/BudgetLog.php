<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BudgetLog extends Model
{
    use HasFactory;

    // THIS IS THE FIX: Added 'previous_amount'
    protected $fillable = [
        'user_id',
        'action',
        'previous_amount',
        'amount',
        'balance_after'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
