<?php

namespace App\Repositories;



use App\Http\Resources\CompanyCollection;
use App\Http\Resources\ContractCollection;
use App\Models\Company;
use App\Models\Contract;

class ContractRepository
{
    private $model;

    public function __construct(Contract $contract)
    {
        $this->model = $contract;
    }

    public function get_all($show_data_options)
    {
        $contracts = $this->model->query();
        if(isset($show_data_options['subject'])){
            $contracts->where('subject' , 'like', '%'.$show_data_options['subject'].'%');
        }

        return new ContractCollection($contracts->paginate($show_data_options['per_page'] ?? 20));
    }

    public function getById($contracts_id)
    {
        return $this->model->findOrFail($contracts_id);
    }

}
