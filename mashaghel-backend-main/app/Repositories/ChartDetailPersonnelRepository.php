<?php

namespace App\Repositories;

use App\Http\Resources\ChartDetailPersonnelResource;
use App\Models\ChartDetailPersonnel;

class ChartDetailPersonnelRepository
{
    private $model;

    public function __construct(ChartDetailPersonnel $chartDetailPersonnel)
    {
        $this->model = $chartDetailPersonnel;
    }

    public function create($data): ChartDetailPersonnelResource
    {
       return new ChartDetailPersonnelResource($this->model->create($data));
    }

    public function checkJobAvailability($chart_detail_id){
        $chart_detail = resolve(ChartDetailRepository::class)->getById($chart_detail_id);
        if(!$chart_detail){
            return false;
        }
        if($chart_detail->count > count($chart_detail->personnel)){
            return true;
        }
        return false;
    }
    public function delete($chartDetailPersonnelId){

        return $this->model->findOrFail($chartDetailPersonnelId)->delete();

    }

}
