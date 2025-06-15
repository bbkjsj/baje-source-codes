<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChartRequest extends FormRequest
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
        if($this->route('chart')){
            $this->merge(['chart' => $this->route('chart')]);
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
            'company_id' => 'sometimes|max:255',
            'title' => 'sometimes|max:255',
            'status' => 'sometimes|in:0,1,2,3',
            'apply_date' => 'sometimes|date',
            'order_column' => 'sometimes|max:255|in:id,status,title,apply_date,created_at,updated_at',
            'order_dir' => 'sometimes|max:255|in:asc,desc',
            'per_page' => 'sometimes|integer|min:5',
        ];
        $rules['post'] =[
            'title' => 'required|max:255',
            'apply_date' => 'required|date',
            'company_id' => 'required|integer|exists:company,id',
            'contract_id' => 'sometimes|integer|exists:contract,id',
            'description' => 'sometimes',
            'chart_details.job_social_security_id' => 'required|exists:job_social_security_codes,id',
            'chart_details.count' => 'required|min:1|integer',
            'chart_details.children.*.job_social_security_id' => 'required|exists:job_social_security_codes,id|integer',
            'chart_details.children.*.count' => 'required|integer|min:1',
            'chart_details.children.*' => 'sometimes'
        ];
        $rules['delete'] =[
            'chart' => 'required|integer|exists:charts,id',
        ];
        $rules['put'] =[
            'chart' => 'required|integer|exists:charts,id',
            'description' => 'required',
            'chart_details.job_social_security_id' => 'required|exists:job_social_security_codes,id',
            'chart_details.id' => 'sometimes|exists:chart_details,id',
            'chart_details.count' => 'required|min:1|integer',
            'chart_details.children.*.id' => 'sometimes|exists:chart_details,id|integer',
            'chart_details.children.*.job_social_security_id' => 'required|exists:job_social_security_codes,id|integer',
            'chart_details.children.*.count' => 'required|integer|min:1',
            'chart_details.children.*' => 'sometimes'
        ];

        return  $rules[strtolower($this->method())];
    }
}
