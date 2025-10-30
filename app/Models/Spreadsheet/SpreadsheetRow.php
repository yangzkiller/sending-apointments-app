<?php

namespace App\Models\Spreadsheet;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Spreadsheet\Spreadsheet;

class SpreadsheetRow extends Model
{
    use HasFactory;

    protected $table = 'spreadsheet_rows';

    protected $fillable = [
        'name',
        'ddi',
        'ddd',
        'phone',
        'specialty',
        'institution',
        'address',
        'identifier',
        'id_spreadsheet',
    ];

    /**
     * A spreadsheet rows belongs to an spreadsheet.
     */
    public function spreadsheet()
    {
        return $this->belongsTo(Spreadsheet::class, 'id_spreadsheet');
    }
}



