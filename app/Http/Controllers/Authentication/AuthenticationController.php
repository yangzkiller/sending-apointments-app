<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Controllers\Controller;
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


    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([], 401);
        }

        $user = Auth::user();

        return response()->json($user, 200);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logout realizado com sucesso']);
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
