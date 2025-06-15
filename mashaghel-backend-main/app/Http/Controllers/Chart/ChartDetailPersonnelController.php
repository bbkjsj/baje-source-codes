<?php

namespace App\Http\Controllers\Chart;

use App\Http\Controllers\Controller;
use App\Http\Requests\ChartDetailPersonnelRequest;
use App\Repositories\ChartDetailPersonnelRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ChartDetailPersonnelController extends Controller
{

    protected $chartDetailPersonnelRepo;
    public function __construct(ChartDetailPersonnelRepository $chartDetailPersonnelRepo)
    {
        $this->chartDetailPersonnelRepo = $chartDetailPersonnelRepo;
    }
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(): Response
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param ChartDetailPersonnelRequest $chartDetailPersonnelRequest
     * @return Response
     */
    public function store(ChartDetailPersonnelRequest $chartDetailPersonnelRequest): Response
    {
        $checkAvailabilty = $this->chartDetailPersonnelRepo->checkJobAvailability($chartDetailPersonnelRequest->chart_detail_id);
        if(!$checkAvailabilty){
            return response(['message' => __('messages.job_unavailability')],
                Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $chartDetailPersonnel = $this->chartDetailPersonnelRepo->create($chartDetailPersonnelRequest->validated());
        return response(['chartDetailPersonnel' => $chartDetailPersonnel,
            'message' => __('messages.created')],
            Response::HTTP_CREATED);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ChartDetailPersonnelRequest $chartDetailPersonnelRequest
     * @param int $personnel
     * @return Response
     */
    public function destroy(ChartDetailPersonnelRequest $chartDetailPersonnelRequest, int $personnel): Response
    {
        $this->chartDetailPersonnelRepo->delete($personnel);
        return response(['message' => __('messages.delete_successfully')],
            Response::HTTP_OK);

    }
}
