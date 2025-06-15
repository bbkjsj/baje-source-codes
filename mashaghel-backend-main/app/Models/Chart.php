<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Chart extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['title','status','apply_date','description', 'company_id', 'contract_id'];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function contract()
    {
        return $this->belongsTo(Contract::class, 'contract_id');
    }

    public function chart_details()
    {
        return $this->hasMany(ChartDetail::class, 'chart_id');
    }
}
