<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class InvoiceController extends Controller
{
    public function index()
    {
        return response()->json(
            Invoice::with(['patient', 'appointment', 'items', 'payments'])
                ->latest()
                ->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'invoice_number' => [
                'required', 'string', 'max:255',
                'unique:invoices,invoice_number',
            ],
            'patient_id' => [
                'required', 'integer',
                Rule::exists('patients', 'id')->whereNull('deleted_at'),
            ],
            'appointment_id' => [
                'nullable', 'integer',
                Rule::exists('appointments', 'id')->whereNull('deleted_at'),
            ],
            'invoice_date' => ['required', 'date'],
            'due_date' => ['nullable', 'date', 'after_or_equal:invoice_date'],
            'discount_amount' => ['sometimes', 'numeric', 'min:0'],
            'tax_amount' => ['sometimes', 'numeric', 'min:0'],
            'currency' => ['sometimes', 'string', 'size:3'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.description' => ['required', 'string', 'max:255'],
            'items.*.quantity' => ['required', 'numeric', 'gt:0', 'max:1000000'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0', 'max:9999999999.99'],
        ]);

        if (! empty($validated['appointment_id'])) {
            $appointment = Appointment::findOrFail(
                $validated['appointment_id']
            );

            if ((int) $appointment->patient_id !== (int) $validated['patient_id']) {
                throw ValidationException::withMessages([
                    'appointment_id' => [
                        'The selected appointment does not belong to this patient.',
                    ],
                ]);
            }
        }

        $invoice = DB::transaction(function () use ($validated) {
            $subtotal = 0;

            $items = collect($validated['items'])->map(function ($item) use (&$subtotal) {
                $quantity = (float) $item['quantity'];
                $unitPrice = (float) $item['unit_price'];

                // Round each line to two decimal places.
                $lineTotal = round($quantity * $unitPrice, 2);
                $subtotal = round($subtotal + $lineTotal, 2);

                return [
                    'description' => $item['description'],
                    'quantity' => $quantity,
                    'unit_price' => round($unitPrice, 2),
                    'line_total' => $lineTotal,
                ];
            });

            $discount = round((float) ($validated['discount_amount'] ?? 0), 2);
            $tax = round((float) ($validated['tax_amount'] ?? 0), 2);

            if ($discount > $subtotal) {
                throw ValidationException::withMessages([
                    'discount_amount' => [
                        'The discount cannot exceed the invoice subtotal.',
                    ],
                ]);
            }

            $total = round($subtotal - $discount + $tax, 2);

            $invoice = Invoice::create([
                'invoice_number' => $validated['invoice_number'],
                'patient_id' => $validated['patient_id'],
                'appointment_id' => $validated['appointment_id'] ?? null,
                'invoice_date' => $validated['invoice_date'],
                'due_date' => $validated['due_date'] ?? null,
                'subtotal' => $subtotal,
                'discount_amount' => $discount,
                'tax_amount' => $tax,
                'total_amount' => $total,
                'paid_amount' => 0,
                'currency' => strtoupper($validated['currency'] ?? 'AFN'),
                'status' => 'unpaid',
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($items as $item) {
                $invoice->items()->create($item);
            }

            return $invoice;
        });

        return response()->json([
            'message' => 'Invoice created successfully.',
            'data' => $invoice->load(['patient', 'appointment', 'items', 'payments']),
        ], 201);
    }

    public function show(Invoice $invoice)
    {
        return response()->json(
            $invoice->load(['patient', 'appointment', 'items', 'payments'])
        );
    }

    public function update(Request $request, Invoice $invoice)
    {
        if ($invoice->payments()->exists()) {
            return response()->json([
                'message' => 'An invoice with payment history cannot be edited.',
            ], 422);
        }

        $validated = $request->validate([
            'invoice_number' => [
                'sometimes', 'required', 'string', 'max:255',
                Rule::unique('invoices', 'invoice_number')->ignore($invoice->id),
            ],
            'patient_id' => [
                'sometimes', 'required', 'integer',
                Rule::exists('patients', 'id')->whereNull('deleted_at'),
            ],
            'appointment_id' => [
                'sometimes', 'nullable', 'integer',
                Rule::exists('appointments', 'id')->whereNull('deleted_at'),
            ],
            'invoice_date' => ['sometimes', 'required', 'date'],
            'due_date' => ['sometimes', 'nullable', 'date'],
            'discount_amount' => ['sometimes', 'numeric', 'min:0'],
            'tax_amount' => ['sometimes', 'numeric', 'min:0'],
            'currency' => ['sometimes', 'string', 'size:3'],
            'notes' => ['sometimes', 'nullable', 'string'],
            'items' => ['sometimes', 'required', 'array', 'min:1'],
            'items.*.description' => ['required_with:items', 'string', 'max:255'],
            'items.*.quantity' => ['required_with:items', 'numeric', 'gt:0', 'max:1000000'],
            'items.*.unit_price' => ['required_with:items', 'numeric', 'min:0', 'max:9999999999.99'],
        ]);

        $patientId = $validated['patient_id'] ?? $invoice->patient_id;
        $appointmentId = array_key_exists('appointment_id', $validated)
            ? $validated['appointment_id']
            : $invoice->appointment_id;

        if ($appointmentId !== null) {
            $appointment = Appointment::findOrFail($appointmentId);

            if ((int) $appointment->patient_id !== (int) $patientId) {
                throw ValidationException::withMessages([
                    'appointment_id' => [
                        'The selected appointment does not belong to this patient.',
                    ],
                ]);
            }
        }

        $invoice = DB::transaction(function () use ($validated, $invoice, $patientId, $appointmentId) {
            $items = null;
            $subtotal = (float) $invoice->subtotal;

            if (array_key_exists('items', $validated)) {
                $items = collect($validated['items'])->map(function ($item) {
                    $quantity = (float) $item['quantity'];
                    $unitPrice = round((float) $item['unit_price'], 2);

                    return [
                        'description' => $item['description'],
                        'quantity' => $quantity,
                        'unit_price' => $unitPrice,
                        'line_total' => round($quantity * $unitPrice, 2),
                    ];
                });

                $subtotal = round($items->sum('line_total'), 2);
            }

            $discount = round(
                (float) ($validated['discount_amount'] ?? $invoice->discount_amount),
                2
            );
            $tax = round(
                (float) ($validated['tax_amount'] ?? $invoice->tax_amount),
                2
            );

            if ($discount > $subtotal) {
                throw ValidationException::withMessages([
                    'discount_amount' => [
                        'The discount cannot exceed the invoice subtotal.',
                    ],
                ]);
            }

            $invoice->fill([
                'invoice_number' => $validated['invoice_number'] ?? $invoice->invoice_number,
                'patient_id' => $patientId,
                'appointment_id' => $appointmentId,
                'invoice_date' => $validated['invoice_date'] ?? $invoice->invoice_date,
                'due_date' => $validated['due_date'] ?? $invoice->due_date,
                'subtotal' => $subtotal,
                'discount_amount' => $discount,
                'tax_amount' => $tax,
                'total_amount' => round($subtotal - $discount + $tax, 2),
                'currency' => strtoupper($validated['currency'] ?? $invoice->currency),
                'notes' => $validated['notes'] ?? $invoice->notes,
                'status' => 'unpaid',
            ]);

            $invoice->save();

            if ($items !== null) {
                $invoice->items()->delete();

                foreach ($items as $item) {
                    $invoice->items()->create($item);
                }
            }

            return $invoice;
        });

        return response()->json([
            'message' => 'Invoice updated successfully.',
            'data' => $invoice->fresh()->load(['patient', 'appointment', 'items', 'payments']),
        ]);
    }

    public function destroy(Invoice $invoice)
    {
        if ($invoice->payments()->exists()) {
            return response()->json([
                'message' => 'Invoices with payment history cannot be archived.',
            ], 422);
        }

        $invoice->delete();

        return response()->json([
            'message' => 'Invoice archived successfully.',
        ]);
    }

    public function archived()
    {
        return response()->json(
            Invoice::onlyTrashed()
                ->with(['patient', 'appointment', 'items'])
                ->latest('deleted_at')
                ->get()
        );
    }

    public function restore(string $id)
    {
        $invoice = Invoice::withTrashed()->findOrFail($id);

        if (! $invoice->trashed()) {
            return response()->json([
                'message' => 'This invoice is not archived.',
            ], 422);
        }

        if ($invoice->payments()->exists()) {
            return response()->json([
                'message' => 'This invoice has payment history and cannot be restored through this endpoint.',
            ], 422);
        }

        $invoice->restore();

        return response()->json([
            'message' => 'Invoice restored successfully.',
            'data' => $invoice->fresh()->load(['patient', 'appointment', 'items']),
        ]);
    }
}
