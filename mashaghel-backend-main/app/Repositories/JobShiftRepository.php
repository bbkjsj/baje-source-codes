<?php

namespace App\Repositories;


use App\Http\Resources\JobResource;
use App\Http\Resources\JobShiftCollection;
use App\Http\Resources\JobShiftResource;
use App\Models\JobShift;

class JobShiftRepository
{
    private $model;

    public function __construct(JobShift $jobShiftShift)
    {
        $this->model = $jobShiftShift;
    }

    public function get_all($show_data_options)
    {
        $jobShift = JobShift::query();
        if(isset($show_data_options['title'])){
            $jobShift->where('title' , 'like', '%'.$show_data_options['title'].'%');
        }
        if(isset($show_data_options['status'])){
            $jobShift->where('status' ,$show_data_options['status']);
        }

        $order_dir = $show_data_options['order_dir'] ?? 'asc';
        $order_column = $show_data_options['order_column'] ?? 'id';
        $jobShift->orderBy($order_column, $order_dir);

        return new JobShiftCollection($jobShift->paginate($show_data_options['per_page']?? 10));
    }

    public function create($data)
    {
        return  new JobShiftResource($this->model->create($data));
    }

    public function getById($jobShiftId)
    {
        return $this->model->findOrFail($jobShiftId);
    }

    public function show($jobShift_id)
    {
        $jobShift = $this->getById($jobShift_id);
        return new JobShiftResource($jobShift);
    }

    public function update($jobShiftId, $data)
    {
        $jobShift = $this->getById($jobShiftId);
        $jobShift->update($data);
        return new JobShiftResource($jobShift);
    }

    public function delete($jobShiftId){
        $jobShift = $this->getById($jobShiftId);
        return $jobShift->delete();
    }
}
