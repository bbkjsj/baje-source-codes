<?php

namespace App\Repositories;


use App\Http\Resources\PersonnelResource;
use App\Models\Personnel;

class PersonnelRepository
{
    private $model;

    public function __construct(Personnel $personnel)
    {
        $this->model = $personnel;
    }

    public function getByPeronnelId($personnelId)
    {
        return new PersonnelResource($this->model->with('PersonnelJobShifts.JobShift')->findOrFail($personnelId));
    }

    public function getByNationalNumber($national_number)
    {
        return new PersonnelResource($this->model->where('national_number', $national_number)->with('PersonnelJobShifts.JobShift')->first());
    }

}
