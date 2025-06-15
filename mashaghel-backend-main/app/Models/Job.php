<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Job extends Model
{

    use HasFactory, SoftDeletes;
    protected $fillable=['title','status'];

    public $sortable=['title','status', 'created_at', 'updated_at'];

    public function socialSecurityCodes(){

        return $this->hasMany(JobSocialSecurityCode::class, 'job_id');

    }

    public function permissions(){

        return $this->hasMany(JobPermission::class, 'job_id');

    }

    public function chart_details()
    {

        return $this->hasManyThrough(ChartDetail::class, JobSocialSecurityCode::class, 'job_id', 'job_social_security_id')->select('chart_id')->distinct();

    }

}
