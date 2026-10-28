<?php

use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\MedicineController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StockAdjustmentController;

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


Route::get('/medicines/archived', [MedicineController::class, 'archived']);
Route::patch('/medicines/{id}/restore', [MedicineController::class, 'restore']);
Route::get('/medicines/low-stock', [MedicineController::class, 'lowStock']);
Route::get('/medicines/expiring-soon', [MedicineController::class, 'expiringSoon']);
Route::apiResource('medicines', MedicineController::class);


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
Route::get(
    '/stock-adjustments',
    [StockAdjustmentController::class, 'index']
);

Route::post(
    '/stock-adjustments',
    [StockAdjustmentController::class, 'store']
);

// Payment routes must be registered before the invoice resource routes.
Route::get('/payments', [PaymentController::class, 'index']);
Route::get('/payments/{payment}', [PaymentController::class, 'show']);
Route::post('/invoices/{invoice}/payments', [PaymentController::class, 'store']);

Route::apiResource('invoices', InvoiceController::class);
