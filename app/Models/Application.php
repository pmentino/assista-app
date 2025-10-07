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
    // THIS IS THE FIX: We've added all the fields from your form
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
        'contact_number',
        'email',
        'address',
        'assistance_type',
    ];

    /**
     * Get the user that the application belongs to.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
