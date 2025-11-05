<?php

namespace App\Http\Controllers\Institution;

use App\Http\Controllers\Controller;
use App\Models\Institution\Institution;
use Illuminate\Http\Request;

class InstitutionController extends Controller
{
    public function getAll(Request $request)
    {
        // 👇 aqui faltava o ponto e vírgula
        $institutions = Institution::all();

        return response()->json([
            'data' => $institutions,
        ], 200);
    }
}
