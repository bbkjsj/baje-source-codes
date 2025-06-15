<?php

namespace App\Http\Controllers\Job;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobShiftRequest;
use App\Repositories\JobShiftRepository;
use Illuminate\Http\Response;

class JobShiftController extends Controller
{

    protected $jobShiftRepo;
    public function __construct(JobShiftRepository $jobShiftRepo)
    {
        $this->jobShiftRepo = $jobShiftRepo;
    }

    /**
     * Display a listing of the resource.
     *
     * @param JobShiftRequest $jobShiftRequest
     * @return Response
     */
    public function index(JobShiftRequest $jobShiftRequest): Response
    {

        return response(['data' => $this->jobShiftRepo->get_all($jobShiftRequest->validated()),
                        'message' => __('messages.data_retrieve')],
                    Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param JobShiftRequest $jobShiftRequest
     * @return Response
     */
    public function store(JobShiftRequest $jobShiftRequest): Response
    {
        $jobShift = $this->jobShiftRepo->create($jobShiftRequest->validated());
        return response(['data' => $jobShift,
                        'message' => __('messages.created')],
                    Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     *
     * @param int $shift
     * @return Response
     */
    public function show(int $shift): Response
    {
        return response(['data' => $this->jobShiftRepo->show($shift),
                        'message' => __('messages.received_successfully')],
                        Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param JobShiftRequest $jobShiftRequest
     * @param int $shift
     * @return Response
     */
    public function update(JobShiftRequest $jobShiftRequest, int $shift): Response
    {

        $shift = $this->jobShiftRepo->update($shift, $jobShiftRequest->validated());
        return response(['data' => $shift,
                        'message' => __('messages.update_successfully')],
                        Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $shift
     * @return Response
     */
    public function destroy(JobShiftRequest $jobShiftRequest, int $shift): Response
    {

        $this->jobShiftRepo->delete($shift);
        return response(['message' => __('messages.delete_successfully')],
                    Response::HTTP_OK);
    }
}
