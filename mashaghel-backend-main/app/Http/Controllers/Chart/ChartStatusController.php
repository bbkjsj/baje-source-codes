<?php

namespace App\Http\Controllers\Chart;

use App\Http\Controllers\Controller;
use App\Http\Requests\ChartStatusRequest;
use App\Repositories\ChartRepository;
use Illuminate\Http\Response;

class ChartStatusController extends Controller
{

    protected $chartRepo;

    public function __construct(ChartRepository $chartRepo)
    {
        $this->chartRepo = $chartRepo;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param ChartStatusRequest $chartStatusRequest
     * @param int $chart
     * @return Response
     */
    public function update(ChartStatusRequest $chartStatusRequest, int $chart): Response
    {
        return response(['data' => $this->chartRepo->updateStatus($chart, $chartStatusRequest->validated()),
            'message' => __('messages.update_successfully')],
            Response::HTTP_OK);
    }

}
