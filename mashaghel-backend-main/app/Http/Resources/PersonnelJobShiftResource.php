<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PersonnelJobShiftResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @param $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'job_shift_id' => $this->job_shift_id,
            'job_shift' => new JobShiftResource($this->whenLoaded('JobShift')),
            'personnel_id' => $this->personnel_id,
            'start_date' => $this->start_date,
            'apply_date' => $this->apply_date,
            'created_at' => (string)$this->created_at,
            'updated_at' => (string)$this->updated_at,
        ];
    }
}
