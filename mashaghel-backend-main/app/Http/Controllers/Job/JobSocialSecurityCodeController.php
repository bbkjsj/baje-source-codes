<?php

namespace App\Http\Controllers\Job;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobSocialSecurityCodeRequest;
use App\Repositories\JobRepository;
use Illuminate\Http\Response;

class JobSocialSecurityCodeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    protected $jobRepo;
    public function __construct(JobRepository $jobRepo)
    {
        $this->jobRepo = $jobRepo;
    }

    /**
     * Display a listing of the resource.
     *
     * @param JobSocialSecurityCodeRequest $jobSocialSecurityCodeRequest
     * @return Response
     */
    public function index(JobSocialSecurityCodeRequest $jobSocialSecurityCodeRequest): Response
    {
        //
        $job = $this->jobRepo->getJobSocialSecurityCodes($jobSocialSecurityCodeRequest->input('job_id'));
        return response([ 'data' => $job,
                        'message' => __('messages.data_retrieve')],
                    Response::HTTP_OK);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param JobSocialSecurityCodeRequest $jobSocialSecurityCodeRequest
     * @return Response
     */
    public function store(JobSocialSecurityCodeRequest $jobSocialSecurityCodeRequest): Response
    {

        $this->jobRepo->createJobSocialSecurityCodes($jobSocialSecurityCodeRequest->validated());
        return response(['message' => __('messages.created')], Response::HTTP_CREATED);
    }

}
