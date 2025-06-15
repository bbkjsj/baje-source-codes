<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Personnel extends Model
{
    use HasFactory;
    protected $table = 'personnel';

    public function PersonnelJobShifts()
    {
        return $this->hasMany(PersonnelJobShift::class,'personnel_id');
    }
}
