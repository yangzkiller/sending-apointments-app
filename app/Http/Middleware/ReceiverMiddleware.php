<?php

namespace App\Http\Middleware;

use App\Enums\Roles;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ReceiverMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || $user->role !== Roles::RECEIVER->value) {
            return response()->json([
                'message' => 'Acesso negado. Apenas destinatários podem acessar este recurso.',
            ], 403);
        }

        return $next($request);
    }
}
