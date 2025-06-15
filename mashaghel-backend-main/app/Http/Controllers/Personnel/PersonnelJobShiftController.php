<?php

namespace App\Http\Controllers\Personnel;

use App\Http\Controllers\Controller;
use App\Http\Requests\PersonnelJobShiftRequest;
use App\Repositories\PersonnelJobShiftRepository;
use App\Repositories\PersonnelRepository;
use Illuminate\Http\Response;

class PersonnelJobShiftController extends Controller
{
    private $personnelJobShiftRepo;

    public function __construct(PersonnelJobShiftRepository $personnelJobShiftRepo)
    {
        $this->personnelJobShiftRepo = $personnelJobShiftRepo;
    }

    /**
     * Display a listing of the resource.
     *
     * @param PersonnelJobShiftRequest $personnelJobShiftRequest
     * @return Response
     */
    public function index(PersonnelJobShiftRequest $personnelJobShiftRequest): Response
    {
        if($personnelJobShiftRequest->national_number){
            $personnel = resolve(PersonnelRepository::class)->getByNationalNumber($personnelJobShiftRequest->national_number);
        }else{
            $personnel = resolve(PersonnelRepository::class)->getByPeronnelId($personnelJobShiftRequest->personnel_id);
        }

        return response(['data' => $personnel,
                'message' => __('messages.received_successfully')],
                Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param PersonnelJobShiftRequest $personnelJobShiftRequest
     * @return Response
     */
    public function store(PersonnelJobShiftRequest $personnelJobShiftRequest): Response
    {

        $personnelJobShift = $this->personnelJobShiftRepo->create($personnelJobShiftRequest->validated());

        return response(['data' => $personnelJobShift,
            'message' => __('messages.created')],
            Response::HTTP_CREATED);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param PersonnelJobShiftRequest $personnelJobShiftRequest
     * @param int $shift
     * @return Response
     */
    public function update(PersonnelJobShiftRequest $personnelJobShiftRequest, int $shift): Response
    {
        $job_shift = $this->personnelJobShiftRepo->update($shift, $personnelJobShiftRequest->validated());
        return response(['data' => $job_shift,
            'message' => __('messages.update_successfully')],
            Response::HTTP_CREATED);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $shift
     * @return Response
     */
    public function destroy(int $shift): Response
    {
        $this->personnelJobShiftRepo->delete($shift);
        return response(['message' => __('messages.delete_successfully')],
            Response::HTTP_OK);
    }
}
