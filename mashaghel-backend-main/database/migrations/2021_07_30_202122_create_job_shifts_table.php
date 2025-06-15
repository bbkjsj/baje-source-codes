<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateJobShiftsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('job_shifts', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title')->unique();
            $table->boolean('holidays')->default(true);
            $table->boolean('calculate_overtime')->default(true);
            $table->boolean('calculate_holiday_works')->default(true);
            $table->boolean('calculate_friday_works')->default(true);
            $table->boolean('calculate_night_works')->default(true);
            $table->unsignedFloat('vacation_day')->default(true);
            $table->enum('vacation_day_period',['day', 'month', 'week', 'year']);
            $table->boolean('vacation_day_on_holidays')->default(false);
            $table->boolean('status')->default(false);
            $table->text('shift_pattern');
            $table->softDeletes();
            $table->timestamps();
        });

        \Illuminate\Support\Facades\DB::statement("ALTER TABLE job_shifts AUTO_INCREMENT = 100;");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('job_shifts');
    }
}
