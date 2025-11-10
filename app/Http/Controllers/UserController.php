<?php

namespace App\Http\Controllers;

use App\Models\General\Log;
use App\Models\User\User;
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

    /**
     * List all users for admin panel.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        $users = User::with('institution')
            ->orderBy('name')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'active' => $user->active,
                    'institution' => $user->institution ? [
                        'id' => $user->institution->id,
                        'name' => $user->institution->name,
                    ] : null,
                    'created_at' => $user->created_at->format('d/m/Y H:i'),
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $users
        ], 200);
    }

    /**
     * Create a new user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'integer', 'in:0,1,2'],
            'active' => ['required', 'boolean'],
            'id_institution' => ['nullable', 'exists:institutions,id'],
        ]);

        // Only the SENDER (role = 0) can have an institution. Otherwise, id_institution is forced to null.
        if ($validated['role'] !== 0) {
            $validated['id_institution'] = null;
        }

        // Create user with hashed password
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'active' => $validated['active'],
            'id_institution' => $validated['id_institution'],
        ]);

        Log::create([
            'action' => 'create_user',
            'description' => "Admin criou novo usuário {$user->name} (ID: {$user->id}).",
            'id_user' => $request->user()->id,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Usuário criado com sucesso!',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'active' => $user->active,
            ]
        ], 201);
    }

    /**
     * Update a user's information.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $id],
            'password' => ['nullable', 'string', 'min:8'],
            'role' => ['required', 'integer', 'in:0,1,2'],
            'active' => ['required', 'boolean'],
            'id_institution' => ['nullable', 'exists:institutions,id'],
        ]);
        // Update: Only the SENDER (role = 0) can have an institution. Otherwise, id_institution is forced to null.
        if ($validated['role'] !== 0) {
            $validated['id_institution'] = null;
        }

        // Prepare data for update
        $dataToUpdate = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'active' => $validated['active'],
            'id_institution' => $validated['id_institution'],
        ];

        // Only update password if provided
        if (!empty($validated['password'])) {
            $dataToUpdate['password'] = Hash::make($validated['password']);
        }

        $user->update($dataToUpdate);

        Log::create([
            'action' => 'update_user',
            'description' => "Admin atualizou dados do usuário {$user->name} (ID: {$user->id}).",
            'id_user' => $request->user()->id,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Usuário atualizado com sucesso!',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'active' => $user->active,
            ]
        ], 200);
    }
}
