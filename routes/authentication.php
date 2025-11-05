<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Authentication\AuthenticationController;
use App\Http\Controllers\Authentication\PasswordResetController;

Route::middleware('guest')->get('/', [AuthenticationController::class, 'index'])
    ->name('authentication.index');

Route::prefix('authentication')->name('authentication.')->group(function () {
    Route::prefix('forgot-password')->name('forgot-password.')->middleware('guest')->group(function () {
        Route::post('/send-code', [PasswordResetController::class, 'sendCode'])
            ->name('send-code');

        Route::post('/validate-code', [PasswordResetController::class, 'validateCode'])
            ->name('validate-code');

        Route::post('/reset', [PasswordResetController::class, 'resetPassword'])
            ->name('reset');
    });

    Route::middleware('guest')->group(function () {
        Route::post('/login', [AuthenticationController::class, 'login'])
            ->name('login');
    });

    Route::middleware('auth')->group(function () {
        Route::post('/logout', [AuthenticationController::class, 'logout'])
            ->name('logout');
    });
});

Route::middleware('auth')->get('Home', [AuthenticationController::class, 'home'])
    ->name('home');
