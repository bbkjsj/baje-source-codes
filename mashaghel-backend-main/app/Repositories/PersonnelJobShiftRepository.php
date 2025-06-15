<?php

namespace App\Repositories;


use App\Http\Resources\PersonnelInsuranceRateResource;
use App\Http\Resources\PersonnelJobShiftResource;
use App\Models\PersonnelJobShift;

class PersonnelJobShiftRepository
{
    private $model;

    public function __construct(PersonnelJobShift $personnelJobShiftShift)
    {
        $this->model = $personnelJobShiftShift;
    }

    public function getById($personnelJobShiftId)
    {
        return $this->model->findOrFail($personnelJobShiftId);
    }

    public function create($data)
    {
        return new PersonnelJobShiftResource($this->model->create($data));
    }

    public function update($personnelJobShiftId, $data)
    {
        $personnelJobShift = $this->getById($personnelJobShiftId);
        $personnelJobShift->update($data);
        return new PersonnelJobShiftResource($personnelJobShift);
    }

    public function delete($personnelJobShiftId){

        $personnelJobShift = $this->getById($personnelJobShiftId);
        return $personnelJobShift->delete();

    }

}
