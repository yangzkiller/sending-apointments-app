<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Authentication\AuthenticationController;

Route::middleware('guest')->get('/', [AuthenticationController::class, 'index'])
    ->name('authentication.index');

Route::prefix('authentication')->name('authentication.')->group(function () {
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
