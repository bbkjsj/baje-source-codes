<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChartDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('chart_details', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('chart_id')->unsigned();
            $table->foreign('chart_id')->references('id')->on('charts');
            $table->integer('job_social_security_id')->unsigned();
            $table->foreign('job_social_security_id')->references('id')->on('job_social_security_codes');
            $table->integer('count')->unsigned();
            $table->integer('parent')->unsigned()->nullable();
            $table->foreign('parent')->references('id')->on('chart_details');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('chart_details');
    }
}
