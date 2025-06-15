<?php

namespace App\Repositories;



use App\Http\Resources\CompanyCollection;
use App\Models\Company;

class CompanyRepository
{
    private $model;

    public function __construct(Company $company)
    {
        $this->model = $company;
    }

    public function get_all($show_data_options)
    {
        $company = $this->model->query();
        if(isset($show_data_options['name'])){
            $company->where('name' , 'like', '%'.$show_data_options['name'].'%');
        }

        return new CompanyCollection($company->paginate($show_data_options['per_page'] ?? 20));
    }

    public function getById($company_id)
    {
        return $this->model->findOrFail($company_id);
    }

    public function get_list_company_by_charts_array(array $charts)
    {
        return $this->model->whereHas('charts', function($query) use ($charts) {
            $query->whereIn('id', $charts);
        })->get(['id', 'name']);
    }

}
