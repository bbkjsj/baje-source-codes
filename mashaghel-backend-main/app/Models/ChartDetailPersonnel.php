<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ChartDetailPersonnel extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['chart_detail_id','personnel_id'];
    protected $table = 'chart_detail_personnel';

    public function chart_detail(){

        return $this->belongsTo(ChartDetail::class);

    }
    public function personnel(){

        return $this->belongsTo(Personnel::class);

    }
}
