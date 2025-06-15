<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePersonnelJobShiftsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('personnel_job_shifts', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('job_shift_id')->unsigned();
            $table->foreign('job_shift_id')->references('id')->on('job_shifts');
            $table->integer('personnel_id');
            $table->foreign('personnel_id')->references('id')->on('personnel');
            $table->unsignedBigInteger('start_date');
            $table->unsignedBigInteger('apply_date');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('personnel_job_shifts');
    }
}
