<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'program',
        'date_of_incident',
        'first_name',
        'middle_name',
        'last_name',
        'suffix_name',
        'sex',
        'civil_status',
        'birth_date',
        'house_no',
        'barangay',
        'city',
        'contact_number',
        'email',
        'facebook_link',
        'attachments',
        'status',
        'remarks',
        'amount_released',
    ];

    // CRITICAL: This tells Laravel to treat the JSON 'attachments' column as a PHP Array
    protected $casts = [
        'attachments' => 'array',
        'date_of_incident' => 'date',
        'birth_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
