<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChartStatusRequest extends FormRequest
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
        return [
            'chart' => 'required|integer|exists:charts,id',
            'status' => 'required|boolean',
        ];
    }
}
