<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    // We explicitly list every field to prevent "Mass Assignment" errors
    protected $fillable = [
        'user_id',
        'program',
        'date_of_incident',
        'first_name',
        'middle_name',
        'last_name',
        'suffix_name',
        'sex',              // <--- Ensure these are here
        'civil_status',
        'birth_date',
        'house_no',
        'barangay',
        'city',
        'contact_number',
        'email',
        'facebook_link',
        'valid_id',
        'indigency_cert',
        'attachments',
        'status',
        'remarks',
        'amount_released',
        'approved_date'
    ];

    protected $casts = [
        'attachments' => 'array',
        'approved_date' => 'datetime',
        'birth_date' => 'date',
        'date_of_incident' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
