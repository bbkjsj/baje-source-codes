<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\JobSocialSecurityCodeResource;

class ChartDetailResource extends JsonResource
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
            'job_social_security_id' => (int) $this->job_social_security_id,
            'chart_id' =>(int) $this->chart_id,
            'is_root' => $this->parent === null ? true : false,
            'parent' => $this->parent,
            'count' => (int) $this->count,
            'created_at' => (string)$this->created_at,
            'updated_at' => (string)$this->updated_at,
            'socialSecurityCode' => new JobSocialSecurityCodeResource($this->whenLoaded('job_social_security')),
            'personnel' => PersonnelResource::collection($this->whenLoaded('personnel')),
            'children' => $this->children
        ];
    }
}
