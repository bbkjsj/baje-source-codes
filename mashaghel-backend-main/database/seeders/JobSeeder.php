<?php

namespace Database\Seeders;

use App\Models\Job;
use Illuminate\Database\Seeder;

class JobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Job::create([
            'title' => 'مدیرعامل',
        ]);

        Job::create([
            'title' => 'مدیرپروژه',
        ]);
    }
}
