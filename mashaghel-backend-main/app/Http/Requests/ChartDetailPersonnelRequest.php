<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChartDetailPersonnelRequest extends FormRequest
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
        if($this->route('personnel')){
            $this->merge(['personnel' => $this->route('personnel')]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rules['post'] =[
            'personnel_id' => 'required|exists:personnel,id|unique:chart_detail_personnel,personnel_id,NULL,id,chart_detail_id,'.$this->input('chart_detail_id'),
            'chart_detail_id' => 'required|integer|exists:chart_details,id',
        ];
        $rules['delete'] =[
            'personnel' => 'required|exists:chart_detail_personnel,id|integer',
        ];

        return  $rules[strtolower($this->method())];
    }
}
