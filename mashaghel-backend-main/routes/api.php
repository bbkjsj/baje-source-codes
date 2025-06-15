<?php

use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\Job\JobController;
use \App\Http\Controllers\Job\JobSocialSecurityCodeController;
use \App\Http\Controllers\Job\JobPermissionController;
use \App\Http\Controllers\Job\JobShiftController;
use \App\Http\Controllers\ConstantController;
use \App\Http\Controllers\Personnel\PersonnelJobShiftController;
use \App\Http\Controllers\Personnel\PersonnelInsuranceRateController;
use \App\Http\Controllers\CompanyController;
use \App\Http\Controllers\Chart\ChartController;
use \App\Http\Controllers\Chart\ChartDetailController;
use \App\Http\Controllers\ContractController;
use \App\Http\Controllers\Chart\ChartDetailPersonnelController;
use \App\Http\Controllers\Chart\ChartStatusController;


Route::get('constant', [ConstantController::class,'index']);

Route::prefix('jobs')->name('jobs.')->group(function () {
    Route::apiResource('socialsecuritycodes', JobSocialSecurityCodeController::class);
    Route::apiResource('permissions', JobPermissionController::class);
    Route::apiResource('shifts', JobShiftController::class);
});
Route::apiResource('jobs', JobController::class);

Route::prefix('personnel')->name('personnel.')->group(function () {
    Route::apiResource('shifts', PersonnelJobShiftController::class);
    Route::apiResource('insurance', PersonnelInsuranceRateController::class);
});

Route::get('companies', [CompanyController::class,'index']);

Route::get('contracts', [ContractController::class,'index']);

Route::prefix('charts')->name('charts.')->group(function () {
    Route::get('details', [ChartDetailController::class, 'index']);
    Route::put('status/{chart}', [ChartStatusController::class,'update']);
    Route::prefix('details')->group(function () {
        Route::apiResource('personnel', ChartDetailPersonnelController::class);
    });
});
Route::apiResource('charts', ChartController::class);

Route::get('charts/clone/{chart}', [ChartController::class,'clone']);
