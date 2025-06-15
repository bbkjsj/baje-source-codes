<?php

namespace Tests\Feature;

use App\Models\Job;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use phpseclib3\File\ASN1\Maps\Attribute;
use phpseclib3\File\ASN1\Maps\Attributes;
use Tests\TestCase;

class JobTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function test_non_authenticated_users_cannot_access_the_following_endpoints_for_the_jobs_api()
    {
        $index = $this->json('GET', '/api/jobs');
        $index->assertStatus(401);

        $store = $this->json('POST', '/api/jobs');
        $store->assertStatus(401);

        $show = $this->json('GET', '/api/jobs/1');
        $show->assertStatus(401);

        $update = $this->json('PUT', '/api/jobs/1');
        $update->assertStatus(401);

        $destroy = $this->json('DELETE', '/api/jobs/1');
        $destroy->assertStatus(401);
    }

    public function test_can_get_paginated_list_of_all_jobs()
    {
        Job::factory()->count(25)->create();
        $response = $this->get(route('jobs.index'));
        $response->assertSuccessful();
        $response->assertJsonStructure([
            'data' => [
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'status',
                        'created_at',
                        'updated_at',
                    ]
                ],
                'pagination' => [
                    'total',
                    'count',
                    'per_page',
                    'current_page',
                    'total_pages',
                ]
            ],
        ]);
    }

    public function test_can_create_an_job()
    {

        $job = Job::factory()->make([
            'status' => false
        ]);

        $response = $this->post(route('jobs.store'), [
            'title' => $job->title,
        ]);

        $response->assertSuccessful();
        $this->assertDatabaseHas('jobs', [
            'title' => $job->title,
            'status' => 0
        ]);
    }

    public function test_will_fail_with_validation_errors_when_creating_a_job_with_wrong_inputs()
    {

        $response = $this->post(route('jobs.store'));

        $response->assertStatus(422)
            ->assertExactJson([
                'message' => __('messages.validation_error'),
                'error' => [
                    'title' => [
                        __('validation.required', ['attribute'=> __('validation.attributes.title')])
                    ],
                ]
            ]);

    }

    public function test_can_get_a_single_job()
    {
        $job = Job::factory()->create();
        $response = $this->get(route('jobs.show', $job->id));
        $response->assertSuccessful();
        $response->assertJson([
            'data' => [
                'id' => $job->id,
                'title' => $job->title,
                'status' => $job->status ? '1' : '0',
                'created_at' => (string)$job->created_at,
                'updated_at' => (string)$job->updated_at,
            ],
            "message" => __('messages.data_retrieve')
        ]);
    }

    public function test_can_not_get_a_single_job()
    {
        $response = $this->get('api/jobs/1');
        $response->assertStatus(404)->assertJson([
            "message" => __('messages.not_found')
        ]);
    }

    public function test_can_update_an_job()
    {
        $job = Job::factory()->create();

        $response = $this->patch(route('jobs.update', $job->id), [
            'title' => $title = $this->faker->title,
            'status' => $status = false,
        ]);

        $response->assertSuccessful();
        $this->assertDatabaseHas('jobs', [
            'id' => $job->id,
            'title' => $title,
            'status' => '0',
            'created_at' => (string)$job->created_at,
            'updated_at' => (string)$job->updated_at,
        ]);
    }

    public function test_can_delete_an_job()
    {
        $job = Job::factory()->create();
        $response = $this->delete(route('jobs.destroy', $job->id));
        $response->assertSuccessful();
        $this->assertSoftDeleted('jobs', [
            'id' => $job->id
        ]);
    }


}
