<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AppointmentController extends Controller
{
    public function index()
    {
        $appointments = Appointment::with(['patient', 'doctor'])
            ->orderBy('appointment_date')
            ->orderBy('appointment_time')
            ->get();

        return response()->json($appointments);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'appointment_number' => [
                'required',
                'string',
                'max:255',
                'unique:appointments,appointment_number',
            ],
            'patient_id' => [
                'required',
                'integer',
                'exists:patients,id',
            ],
            'doctor_id' => [
                'required',
                'integer',
                'exists:doctors,id',
            ],
            'appointment_date' => [
                'required',
                'date',
            ],
            'appointment_time' => [
                'required',
                'date_format:H:i',
            ],
            'reason' => [
                'required',
                'string',
                'max:255',
            ],
            'status' => [
                'sometimes',
                Rule::in([
                    'scheduled',
                    'confirmed',
                    'completed',
                    'cancelled',
                ]),
            ],
            'notes' => [
                'nullable',
                'string',
            ],
        ]);

        $appointment = Appointment::create($validated);

        return response()->json([
            'message' => 'Appointment created successfully.',
            'appointment' => $appointment->load(['patient', 'doctor']),
        ], 201);
    }

    public function show(Appointment $appointment)
    {
        return response()->json(
            $appointment->load(['patient', 'doctor'])
        );
    }

    public function update(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'appointment_number' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('appointments', 'appointment_number')
                    ->ignore($appointment->id),
            ],
            'patient_id' => [
                'sometimes',
                'required',
                'integer',
                'exists:patients,id',
            ],
            'doctor_id' => [
                'sometimes',
                'required',
                'integer',
                'exists:doctors,id',
            ],
            'appointment_date' => [
                'sometimes',
                'required',
                'date',
            ],
            'appointment_time' => [
                'sometimes',
                'required',
                'date_format:H:i',
            ],
            'reason' => [
                'sometimes',
                'required',
                'string',
                'max:255',
            ],
            'status' => [
                'sometimes',
                'required',
                Rule::in([
                    'scheduled',
                    'confirmed',
                    'completed',
                    'cancelled',
                ]),
            ],
            'notes' => [
                'nullable',
                'string',
            ],
        ]);

        $appointment->update($validated);

        return response()->json([
            'message' => 'Appointment updated successfully.',
            'appointment' => $appointment->fresh()
                ->load(['patient', 'doctor']),
        ]);
    }

    public function destroy(Appointment $appointment)
    {
        $appointment->delete();

        return response()->json([
            'message' => 'Appointment archived successfully.',
        ]);
    }

    public function archived()
    {
        $appointments = Appointment::onlyTrashed()
            ->with(['patient', 'doctor'])
            ->orderByDesc('deleted_at')
            ->get();

        return response()->json($appointments);
    }

    public function restore($id)
{
    $appointment = Appointment::withTrashed()->findOrFail($id);

    if (!$appointment->trashed()) {
        return response()->json([
            'message' => 'This appointment is not archived.',
        ], 422);
    }

    $appointment->restore();

    return response()->json([
        'message' => 'Appointment restored successfully.',
        'data' => $appointment->fresh(),
    ]);
}
}
