<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Spreadsheet\SpreadsheetController;


require __DIR__.'/authentication.php';

Route::middleware('auth')->prefix('spreadsheet')->name('spreadsheet.')->group(function () {
    Route::post('/import', [SpreadsheetController::class, 'store'])->name('import');
});



