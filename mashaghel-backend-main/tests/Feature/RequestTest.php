<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\Response;
use Tests\TestCase;

class RequestTest extends TestCase
{
    public $response;

    function __construct()
    {
        $this->response = new Response();
    }

    public function test_check_authorization()
    {
        $this->call('POST', '/api/jobs',[],[], ['HTTP_Authorization' => 'content']);

        $this->assertEquals(403,$this->response->getStatusCode());
    }
}
