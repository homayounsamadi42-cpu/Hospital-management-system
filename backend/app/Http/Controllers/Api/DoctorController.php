<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DoctorController extends Controller
{
    public function index(Request $request)
    {
        $doctors = Doctor::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->search;

                $query->where(function ($query) use ($search) {
                    $query->where('doctor_number', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('specialization', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(15);

        return response()->json($doctors);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'doctor_number' => ['required', 'string', 'max:50', 'unique:doctors,doctor_number'],
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'specialization' => ['required', 'string', 'max:150'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255', 'unique:doctors,email'],
            'gender' => ['nullable', Rule::in(['male', 'female', 'other'])],
            'qualification' => ['nullable', 'string', 'max:255'],
            'license_number' => ['nullable', 'string', 'max:100', 'unique:doctors,license_number'],
            'department' => ['nullable', 'string', 'max:150'],
            'consultation_fee' => ['nullable', 'numeric', 'min:0'],
            'address' => ['nullable', 'string', 'max:2000'],
        ]);

        $doctor = Doctor::create($validated);

        return response()->json([
            'message' => 'Doctor created successfully.',
            'data' => $doctor,
        ], 201);
    }

    public function show(Doctor $doctor)
    {
        return response()->json(['data' => $doctor]);
    }

    public function update(Request $request, Doctor $doctor)
    {
        $validated = $request->validate([
            'doctor_number' => [
                'sometimes', 'required', 'string', 'max:50',
                Rule::unique('doctors', 'doctor_number')->ignore($doctor->id),
            ],
            'first_name' => ['sometimes', 'required', 'string', 'max:100'],
            'last_name' => ['sometimes', 'required', 'string', 'max:100'],
            'specialization' => ['sometimes', 'required', 'string', 'max:150'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'email' => [
                'sometimes', 'nullable', 'email', 'max:255',
                Rule::unique('doctors', 'email')->ignore($doctor->id),
            ],
            'gender' => ['sometimes', 'nullable', Rule::in(['male', 'female', 'other'])],
            'qualification' => ['sometimes', 'nullable', 'string', 'max:255'],
            'license_number' => [
                'sometimes', 'nullable', 'string', 'max:100',
                Rule::unique('doctors', 'license_number')->ignore($doctor->id),
            ],
            'department' => ['sometimes', 'nullable', 'string', 'max:150'],
            'consultation_fee' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'address' => ['sometimes', 'nullable', 'string', 'max:2000'],
        ]);

        $doctor->update($validated);

        return response()->json([
            'message' => 'Doctor updated successfully.',
            'data' => $doctor->fresh(),
        ]);
    }

    public function destroy(Doctor $doctor)
    {
        $doctor->delete();

        return response()->json([
            'message' => 'Doctor archived successfully.',
        ]);
    }

    public function archived(Request $request)
    {
        $doctors = Doctor::onlyTrashed()
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->search;

                $query->where(function ($query) use ($search) {
                    $query->where('doctor_number', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('specialization', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->latest('deleted_at')
            ->paginate(15);

        return response()->json($doctors);
    }

    public function restore(string $id)
    {
        $doctor = Doctor::onlyTrashed()->findOrFail($id);
        $doctor->restore();

        return response()->json([
            'message' => 'Doctor restored successfully.',
            'data' => $doctor->fresh(),
        ]);
    }
}
