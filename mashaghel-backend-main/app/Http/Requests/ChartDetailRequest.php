<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChartDetailRequest extends FormRequest
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
        if($this->route('chartdetail')){
            $this->merge(['chartdetail' => $this->route('chartdetail')]);
        }
        if($this->route('detail')){
            $this->merge(['chartdetail' => $this->route('detail')]);
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
            'chart_id' => 'sometimes|integer|exists:charts,id|min:10000',
            'job_id' => 'sometimes|integer|exists:jobs,id|min:10000',
            'chartdetail' => 'sometimes|integer|exists:chart_details,id',
        ];
        $rules['post'] =[
            'job_social_security_id' => 'required|exists:job_social_security_codes,id|integer',
            'count' => 'required|integer|min:1',
            'chart_id' => 'required|integer|exists:charts,id',
            'parent_id' => 'sometimes|integer|exists:chart_details,id',
        ];
        $rules['delete'] =[
            'chartdetail' => 'required|integer',
        ];
        $rules['put'] =[
            'chartdetail' => 'required|exists:chart_details,id|integer',
            'job_social_security_id' => 'required|exists:job_social_security_codes,id|integer',
            'count' => 'required|integer|min:1',
            'chart_id' => 'required|integer|exists:charts,id',
            'parent_id' => 'sometimes|integer|exists:chart_details,id',
        ];

        return  $rules[strtolower($this->method())];
    }
}
