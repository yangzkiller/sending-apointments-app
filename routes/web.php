<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Spreadsheet\SpreadsheetController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Institution\InstitutionController;


require __DIR__.'/authentication.php';

Route::middleware(['auth', 'check.active'])->prefix('spreadsheet')->name('spreadsheet.')->group(function () {
    Route::post('/import', [SpreadsheetController::class, 'store'])->name('import');
    Route::get('/last', [SpreadsheetController::class, 'lastImport'])->name('last');
});

Route::middleware(['auth', 'check.active'])->group(function () {
    Route::post('/change-password', [UserController::class, 'changePassword'])
        ->name('change-password');
    
    // Admin routes
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update');
        Route::get('/institutions', [InstitutionController::class, 'index'])->name('institutions.index');
        Route::post('/institutions', [InstitutionController::class, 'store'])->name('institutions.store');
        Route::put('/institutions/{id}', [InstitutionController::class, 'update'])->name('institutions.update');
    });
});
