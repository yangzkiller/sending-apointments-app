<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Controllers\Controller;
use App\Models\User\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Models\General\Log;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    /**
     * Sends a password reset code to the provided email address.
     * For security reasons, always returns success even if email doesn't exist.
     *
     * @param Request $request The incoming HTTP request containing the email.
     * @return \Illuminate\Http\JsonResponse Returns a JSON response indicating code was sent.
     */
    public function sendCode(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $email = $validated['email'];
        $user = User::where('email', $email)->first();

        if ($user) {
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
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Se o email fornecido for válido, você receberá um código de recuperação.'
        ], 200);
    }

    /**
     * Validates the provided password reset code.
     *
     * @param Request $request The incoming HTTP request containing email and code.
     * @return \Illuminate\Http\JsonResponse Returns a JSON response indicating if code is valid.
     */
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

    /**
     * Resets the user's password and logs the action.
     *
     * @param Request $request The incoming HTTP request containing email, password and confirmation.
     * @return \Illuminate\Http\JsonResponse Returns a JSON response indicating if password was reset.
     */
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

        Log::create([
            'action' => 'reset_password',
            'description' => "Usuário {$user->name} ({$user->email}) redefiniu sua senha via recuperação de senha.",
            'id_user' => $user->id,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Senha redefinida com sucesso!'
        ], 200);
    }

    /**
     * Generates a random 6-digit code for password reset.
     *
     * @return string A 6-digit string with leading zeros if necessary.
     */
    private function generateSixDigitCode(): string
    {
        return str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }
}
