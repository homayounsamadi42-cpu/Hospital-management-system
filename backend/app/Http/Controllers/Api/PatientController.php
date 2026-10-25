<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PatientController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $patients = Patient::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search')->toString();

                $query->where(function ($subQuery) use ($search) {
                    $subQuery
                        ->where('patient_number', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(15);

        return response()->json($patients);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'patient_number' => ['required', 'string', 'max:255', 'unique:patients,patient_number'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'date_of_birth' => ['nullable', 'date', 'before_or_equal:today'],
            'gender' => ['nullable', Rule::in(['male', 'female', 'other'])],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string'],
            'blood_group' => ['nullable', Rule::in([
                'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-',
            ])],
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:30'],
            'allergies' => ['nullable', 'string'],
            'medical_notes' => ['nullable', 'string'],
        ]);

        $patient = Patient::create($validated);

        return response()->json([
            'message' => 'Patient registered successfully.',
            'data' => $patient,
        ], 201);
    }

    public function show(Patient $patient): JsonResponse
    {
        return response()->json(['data' => $patient]);
    }

    public function update(Request $request, Patient $patient): JsonResponse
    {
        $validated = $request->validate([
            'patient_number' => [
                'sometimes', 'required', 'string', 'max:255',
                Rule::unique('patients', 'patient_number')->ignore($patient->id),
            ],
            'first_name' => ['sometimes', 'required', 'string', 'max:255'],
            'last_name' => ['sometimes', 'required', 'string', 'max:255'],
            'date_of_birth' => ['sometimes', 'nullable', 'date', 'before_or_equal:today'],
            'gender' => ['sometimes', 'nullable', Rule::in(['male', 'female', 'other'])],
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'address' => ['sometimes', 'nullable', 'string'],
            'blood_group' => ['sometimes', 'nullable', Rule::in([
                'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-',
            ])],
            'emergency_contact_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'emergency_contact_phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'allergies' => ['sometimes', 'nullable', 'string'],
            'medical_notes' => ['sometimes', 'nullable', 'string'],
        ]);

        $patient->update($validated);

        return response()->json([
            'message' => 'Patient updated successfully.',
            'data' => $patient->fresh(),
        ]);
    }

    public function destroy(Patient $patient): JsonResponse
    {
        $patient->delete();

        return response()->json([
            'message' => 'Patient archived successfully.',
        ]);
    }

    public function archived(): JsonResponse
{
    $patients = Patient::onlyTrashed()
        ->latest('deleted_at')
        ->paginate(15);

    return response()->json($patients);
}

    public function restore(string $id): JsonResponse
    {
        $patient = Patient::onlyTrashed()->findOrFail($id);

        $patient->restore();

        return response()->json([
            'message' => 'Patient restored successfully.',
            'data' => $patient->fresh(),
        ]);
    }
}
