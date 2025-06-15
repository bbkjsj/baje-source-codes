<?php

namespace App\Http\Controllers\Chart;

use App\Http\Controllers\Controller;
use App\Http\Requests\ChartDetailRequest;
use App\Repositories\ChartDetailRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ChartDetailController extends Controller
{

    protected $chartDetailRepo;
    public function __construct(ChartDetailRepository $chartDetailRepo)
    {
        $this->chartDetailRepo = $chartDetailRepo;
    }

    /**
     * Display a listing of the resource.
     *
     * @param ChartDetailRequest $chartDetailRequest
     * @return Response
     */
    public function index(ChartDetailRequest $chartDetailRequest): Response
    {

        $companyList = $this->chartDetailRepo->get_company_use_job($chartDetailRequest->job_id);
        return response(['data' => $companyList,
            'message' => __('messages.data_retrieve')],
            Response::HTTP_OK);

    }
}
