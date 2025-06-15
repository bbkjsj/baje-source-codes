<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JobRequest extends FormRequest
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
        if($this->route('job')){
            $this->merge(['job' => $this->route('job')]);
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
            'title' => 'required|unique:jobs,title|max:255'
        ];
        $rules['delete'] =[
            'job' => 'required|integer',
        ];
        $rules['put'] =[
            'job' => 'required|integer',
            'title' => 'required|unique:jobs,title,'.$this->job.'|max:255',
            'status' => 'sometimes|boolean',
        ];

        return  $rules[strtolower($this->method())];

    }
}
