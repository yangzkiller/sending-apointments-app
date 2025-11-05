<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Spreadsheet\SpreadsheetController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Institution\InstitutionController;

require __DIR__.'/authentication.php';

//GENERAL
Route::middleware('auth')->group(function () {
    Route::post('/change-password', [UserController::class, 'changePassword'])
        ->name('change-password');
});

//SENDER
Route::middleware(['auth', 'sender'])
    ->prefix('spreadsheet')
    ->name('spreadsheet.')
    ->group(function () {
        Route::post('/import', [SpreadsheetController::class, 'store'])->name('import');
        Route::get('/last', [SpreadsheetController::class, 'lastImport'])->name('last');
    });

//RECEIVER
Route::middleware(['auth', 'receiver'])
    ->prefix('institutions')
    ->name('institutions.')
    ->group(function () {
        Route::get('/all', [InstitutionController::class, 'getAll'])->name('all');
    });
