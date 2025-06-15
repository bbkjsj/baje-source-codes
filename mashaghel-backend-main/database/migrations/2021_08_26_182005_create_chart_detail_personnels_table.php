<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChartDetailPersonnelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('chart_detail_personnel', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('chart_detail_id')->unsigned();
            $table->foreign('chart_detail_id')->references('id')->on('chart_details');
            $table->integer('personnel_id');
            $table->foreign('personnel_id')->references('id')->on('personnel');
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
        Schema::dropIfExists('chart_detail_personnels');
    }
}
