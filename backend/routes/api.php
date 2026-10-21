
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public endpoint to verify that the API is running.
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Hospital Management System API is running.',
        'version' => '1.0.0',
    ]);
});

// Return the authenticated user's information.
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
