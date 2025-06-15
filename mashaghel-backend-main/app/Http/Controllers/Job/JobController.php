<?php

namespace App\Http\Controllers\Job;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobRequest;
use App\Repositories\JobRepository;
use Illuminate\Http\Response;

class JobController extends Controller
{

    protected $jobRepo;

    public function __construct(JobRepository $jobRepo)
    {
        $this->jobRepo = $jobRepo;
    }

    /**
     * Display a listing of the resource.
     *
     * @param JobRequest $jobRequest
     * @return Response
     */
    public function index(JobRequest $jobRequest): Response
    {
        return response([
            'data' => $this->jobRepo->get_all($jobRequest->validated()),
            'message' => __('messages.data_retrieve')],
            Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param JobRequest $jobRequest
     * @return Response
     */
    public function store(JobRequest $jobRequest): Response
    {

        $job = $this->jobRepo->create($jobRequest->validated());
        return response(['data' => $job,
                        'message' => __('messages.created')],
                        Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     *
     * @param $job
     * @param JobRequest $jobRequest
     * @return Response
     */
    public function show(JobRequest $jobRequest, int $job): Response
    {
        return response(['data' => $this->jobRepo->show($job),
                        'message' => __('messages.received_successfully')],
                    Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param JobRequest $jobRequest
     * @param   $job
     * @return Response
     */
    public function update(JobRequest $jobRequest, $job): Response
    {
        return response(['data' => $this->jobRepo->update($job, $jobRequest->validated()),
                        'message' => __('messages.update_successfully')],
                    Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param JobRequest $jobRequest
     * @param  $job
     * @return Response
     */
    public function destroy(JobRequest $jobRequest, $job): Response
    {
        $target_job = $this->jobRepo->getById($job);
        if($target_job->chart_details()->exists()){
            return response(['message' => __('messages.delete_jobs_unsuccessfully')],
                Response::HTTP_BAD_REQUEST);
        }
        $this->jobRepo->delete($target_job);
        return response(['message' => __('messages.delete_successfully')],
                    Response::HTTP_OK);
    }
}
