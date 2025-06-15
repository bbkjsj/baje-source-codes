<?php

namespace App\Repositories;


use App\Http\Resources\PersonnelInsuranceRateResource;
use App\Models\PersonnelInsuranceRate;

class PersonnelInsuranceRateRepository
{
    private $model;

    public function __construct(PersonnelInsuranceRate $personnelInsuranceRate)
    {
        $this->model = $personnelInsuranceRate;
    }

    public function get($personnelId)
    {
        return new PersonnelInsuranceRateResource($this->model->where('personnel_id_fk', $personnelId)->first());
    }

    public function create($data)
    {
        $personnel_insurance_rate = $this->model->updateOrCreate(
            [
                'personnel_id_fk' =>  $data['personnel_id']
            ],
            [
                'insured_rate' => $data['insured_rate'],
                'hard_job_rate' => $data['hard_job_rate'],
                'employer_rate' => $data['employer_rate'],
                'jobless_rate' => $data['jobless_rate']
            ]
        );
        return new PersonnelInsuranceRateResource($personnel_insurance_rate);
    }

}
