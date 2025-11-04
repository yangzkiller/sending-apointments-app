<?php

namespace App\Models\User;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\General\Log;
use App\Models\Spreadsheet\Spreadsheet;
use App\Models\Institution\Institution;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'id_institution',
        'role',
        'active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];


    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get all logs that  belong to this user.
     */
    public function logs()
    {
        return $this->hasMany(Log::class, 'id_user');
    }

    /**
     * Get all spreadsheets that  belong to this user.
     */
    public function spreadsheets()
    {
        return $this->hasMany(Spreadsheet::class, 'id_user');
    }

    /**
     * A user belongs to an institution.
     */
    public function institution()
    {
        return $this->belongsTo(Institution::class, 'id_institution');
    }
}
