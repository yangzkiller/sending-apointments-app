<?php

namespace App\Http\Controllers\Institution;

use App\Http\Controllers\Controller;
use App\Models\Institution\Institution;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

    /**
     * Create a new institution.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(): JsonResponse
    {
        $validated = request()->validate([
            'name' => 'required|string|max:255|unique:institutions,name',
        ]);

        $institution = Institution::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Instituição criada com sucesso',
            'data' => $institution
        ], 201);
    }

    /**
     * Update an institution.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update($id): JsonResponse
    {
        $institution = Institution::findOrFail($id);

        $validated = request()->validate([
            'name' => 'required|string|max:255|unique:institutions,name,' . $id,
            'active' => 'required|boolean',
        ]);

        $institution->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Instituição atualizada com sucesso',
            'data' => $institution
        ], 200);
    }
}
