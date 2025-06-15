<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class JobShiftResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @param $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'holidays' => $this->holidays,
            'shift_pattern' => $this->shift_pattern,
            'calculate_overtime' => $this->calculate_overtime,
            'calculate_holiday_works' => $this->calculate_holiday_works,
            'calculate_friday_works' => $this->calculate_friday_works,
            'calculate_night_works' => $this->calculate_night_works,
            'vacation_day' => $this->vacation_day,
            'vacation_day_period' => $this->vacation_day_period,
            'vacation_day_on_holidays' => $this->vacation_day_on_holidays,
            'status' => $this->status ?? 0,
            'is_removable' => count($this->personnelJobShifts) == 0,
            'created_at' => (string)$this->created_at,
            'updated_at' => (string)$this->updated_at,
        ];
    }
}
