<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PersonnelInsuranceRateRequest extends FormRequest
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

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rules['get'] =[
            'personnel_id' => 'required|integer|exists:personnel,id',
        ];
        $rules['post'] =[
            'personnel_id' => 'required|integer|exists:personnel,id',
            'insured_rate' => 'required|numeric|between:0,99.99',
            'employer_rate' => 'required|numeric|between:0,99.99',
            'jobless_rate' => 'required|numeric|between:0,99.99',
            'hard_job_rate' => 'required|numeric|between:0,99.99',
        ];

        return  $rules[strtolower($this->method())];
    }
}
