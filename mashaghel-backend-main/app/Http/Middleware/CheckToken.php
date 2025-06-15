<?php

namespace App\Http\Middleware;

use Closure;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\BadResponseException;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\Request;

class CheckToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {

        try {
            $token = $request->header('Authorization');
            if (!$token) {
                return response(['message' => __('messages.server_error')], 401);
            }
            $client = new Client(["base_uri" => config('app.remote_site_authenticate')]);
            $options = [
                'json' => [
                    "token" => $token
                ]
            ];
            $response = $client->post("api/microservice/verify", $options);
            if ($response->getStatusCode() == 200) {
                return $next($request);
            }
        }catch (BadResponseException $e){

            return response(['message' => __('messages.server_error')], 401);

        }

    }
}
