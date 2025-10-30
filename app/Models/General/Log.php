<?php

namespace App\Models\General;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User\User;

class Log extends Model
{
    use HasFactory;

    protected $table = 'logs';

    protected $fillable = [
        'name',
        'action',
        'description',
        'id_user',
    ];

    /**
     * A user belongs to a log.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}



