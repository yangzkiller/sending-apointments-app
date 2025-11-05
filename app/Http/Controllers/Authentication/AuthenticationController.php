<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticationController extends Controller
{
    /**
     * Renders the login page for guest users.
     *
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        return Inertia::render('Authentication');
    }

    /**
     * Handles user login.
     *
     * @param Request $request The incoming HTTP request containing email and password.
     * @return \Illuminate\Http\JsonResponse Returns a JSON response with user data or error messages.
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($validated)) {
            return response()->json([
                'message' => 'Credenciais incorretas.',
            ], 401);
        }

        $request->session()->regenerate();

        Auth::logoutOtherDevices($request->password);

        $user = Auth::user();

        return response()->json([
            'message' => 'Login realizado com sucesso.',
            'user' => $user,
        ], 200);
    }

    /**
     * Handles user logout.
     *
     * @param Request $request The incoming HTTP request.
     * @return \Illuminate\Http\JsonResponse Returns a JSON response confirming logout.
     */
    public function logout(Request $request): JsonResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logout realizado com sucesso'], 200);
    }

    /**
     * Renders the home page for auth users.
     *
     * @return \Inertia\Response
     */
    public function home(): Response
    {
        return Inertia::render('Home');
    }
}
