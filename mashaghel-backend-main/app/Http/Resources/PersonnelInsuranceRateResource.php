<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PersonnelInsuranceRateResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'personnel_id' => (int) $this->personnel_id_fk,
            'insured_rate' => (float) $this->insured_rate,
            'hard_job_rate' => (float) $this->hard_job_rate,
            'employer_rate' => (float) $this->employer_rate,
            'jobless_rate' => (float) $this->jobless_rate,
        ];
    }
}
