<?php

namespace App\Http\Controllers\Job;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobPermissionRequest;
use App\Repositories\JobRepository;
use Illuminate\Http\Response;

class JobPermissionController extends Controller
{

    protected $jobRepo;
    public function __construct(JobRepository $jobRepo)
    {
        $this->jobRepo = $jobRepo;
    }

    /**
     * Display a listing of the resource.
     *
     * @param JobPermissionRequest $jobPermissionRequest
     * @return Response
     */
    public function index(JobPermissionRequest $jobPermissionRequest): Response
    {
        $job = $this->jobRepo->getJobPermissions($jobPermissionRequest->input('job_id'));
        return response([ 'data' => $job,
                          'message' => __('messages.data_retrieve')],
                    Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param JobPermissionRequest $jobPermissionRequest
     * @return Response
     */
    public function store(JobPermissionRequest $jobPermissionRequest): Response
    {
        $this->jobRepo->createJobPermission($jobPermissionRequest->validated());
        return response(['message' => __('messages.created')],
                    Response::HTTP_CREATED);
    }

}
