<?php

namespace App\Repositories;


use App\Http\Resources\JobCollection;
use App\Http\Resources\JobResource;
use App\Models\Job;
use App\Models\JobPermission;
use App\Models\JobSocialSecurityCode;
use function PHPUnit\Framework\isEmpty;

class JobRepository
{
    private $model;

    public function __construct(Job $job)
    {
        $this->model = $job;
    }

    public function get_all($show_data_options)
    {
        $job = Job::query();
        if (isset($show_data_options['title'])) {
            $job->where('title', 'like', '%' . $show_data_options['title'] . '%');
        }
        if (isset($show_data_options['status'])) {
            $job->where('status', $show_data_options['status']);
        }

        $order_dir = $show_data_options['order_dir'] ?? 'asc';
        $order_column = $show_data_options['order_column'] ?? 'id';
        $job->orderBy($order_column, $order_dir);

        return new JobCollection($job->paginate($show_data_options['per_page'] ?? 10));
    }

    public function create($data)
    {
        return new JobResource($this->model->create($data));
    }

    public function show($jobId)
    {
        $job = $this->model->with(['socialSecurityCodes', 'permissions'])->findOrFail($jobId);
        return new JobResource($job);
    }

    public function getById($jobId)
    {
        return $this->model->findOrFail($jobId);
    }

    public function update($jobId, $data)
    {
        $job = $this->getById($jobId);
        $job->update($data);
        return new JobResource($job);
    }

    public function delete($job)
    {

        return $job->delete();

    }

    // job social security Code

    public function getJobSocialSecurityCodes($jobId): JobResource
    {
        $job = $this->model->with('socialSecurityCodes')->findOrFail($jobId);
        return new JobResource($job);
    }

    public function createJobSocialSecurityCodes($data)
    {


        $job = Job::findOrFail($data['job_id']);
        $job->socialSecurityCodes()->delete();

        $data['codes'] = array_unique($data['codes']);

        $social_security_codes = [];
        foreach ($data['codes'] as $social_security_code) {
            $social_security_codes[] = ['social_security_code' => $social_security_code];
        }
        $job->socialSecurityCodes()->createMany($social_security_codes);
        return $job;
    }

    // job  Permission

    public function getJobPermissions($jobId): JobResource
    {
        $job = Job::where('id', $jobId)->with('permissions')->firstOrFail();
        return new JobResource($job);
    }

    public function createJobPermission($data)
    {

        $job = Job::findOrFail($data['job_id']);
        $job->permissions()->delete();
        $data['permissions'] = array_unique($data['permissions']);
        $permissions = [];
        foreach ($data['permissions'] as $permission) {
                $permissions[] = ['permission' => $permission];
        }
        $job->permissions()->createMany($permissions);
        return $job;
    }

}
