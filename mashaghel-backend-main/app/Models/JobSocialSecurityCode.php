<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobSocialSecurityCode extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable=['social_security_code'];

    public function chart_details()
    {
        return $this->hasMany(ChartDetail::class, 'job_social_security_id');
    }
    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }
}
