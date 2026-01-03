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
            'icon_path' => 'nullable|string',
        ]);

        AssistanceProgram::create($validated);

        return redirect()->route('admin.programs.index')->with('message', 'Program added successfully.');
    }

    public function update(Request $request, AssistanceProgram $program)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon_path' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $program->update($validated);

        return redirect()->route('admin.programs.index')->with('message', 'Program updated successfully.');
    }

    public function destroy(AssistanceProgram $program)
    {
        $program->delete();

        // We force a 303 Response code so the browser switches from DELETE to GET
        return to_route('admin.programs.index')
            ->with('message', 'Program deleted.')
            ->setStatusCode(303);
    }
}
