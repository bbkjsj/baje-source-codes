<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class ForceContentTypeJson
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
        if (!$request->isMethod('post')) return $next($request);

        $header = $request->header('Content-type');
        if (!Str::contains($header, 'application/json')) {
            return response(['message' => __('messages.bad_request')], Response::HTTP_BAD_REQUEST);
        }

        return $next($request);
    }
}
