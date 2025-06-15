<?php

namespace App\Http\Requests;

use App\Rules\NotExist;
use Illuminate\Foundation\Http\FormRequest;

class JobShiftRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    protected function prepareForValidation()
    {

        if($this->route('shift')){
            $this->merge(['shift' => $this->route('shift')]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rules['get'] =[
            'title' => 'sometimes|max:255',
            'status' => 'sometimes|boolean',
            'order_column' => 'sometimes|max:255|in:id,status,title,created_at,updated_at',
            'order_dir' => 'sometimes|max:255|in:asc,desc',
            'per_page' => 'sometimes|integer|min:5',
        ];
        $rules['post'] =[
            'title' => 'required|unique:job_shifts,title|max:255',
            'shift_pattern' => 'required',
            'shift_pattern.*.status' => 'required|in:work,rest',
            'shift_pattern.*.day_count' => 'required|integer|gte:1',
            'shift_pattern.*.start_time' => 'required_if:shift_pattern.*.status,work',
            'shift_pattern.*.end_time' => 'required_if:shift_pattern.*.status,work|gt:shift_pattern.*.start_time',
            'vacation_day' => 'required|numeric|gte:1',
            'vacation_day_period' => 'required|in:year,week,month,day',
            'vacation_day_on_holidays' => 'required|boolean',
            'holidays' => 'required|boolean',
            'calculate_holiday_works' => 'required|boolean',
            'calculate_overtime' => 'required|boolean',
            'calculate_friday_works' => 'required|boolean',
            'calculate_night_works' => 'required|boolean',
        ];
        $rules['put'] =[
            'title' => 'required||max:255|unique:job_shifts,title,'.$this->shift,
            'shift_pattern' => 'required',
            'shift_pattern.*.status' => 'required|in:work,rest',
            'shift_pattern.*.day_count' => 'required|integer|gte:1',
            'shift_pattern.*.start_time' => 'required_if:shift_pattern.*.status,work',
            'shift_pattern.*.end_time' => 'required_if:shift_pattern.*.status,work|gt:shift_pattern.*.start_time',
            'vacation_day' => 'required|numeric|gte:1',
            'vacation_day_period' => 'required|in:year,week,month,day',
            'vacation_day_on_holidays' => 'required|boolean',
            'holidays' => 'required|boolean',
            'status' => 'required|boolean',
            'calculate_overtime' => 'required|boolean',
            'calculate_friday_works' => 'required|boolean',
            'calculate_night_works' => 'required|boolean',
            'calculate_holiday_works' => 'required|boolean',
        ];
        $rules['delete'] =[
            'shift' => ['bail','required','exists:job_shifts,id','integer', new NotExist(['personnel_job_shifts','job_shift_id'])],
        ];


        return  $rules[strtolower($this->method())];

    }
}
