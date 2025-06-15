<?php

namespace App\Http\Controllers;

use App\Repositories\ContractRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ContractController extends Controller
{

    protected $contractRepo;

    public function __construct(ContractRepository $contractRepo)
    {
        $this->contractRepo = $contractRepo;
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
            'data' => $this->contractRepo->get_all($request->all()),
            'message' => __('messages.data_retrieve')],
            Response::HTTP_OK);
    }

}
