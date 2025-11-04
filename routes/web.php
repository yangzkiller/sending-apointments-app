<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

require __DIR__.'/authentication.php';

Route::middleware('auth')->group(function () {
    Route::post('/change-password', [UserController::class, 'changePassword'])
        ->name('change-password');
});
