<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobShift extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable=['title','holidays','calculate_holiday_works', 'status',
                        'calculate_night_works','vacation_day','vacation_day_period',
                        'shift_pattern','calculate_overtime','calculate_friday_works',
                        'vacation_day_on_holidays'];

    protected $casts = [
        'shift_pattern' => 'array',
    ];

    public function personnelJobShifts()
    {
        return $this->hasMany(PersonnelJobShift::class, 'job_shift_id');
    }
}
