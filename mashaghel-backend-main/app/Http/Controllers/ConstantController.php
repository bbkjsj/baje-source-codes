<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;

class ConstantController extends Controller
{
    //
    public function index(){

        $file = Storage::get('constant.json');
        return json_decode($file, true);

    }
}
