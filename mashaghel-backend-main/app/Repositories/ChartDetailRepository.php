<?php

namespace App\Repositories;


use App\Http\Resources\ChartCollection;
use App\Http\Resources\ChartDetailResource;
use App\Http\Resources\ChartResource;
use App\Models\Chart;
use App\Models\ChartDetail;

class ChartDetailRepository
{
    private $model;

    public function __construct(ChartDetail $chartDetail)
    {
        $this->model = $chartDetail;
    }

    public function get_all($show_data_options)
    {
        $chart = Chart::query();
        if(isset($show_data_options['company_id'])){
            $chart->where('company_id' , $show_data_options['company_id']);
        }

        return new ChartCollection($chart->paginate($show_data_options['per_page'] ?? 20));
    }

    public function create($data): ChartDetailResource
    {
       return new ChartDetailResource($this->model->create($data));
    }

    public function show($chartDetailId)
    {
        $chartDetail = $this->getById($chartDetailId);
       return new ChartDetailResource($chartDetail);
    }

    public function getById($chartDetailId)
    {
        return $this->model->find($chartDetailId);
    }

    public function update($chartDetailId, $data)
    {
        $chartDetail = $this->getById($chartDetailId);
        $chartDetail->update($data);
        return new ChartDetailResource($chartDetail);
    }

    public function delete($chartDetailId){

        return $this->getById($chartDetailId)->delete();

    }

    public function get_company_use_job($job_id)
    {
        $charts = resolve(JobRepository::class)->getById($job_id)->chart_details->pluck("chart_id")->toArray();
        return resolve(CompanyRepository::class)->get_list_company_by_charts_array($charts);
    }

    public function getChartDetailIdsByChartId($chart_id){

        return $this->model->where('chart_id', $chart_id)->pluck('id')->toArray();

    }

}
