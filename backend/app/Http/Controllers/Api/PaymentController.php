<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class PaymentController extends Controller
{
    public function index()
    {
        return response()->json(
            Payment::with(['invoice.patient'])
                ->latest('payment_date')
                ->get()
        );
    }

    public function store(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'payment_reference' => [
                'nullable',
                'string',
                'max:255',
                'unique:payments,payment_reference',
            ],
            'amount' => [
                'required',
                'numeric',
                'gt:0',
                'max:9999999999.99',
            ],
            'payment_method' => [
                'required',
                Rule::in([
                    'cash',
                    'card',
                    'bank_transfer',
                    'mobile_money',
                ]),
            ],
            'payment_date' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
        ]);

        $payment = DB::transaction(function () use ($validated, $invoice) {
            // Lock the invoice to reduce the risk of concurrent overpayments.
            $lockedInvoice = Invoice::whereKey($invoice->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($lockedInvoice->status === 'cancelled') {
                throw ValidationException::withMessages([
                    'invoice' => ['Payments cannot be recorded against a cancelled invoice.'],
                ]);
            }

            $amountCents = (int) round((float) $validated['amount'] * 100);
            $totalCents = (int) round((float) $lockedInvoice->total_amount * 100);
            $paidCents = (int) round((float) $lockedInvoice->paid_amount * 100);

            if ($amountCents <= 0) {
                throw ValidationException::withMessages([
                    'amount' => ['The payment amount must be greater than zero.'],
                ]);
            }

            $balanceCents = $totalCents - $paidCents;

            if ($amountCents > $balanceCents) {
                throw ValidationException::withMessages([
                    'amount' => [
                        'The payment exceeds the outstanding invoice balance.',
                    ],
                ]);
            }

            $payment = $lockedInvoice->payments()->create([
                'payment_reference' => $validated['payment_reference'] ?? null,
                'amount' => number_format($amountCents / 100, 2, '.', ''),
                'payment_method' => $validated['payment_method'],
                'payment_date' => $validated['payment_date'],
                'notes' => $validated['notes'] ?? null,
            ]);

            $newPaidCents = $paidCents + $amountCents;

            $lockedInvoice->update([
                'paid_amount' => number_format($newPaidCents / 100, 2, '.', ''),
                'status' => $newPaidCents >= $totalCents ? 'paid' : 'partial',
            ]);

            return $payment;
        });

        return response()->json([
            'message' => 'Payment recorded successfully.',
            'data' => $payment->load('invoice.patient'),
            'invoice' => $invoice->fresh()->load('patient', 'items', 'payments'),
        ], 201);
    }

    public function show(Payment $payment)
    {
        return response()->json(
            $payment->load('invoice.patient')
        );
    }
}
