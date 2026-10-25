
<?php

use App\Http\Controllers\Api\PatientController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Hospital Management System API is running.',
        'version' => '1.0.0',
    ]);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/patients/archived', [PatientController::class, 'archived']);
Route::patch('/patients/{id}/restore', [PatientController::class, 'restore']);
Route::apiResource('patients', PatientController::class);
