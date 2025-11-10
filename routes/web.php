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
Route::prefix('spreadsheet')->name('spreadsheet.')->group(function () {
    Route::middleware(['auth', 'sender'])->group(function () {
        Route::post('/import', [SpreadsheetController::class, 'store'])
            ->name('import');

        Route::get('/last', [SpreadsheetController::class, 'lastImport'])
            ->name('last');
    });
});

//RECEIVER
Route::prefix('institution.')->name('institution.')->group(function () {
    Route::middleware(['auth', 'receiver'])->group(function () {
        Route::get('/all', [InstitutionController::class, 'all'])
            ->name('all');

        Route::patch('/update-status/{id}', [InstitutionController::class, 'updateStatus'])
            ->name('updateStatus');
    });
});

Route::prefix('spreadsheet')->name('spreadsheet.')->group(function () {
    Route::middleware(['auth', 'receiver'])->group(function () {
        Route::post('/download-csv', [SpreadsheetController::class, 'downloadCsv'])
        ->name('downloadCsv');
    });
});










