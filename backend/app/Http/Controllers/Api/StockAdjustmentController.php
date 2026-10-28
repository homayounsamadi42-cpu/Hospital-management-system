<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Medicine;
use App\Models\StockAdjustment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class StockAdjustmentController extends Controller
{
    /**
     * List stock adjustments, newest first.
     */
    public function index(Request $request)
    {
        $filters = $request->validate([
            'medicine_id' => ['sometimes', 'integer', 'exists:medicines,id'],
            'adjustment_type' => [
                'sometimes',
                Rule::in(['stock_in', 'stock_out']),
            ],
        ]);

        $query = StockAdjustment::with(['medicine', 'user'])
            ->latest();

        if (isset($filters['medicine_id'])) {
            $query->where('medicine_id', $filters['medicine_id']);
        }

        if (isset($filters['adjustment_type'])) {
            $query->where(
                'adjustment_type',
                $filters['adjustment_type']
            );
        }

        return response()->json($query->paginate(20));
    }

    /**
     * Record a stock-in or stock-out operation.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'medicine_id' => [
                'required',
                'integer',
                'exists:medicines,id',
            ],
            'adjustment_type' => [
                'required',
                Rule::in(['stock_in', 'stock_out']),
            ],
            'quantity' => ['required', 'integer', 'min:1'],
            'reason' => ['required', 'string', 'max:255'],
            'reference_number' => [
                'nullable',
                'string',
                'max:100',
            ],
            'adjusted_by' => [
                'nullable',
                'integer',
                'exists:users,id',
            ],
        ]);

        $result = DB::transaction(function () use ($validated) {
            // Lock the medicine row while calculating the new stock.
            $medicine = Medicine::whereKey(
                $validated['medicine_id']
            )->lockForUpdate()->firstOrFail();

            $before = (int) $medicine->quantity;
            $amount = (int) $validated['quantity'];

            if (
                $validated['adjustment_type'] === 'stock_out'
                && $amount > $before
            ) {
                return [
                    'error' => true,
                    'message' => 'Insufficient stock. Available quantity: '
                        . $before,
                ];
            }

            $after = $validated['adjustment_type'] === 'stock_in'
                ? $before + $amount
                : $before - $amount;

            $medicine->quantity = $after;
            $medicine->save();

            $adjustment = StockAdjustment::create([
                'medicine_id' => $medicine->id,
                'adjustment_type' => $validated['adjustment_type'],
                'quantity' => $amount,
                'quantity_before' => $before,
                'quantity_after' => $after,
                'reason' => $validated['reason'],
                'reference_number' =>
                    $validated['reference_number'] ?? null,
                'adjusted_by' => $validated['adjusted_by'] ?? null,
            ]);

            return [
                'error' => false,
                'adjustment' => $adjustment->load([
                    'medicine',
                    'user',
                ]),
            ];
        }, 3);

        if ($result['error']) {
            return response()->json([
                'message' => $result['message'],
            ], 422);
        }

        return response()->json([
            'message' => 'Stock adjustment recorded successfully.',
            'data' => $result['adjustment'],
        ], 201);
    }
}
