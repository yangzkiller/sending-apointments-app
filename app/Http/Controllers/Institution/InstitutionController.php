<?php

namespace App\Http\Controllers\Institution;

use App\Http\Controllers\Controller;
use App\Models\Institution\Institution;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InstitutionController extends Controller
{
    /**
     * Retrieve all institutions with their related spreadsheets (excluding those with status 0).
     *
     * For each institution, this method:
     * - Loads all spreadsheets that have a status different from 0.
     * - Checks if all spreadsheets are completed (status 2); if so, updates the institution's status to 2.
     * - Transforms each spreadsheet to include the user name and removes the user relation from the response.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function all(): JsonResponse
    {
        $institutions = Institution::with(['spreadsheets' => function ($query) {
            $query->where('status', '!=', 0)->with('user');
        }])->get();


        $institutions->each(function ($institution) {
            $totalSheets = $institution->spreadsheets->count();
            $completedSheets = $institution->spreadsheets->where('status', 2)->count();

            if (
                $totalSheets > 0 &&
                $completedSheets === $totalSheets &&
                (int)$institution->status === 1
            ) {
                $institution->update(['status' => 2]);
            }

            $institution->spreadsheets->transform(function ($sheet) {
                $sheet->user_name = $sheet->user?->name;
                unset($sheet->user);
                return $sheet;
            });
        });

        return response()->json([
            'data' => $institutions,
        ], 200);
    }

    /**
     * Update the status of a specific institution.
     *
     * This method receives an institution ID and a new status value from the request,
     * updates the institution's status accordingly, and if the new status is 0 (FINALIZED),
     * it also updates all related spreadsheets to have status 0.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateStatus(Request $request, $id): JsonResponse
    {
        $institution = Institution::findOrFail($id);
        $newStatus = (int) $request->input('status');

        $institution->update(['status' => $newStatus]);

        if ($newStatus === 0) {
            $institution->spreadsheets()->update(['status' => 0]);
        }

        return response()->json([
            'message' => 'Status atualizado com sucesso',
            'institution' => $institution,
        ], 200);
    }
}
