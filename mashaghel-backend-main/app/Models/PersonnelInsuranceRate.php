<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PersonnelInsuranceRate extends Model
{
    use HasFactory;
    protected $table = 'personnel_insurance_rate';
    protected $fillable = ['personnel_id_fk','insured_rate','employer_rate','jobless_rate','hard_job_rate'];
    public $timestamps = false;
}
