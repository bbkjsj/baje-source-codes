<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ChartDetail extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['job_social_security_id','count','chart_id','parent'];

    public function chart(){

        return $this->belongsTo(Chart::class);

    }

    public function job_social_security()
    {
        return $this->belongsTo(JobSocialSecurityCode::class, 'job_social_security_id');
    }

    public function personnel()
    {
        return $this->belongsToMany(Personnel::class, 'chart_detail_personnel', 'chart_detail_id','personnel_id')->withTimestamps();
    }
}
