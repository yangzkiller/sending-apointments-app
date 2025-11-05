<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\General\Log;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Changes the authenticated user's password after verifying current password.
     *
     * @param Request $request The incoming HTTP request containing current and new password.
     * @return \Illuminate\Http\JsonResponse Returns a JSON response indicating if password was changed.
     */
    public function changePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Senha atual incorreta.',
                'errors' => [
                    'current_password' => ['Senha atual incorreta.']
                ]
            ], 422);
        }

        $user->update(['password' => Hash::make($validated['password'])]);

        Log::create([
            'action' => 'change_password',
            'description' => "Usuário {$user->name} ({$user->email}) alterou sua senha.",
            'id_user' => $user->id,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Senha alterada com sucesso!'
        ], 200);
    }
}
