
<?php

use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\PaymentController;
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

// Patient routes
Route::get('/patients/archived', [PatientController::class, 'archived']);
Route::patch('/patients/{id}/restore', [PatientController::class, 'restore']);
Route::apiResource('patients', PatientController::class);

// Doctor routes
Route::get('/doctors/archived', [DoctorController::class, 'archived']);
Route::patch('/doctors/{id}/restore', [DoctorController::class, 'restore']);
Route::apiResource('doctors', DoctorController::class);

// Appointment routes
Route::get('/appointments/archived', [AppointmentController::class, 'archived']);
Route::patch('/appointments/{id}/restore', [AppointmentController::class, 'restore']);
Route::apiResource('appointments', AppointmentController::class);

// Department routes
Route::get('/departments/archived', [DepartmentController::class, 'archived']);
Route::patch('/departments/{id}/restore', [DepartmentController::class, 'restore']);
Route::apiResource('departments', DepartmentController::class);

// Billing: invoice routes
Route::get('/invoices/archived', [InvoiceController::class, 'archived']);
Route::patch('/invoices/{id}/restore', [InvoiceController::class, 'restore']);

// Payment routes must be registered before the invoice resource routes.
Route::get('/payments', [PaymentController::class, 'index']);
Route::get('/payments/{payment}', [PaymentController::class, 'show']);
Route::post('/invoices/{invoice}/payments', [PaymentController::class, 'store']);

Route::apiResource('invoices', InvoiceController::class);
