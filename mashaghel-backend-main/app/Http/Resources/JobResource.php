<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\JobSocialSecurityCodeResource;

class JobResource extends JsonResource
{
    /**
     * @var mixed
     */

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
            'title' => $this->title,
            'status' => $this->status ?? 0,
            'socialSecurityCodes' => JobSocialSecurityCodeResource::collection($this->whenLoaded('socialSecurityCodes')),
            'permissions' => JobPermissionResource::collection($this->whenLoaded('permissions')),
            'created_at' => (string)$this->created_at,
            'updated_at' => (string)$this->updated_at,
        ];
    }
}
