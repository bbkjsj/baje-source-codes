<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PersonnelJobShiftRequest extends FormRequest
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
            'personnel_id' => 'required_without:national_number|integer|exists:personnel,id',
            'national_number' => 'required_without:personnel_id|size:10|exists:personnel,national_number',
        ];
        $rules['post'] =[
            'personnel_id' => 'required|integer|exists:personnel,id',
            'job_shift_id' => 'required|integer|exists:job_shifts,id',
            'start_date' => 'required|integer',
            'apply_date' => 'required|integer',
        ];
        $rules['put'] =[
            'shift' => 'required|integer|exists:personnel_job_shifts,id',
            'personnel_id' => 'required|integer|exists:personnel,id',
            'job_shift_id' => 'required|integer|exists:job_shifts,id',
            'start_date' => 'required|integer',
            'apply_date' => 'required|integer',
        ];
        $rules['delete'] =[
            'shift' => 'required|integer|exists:personnel,id',
        ];
        return  $rules[strtolower($this->method())];
    }
}
