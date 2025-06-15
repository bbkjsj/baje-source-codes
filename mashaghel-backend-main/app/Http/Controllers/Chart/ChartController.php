<?php

namespace App\Http\Controllers\Chart;

use App\Http\Controllers\Controller;
use App\Http\Requests\ChartRequest;
use App\Models\Chart;
use App\Repositories\ChartDetailRepository;
use App\Repositories\ChartRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ChartController extends Controller
{
    protected $chartRepo;
    public function __construct(ChartRepository $chartRepo)
    {
        $this->chartRepo = $chartRepo;
    }

    /**
     * Display a listing of the resource.
     *
     * @param ChartRequest $chartRequest
     * @return Response
     */
    public function index(ChartRequest $chartRequest): Response
    {
        return response([
            'data' => $this->chartRepo->get_all($chartRequest->validated()),
            'message' => __('messages.data_retrieve')],
            Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param ChartRequest $chartRequest
     * @return Response
     */
    public function store(ChartRequest $chartRequest): Response
    {
        $this->chartRepo->create($chartRequest->validated());
        return response(['message' => __('messages.created')],
            Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     *
     * @param  $chart
     * @return Response
     */
    public function show(int $chart): Response
    {
        return response(['data' => $this->chartRepo->show($chart),
            'message' => __('messages.received_successfully')],
            Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param ChartRequest $chartRequest
     * @param int $chart
     * @return Response
     * @throws \Illuminate\Validation\ValidationException
     */
    public function update(ChartRequest $chartRequest, int $chart): Response
    {
        $this->chartRepo->update($chart, $chartRequest->validated());
        return response(['message' => __('messages.update_successfully')],
            Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $chart
     * @return Response
     */
    public function destroy(int $chart): Response
    {
        if(!$this->chartRepo->delete($chart)){
            return response(['message' => __('messages.delete_approved_chart_bad_request')],
            Response::HTTP_BAD_REQUEST);
        };
        return response(['message' => __('messages.delete_successfully')],
            Response::HTTP_OK);
    }

    public function clone(int $chart): Response
    {
        $clone_chart = $this->chartRepo->clone($chart);
        if(!$clone_chart){
            return response(['message' => __('messages.clone_not_approved_chart_bad_request')],
                Response::HTTP_BAD_REQUEST);
        };
        return response(['data' => $clone_chart ,
            'message' => __('messages.received_successfully')],
            Response::HTTP_OK);
    }
}
