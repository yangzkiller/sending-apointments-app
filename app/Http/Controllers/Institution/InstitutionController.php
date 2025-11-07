<?php

namespace App\Http\Controllers\Institution;

use App\Http\Controllers\Controller;
use App\Models\Institution\Institution;
use Illuminate\Http\JsonResponse;

class InstitutionController extends Controller
{
    /**
     * List all institutions for admin panel.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        $institutions = Institution::withCount('users')
            ->orderBy('name')
            ->get()
            ->map(function ($institution) {
                return [
                    'id' => $institution->id,
                    'name' => $institution->name,
                    'active' => $institution->active,
                    'users_count' => $institution->users_count,
                    'created_at' => $institution->created_at->format('d/m/Y'),
                    'created_at_full' => $institution->created_at->format('d/m/Y H:i:s'),
                    'created_at_timestamp' => $institution->created_at->timestamp,
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $institutions
        ], 200);
    }
}
