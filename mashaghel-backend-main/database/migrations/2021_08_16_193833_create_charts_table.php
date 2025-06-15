<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChartsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('charts', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('company_id')->nullable();
            $table->foreign('company_id')->references('id')->on('company');
            $table->integer('contract_id')->nullable();
            $table->foreign('contract_id')->references('id')->on('contract');
            $table->string('title');
            $table->date('apply_date');
            $table->tinyInteger('status')->unsigned()->default(0);
            $table->text('description');
            $table->timestamps();
            $table->softDeletes();
        });
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE charts AUTO_INCREMENT = 1000;");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('charts');
    }
}
