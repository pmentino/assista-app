<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AssistanceProgram;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AssistanceProgramController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Programs/Index', [
            'programs' => AssistanceProgram::latest()->get(),
            'auth' => ['user' => Auth::user()]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'default_amount' => 'nullable|numeric|min:0', // Validated
            'icon_path' => 'nullable|string',
        ]);

        $requirementsArray = $request->requirements
            ? array_values(array_filter(array_map('trim', explode(',', $request->requirements))))
            : [];

        AssistanceProgram::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'requirements' => $requirementsArray,
            'default_amount' => $validated['default_amount'] ?? null, // <--- FIX: Actually saving it now
            'icon_path' => $validated['icon_path'] ?? 'M13 10V3L4 14h7v7l9-11h-7z',
            'is_active' => true,
        ]);

        return redirect()->back()->with('message', 'Program created successfully.');
    }

    public function update(Request $request, AssistanceProgram $program)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'default_amount' => 'nullable|numeric|min:0', // Validated
            'icon_path' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $requirementsArray = $request->requirements
            ? array_values(array_filter(array_map('trim', explode(',', $request->requirements))))
            : [];

        $program->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'requirements' => $requirementsArray,
            'default_amount' => $validated['default_amount'] ?? null, // <--- FIX: Actually saving it now
            'icon_path' => $validated['icon_path'],
            'is_active' => $validated['is_active'] ?? $program->is_active,
        ]);

        return redirect()->route('admin.programs.index')->with('message', 'Program updated successfully.');
    }

    public function destroy(AssistanceProgram $program)
    {
        $program->delete();
        return to_route('admin.programs.index')
            ->with('message', 'Program deleted.')
            ->setStatusCode(303);
    }
}
