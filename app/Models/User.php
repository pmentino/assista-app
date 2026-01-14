<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'profile_photo_path',
        'contact_number',
        'civil_status',
        'sex',
        'birth_date',
        'barangay',
        'house_no',
        'type',       // admin, staff, user
        'is_active',  // <--- NEW: Added this to allow updates
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
            'is_active' => 'boolean', // <--- NEW: Ensures it returns true/false, not 1/0
        ];
    }

    /**
     * Get the applications for the user.
     */
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    // --- OPTIONAL HELPER ---
    // You can use this later: if ($user->isAdmin()) { ... }
    public function isAdmin() {
        return $this->type === 'admin';
    }

    public function isStaff() {
        return $this->type === 'staff';
    }
}
