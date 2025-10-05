<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Application extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
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
        'address',
        'assistance_type', // <-- THIS WAS THE MISSING FIELD
        'contact_number',
        'email',
        'status',
    ];

    /**
     * Get the user that owns the application.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
