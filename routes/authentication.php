<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Authentication\AuthenticationController;
use App\Http\Controllers\Authentication\PasswordResetController;

Route::middleware('guest')->get('/', [AuthenticationController::class, 'index'])->name('authentication.index');

Route::middleware('auth')->get('home', [AuthenticationController::class, 'home'])
    ->name('home');

Route::prefix('authentication')->name('authentication.')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::post('/login', [AuthenticationController::class, 'login'])
            ->name('login');
    });
});

Route::prefix('authentication')->name('authentication.')->group(function () {
    Route::middleware('auth')->group(function () {
        Route::post('/logout', [AuthenticationController::class, 'logout'])
            ->name('logout');
    });
});

Route::prefix('authentication')->name('authentication.')->group(function () {
    Route::prefix('/forgot-password')->name('forgot-password.')->group(function () {
        Route::middleware('guest')->group(function () {
            Route::post('/send-code', [PasswordResetController::class, 'sendCode'])
                ->name('send-code');

            Route::post('/validate-code', [PasswordResetController::class, 'validateCode'])
                ->name('validate-code');

            Route::post('/reset', [PasswordResetController::class, 'resetPassword'])
                ->name('reset');
        });
    });
});
