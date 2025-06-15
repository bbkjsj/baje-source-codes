<?php

namespace App\Http\Requests;

use App\Rules\NotExist;
use Illuminate\Foundation\Http\FormRequest;

class JobSocialSecurityCodeRequest extends FormRequest
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
        if($this->route('socialsecuritycode')){
            $this->merge(['socialsecuritycode' => $this->route('socialsecuritycode')]);
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
            'codes' => 'required|array',
            'codes.*' => 'digits_between:0,9999999',
            'job_id' => 'required|exists:jobs,id',
        ];

        return  $rules[strtolower($this->method())];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'code.digits_between' => 'کد نامعتبر است',
        ];
    }
}
