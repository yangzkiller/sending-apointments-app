<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Spreadsheet\SpreadsheetController;
use App\Http\Controllers\UserController;


require __DIR__.'/authentication.php';

Route::middleware('auth')->prefix('spreadsheet')->name('spreadsheet.')->group(function () {
    Route::post('/import', [SpreadsheetController::class, 'store'])->name('import');
    Route::get('/last', [SpreadsheetController::class, 'lastImport'])->name('last');
});

Route::middleware('auth')->group(function () {
    Route::post('/change-password', [UserController::class, 'changePassword'])
        ->name('change-password');
});
