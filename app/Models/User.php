<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany; // <-- Import HasMany

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
    'name',
    'email',
    'password',
    'profile_photo_path', // Don't forget this!
    'contact_number',     // <--- NEW
    'civil_status',       // <--- NEW
    'sex',                // <--- NEW
    'birth_date',         // <--- NEW
    'barangay',           // <--- NEW
    'house_no',           // <--- NEW
    'type',               // For admin/user distinction
];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the applications for the user.
     */

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }
}
