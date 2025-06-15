<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PersonnelJobShift extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable=['personnel_id', 'job_shift_id', 'start_date', 'apply_date'];
    protected $table = 'personnel_job_shifts';

    public function JobShift(){
        return $this->belongsTo(JobShift::class, 'job_shift_id','id');
    }
}
