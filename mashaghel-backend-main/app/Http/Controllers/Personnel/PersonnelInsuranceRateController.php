<?php

namespace App\Http\Controllers\Personnel;

use App\Http\Controllers\Controller;
use App\Http\Requests\PersonnelInsuranceRateRequest;
use App\Repositories\JobRepository;
use App\Repositories\PersonnelInsuranceRateRepository;
use Illuminate\Http\Response;

class PersonnelInsuranceRateController extends Controller
{

    protected $personnelInsuranceRateRepo;

    public function __construct(PersonnelInsuranceRateRepository $personnelInsuranceRateRepo)
    {
        $this->personnelInsuranceRateRepo = $personnelInsuranceRateRepo;
    }
    /**
     * Display a listing of the resource.
     *
     * @param PersonnelInsuranceRateRequest $personnelInsuranceRequest
     * @return Response
     */
    public function index(PersonnelInsuranceRateRequest $personnelInsuranceRequest): Response
    {
        //
        return response([
            'data' => $this->personnelInsuranceRateRepo->get($personnelInsuranceRequest->personnel_id),
            'message' => __('messages.data_retrieve')],
            Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param PersonnelInsuranceRateRequest $personnelInsuranceRequest
     * @return Response
     */
    public function store(PersonnelInsuranceRateRequest $personnelInsuranceRequest): Response
    {
        $personnelInsuranceRate = $this->personnelInsuranceRateRepo->create($personnelInsuranceRequest->validated());
        return response(['data' => $personnelInsuranceRate,
            'message' => __('messages.created')],
            Response::HTTP_CREATED);
    }

}
