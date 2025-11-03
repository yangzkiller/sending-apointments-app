<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Controllers\Controller;
use App\Models\User\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    public function sendCode(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $email = $validated['email'];

        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email não encontrado no sistema.'
            ], 404);
        }

        $attempts = DB::table('password_reset_tokens')
            ->where('email', $email)
            ->where('created_at', '>=', Carbon::now()->subMinutes(15))
            ->count();

        if ($attempts >= 5) {
            return response()->json([
                'status' => 'error',
                'message' => 'Muitas tentativas. Tente novamente mais tarde.'
            ], 429);
        }

        $code = $this->generateSixDigitCode();

        DB::table('password_reset_tokens')->where('email', $email)->delete();

        DB::table('password_reset_tokens')->insert([
            'email' => $email,
            'token' => Hash::make($code),
            'created_at' => Carbon::now(),
        ]);

        try {
            Mail::raw(
                "Seu código de recuperação de senha é: {$code}\n\nEste código expira em 15 minutos.",
                function ($message) use ($email) {
                    $message->to($email)->subject('Código de Recuperação de Senha');
                }
            );
        } catch (\Exception $e) {
            DB::table('password_reset_tokens')->where('email', $email)->delete();
            return response()->json([
                'status' => 'error',
                'message' => 'Erro ao enviar email. Tente novamente.'
            ], 500);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Código enviado para seu email.'
        ], 200);
    }
    public function validateCode(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'code' => ['required', 'string', 'size:6'],
        ]);

        $email = $validated['email'];
        $code = $validated['code'];

        $resetToken = DB::table('password_reset_tokens')->where('email', $email)->first();

        if (!$resetToken || !Hash::check($code, $resetToken->token)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Código inválido.'
            ], 422);
        }

        $tokenAge = Carbon::parse($resetToken->created_at)->diffInMinutes(Carbon::now());
        if ($tokenAge > 15) {
            DB::table('password_reset_tokens')->where('email', $email)->delete();
            return response()->json([
                'status' => 'error',
                'message' => 'Código expirado. Solicite um novo.'
            ], 422);
        }

        DB::table('password_reset_tokens')->where('email', $email)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Código válido! Você pode redefinir sua senha.'
        ], 200);
    }
    public function resetPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $email = $validated['email'];

        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Usuário não encontrado.'
            ], 404);
        }

        $user->update(['password' => Hash::make($validated['password'])]);

        return response()->json([
            'status' => 'success',
            'message' => 'Senha redefinida com sucesso!'
        ], 200);
    }

    private function generateSixDigitCode(): string
    {
        return str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }
}
