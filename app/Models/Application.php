<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * We've added all the new fields here.
     *
     * @var array<int, string>
     */
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
        'status', // Added status to be safe
    ];

    /**
     * Get the user that owns the application.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
