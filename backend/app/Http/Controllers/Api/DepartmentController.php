<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DepartmentController extends Controller
{
    public function index()
    {
        return response()->json(
            Department::latest()->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'department_code' => [
                'required',
                'string',
                'max:255',
                'unique:departments,department_code',
            ],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'head_of_department' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $department = Department::create($validated);

        return response()->json([
            'message' => 'Department created successfully.',
            'data' => $department,
        ], 201);
    }

    public function show(Department $department)
    {
        return response()->json($department);
    }

    public function update(Request $request, Department $department)
    {
        $validated = $request->validate([
            'department_code' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('departments', 'department_code')
                    ->ignore($department->id),
            ],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'location' => ['sometimes', 'nullable', 'string', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:50'],
            'email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'head_of_department' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $department->update($validated);

        return response()->json([
            'message' => 'Department updated successfully.',
            'data' => $department->fresh(),
        ]);
    }

    public function destroy(Department $department)
    {
        $department->delete();

        return response()->json([
            'message' => 'Department archived successfully.',
        ]);
    }

    public function archived()
    {
        return response()->json(
            Department::onlyTrashed()->latest('deleted_at')->get()
        );
    }

    public function restore(string $id)
    {
        $department = Department::withTrashed()->findOrFail($id);

        if (! $department->trashed()) {
            return response()->json([
                'message' => 'This department is not archived.',
            ], 422);
        }

        $department->restore();

        return response()->json([
            'message' => 'Department restored successfully.',
            'data' => $department->fresh(),
        ]);
    }
}
