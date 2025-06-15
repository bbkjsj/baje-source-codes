<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JobPermissionRequest extends FormRequest
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
        if($this->route('permission')){
            $this->merge(['permission' => $this->route('permission')]);
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
            'job_id' => 'required|integer|exists:jobs,id',
        ];
        $rules['post'] =[
            'permissions' => 'required|array',
            'job_id' => 'required|exists:jobs,id',
        ];

        return  $rules[strtolower($this->method())];
    }
}
