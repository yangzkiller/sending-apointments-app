<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class SessionTimeout
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $timeout = 1800; //30 min

        if (Auth::check()) {
            $lastActivity = session('lastActivityTime');
            $currentTime = time();

            if ($lastActivity && ($currentTime - $lastActivity > $timeout)) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return response()->json([
                    'message' => 'Sessão expirada por inatividade.'
                ], 440);
            }

            session(['lastActivityTime' => $currentTime]);
        }

        return $next($request);
    }
}
