<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ChartResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'status' => $this->status ?? 0,
            'apply_date' => $this->apply_date,
            'description' => $this->description,
            'created_at' => (string)$this->created_at,
            'updated_at' => (string)$this->updated_at,
            'company' => new CompanyResource($this->whenLoaded('company')),
            'contract' => new ContractResource($this->whenLoaded('contract')),
            'chart_details' => ChartDetailResource::collection($this->whenLoaded('chart_details')),
        ];
    }
}
