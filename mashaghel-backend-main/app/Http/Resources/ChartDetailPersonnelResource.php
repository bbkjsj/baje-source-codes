<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ChartDetailPersonnelResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'chart_detail' => $this->chart_detail_id,
            'personnel_id' => $this->personnel_id,
            'personnel' => new PersonnelResource($this->whenLoaded('personnel')),
            'created_at' => (string)$this->created_at,
            'updated_at' => (string)$this->updated_at,
        ];
    }
}
