<?php

namespace App\Http\Controllers;


use App\Repositories\CompanyRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CompanyController extends Controller
{

    protected $companyRepo;

    public function __construct(CompanyRepository $companyRepo)
    {
        $this->companyRepo = $companyRepo;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        return response([
            'data' => $this->companyRepo->get_all($request->all()),
            'message' => __('messages.data_retrieve')],
            Response::HTTP_OK);
    }

}
