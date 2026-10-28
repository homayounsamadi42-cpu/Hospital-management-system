<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Medicine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MedicineController extends Controller
{
    public function index(): JsonResponse
    {
        $medicines = Medicine::query()
            ->latest()
            ->get();

        return response()->json($medicines);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'medicine_code' => [
                'required',
                'string',
                'max:255',
                'unique:medicines,medicine_code',
            ],
            'name' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'strength' => ['nullable', 'string', 'max:255'],
            'dosage_form' => ['nullable', 'string', 'max:255'],
            'manufacturer' => ['nullable', 'string', 'max:255'],
            'supplier' => ['nullable', 'string', 'max:255'],
            'quantity' => ['sometimes', 'integer', 'min:0'],
            'reorder_level' => ['sometimes', 'integer', 'min:0'],
            'purchase_price' => ['sometimes', 'numeric', 'min:0'],
            'selling_price' => ['sometimes', 'numeric', 'min:0'],
            'currency' => ['sometimes', 'string', 'size:3'],
            'expiry_date' => ['nullable', 'date'],
            'batch_number' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $medicine = Medicine::create($validated);

        return response()->json([
            'message' => 'Medicine created successfully.',
            'medicine' => $medicine,
        ], 201);
    }

    public function show(Medicine $medicine): JsonResponse
    {
        return response()->json($medicine);
    }

    public function update(
        Request $request,
        Medicine $medicine
    ): JsonResponse {
        $validated = $request->validate([
            'medicine_code' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('medicines', 'medicine_code')
                    ->ignore($medicine->id),
            ],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'strength' => ['nullable', 'string', 'max:255'],
            'dosage_form' => ['nullable', 'string', 'max:255'],
            'manufacturer' => ['nullable', 'string', 'max:255'],
            'supplier' => ['nullable', 'string', 'max:255'],
            'quantity' => ['sometimes', 'integer', 'min:0'],
            'reorder_level' => ['sometimes', 'integer', 'min:0'],
            'purchase_price' => ['sometimes', 'numeric', 'min:0'],
            'selling_price' => ['sometimes', 'numeric', 'min:0'],
            'currency' => ['sometimes', 'string', 'size:3'],
            'expiry_date' => ['nullable', 'date'],
            'batch_number' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $medicine->update($validated);

        return response()->json([
            'message' => 'Medicine updated successfully.',
            'medicine' => $medicine->fresh(),
        ]);
    }

    public function destroy(Medicine $medicine): JsonResponse
    {
        $medicine->delete();

        return response()->json([
            'message' => 'Medicine archived successfully.',
        ]);
    }

    public function archived(): JsonResponse
    {
        return response()->json(
            Medicine::onlyTrashed()->latest()->get()
        );
    }

    public function restore(string $id): JsonResponse
    {
        $medicine = Medicine::onlyTrashed()->findOrFail($id);
        $medicine->restore();

        return response()->json([
            'message' => 'Medicine restored successfully.',
            'medicine' => $medicine->fresh(),
        ]);
    }

    public function lowStock(): JsonResponse
    {
        return response()->json(
            Medicine::query()
                ->whereColumn('quantity', '<=', 'reorder_level')
                ->orderBy('quantity')
                ->get()
        );
    }

    public function expiringSoon(Request $request): JsonResponse
    {
        $days = $request->integer('days', 30);
        $days = max(0, min($days, 365));

        return response()->json(
            Medicine::query()
                ->whereNotNull('expiry_date')
                ->whereDate('expiry_date', '>=', now()->toDateString())
                ->whereDate(
                    'expiry_date',
                    '<=',
                    now()->addDays($days)->toDateString()
                )
                ->orderBy('expiry_date')
                ->get()
        );
    }
}
