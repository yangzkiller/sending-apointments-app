<?php

namespace App\Models\Spreadsheet;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User\User;
use App\Models\Institution\Institution;
use App\Models\Spreadsheet\SpreadsheetRow;

class Spreadsheet extends Model
{
    use HasFactory;

    protected $table = 'spreadsheets';

    protected $fillable = [
        'rows',
        'status',
        'id_institution',
        'id_user',
    ];

    /**
     * A spreadsheet belongs to an institution.
     */
    public function institution()
    {
        return $this->belongsTo(Institution::class, 'id_institution');
    }

    /**
     * A spreadsheet belongs to a user.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    /**
     * Get all spreadsheets rows that  belong to this spreadsheet.
     */
    public function spreadsheetRows()
    {
        return $this->hasMany(SpreadsheetRow::class, 'id_spreadsheet');
    }
}


