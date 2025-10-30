<?php

namespace App\Models\Institution;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User\User;
use App\Models\Spreadsheet\Spreadsheet;

class Institution extends Model
{
    use HasFactory;

    protected $table = 'institutions';

    protected $fillable = [
        'name',
        'active',
    ];

    /**
     * Get all users that belong to this institution.
     */
    public function users()
    {
        return $this->hasMany(User::class, 'id_institution');
    }

    /**
     * Get all spreadsheets that  belong to this institution.
     */
    public function spreadsheets()
    {
        return $this->hasMany(Spreadsheet::class, 'id_institution');
    }
}
