<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Added this
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class NewsController extends Controller
{
    public function index()
    {
        $news = News::latest()->get();
        return Inertia::render('Admin/News/Index', [
            'news' => $news,
            'auth' => ['user' => Auth::user()] // <--- FIXED: Passes user info to avoid crash
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/News/Create', [
            'auth' => ['user' => Auth::user()] // <--- FIXED: Passes user info here too
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('news_images', 'public');
        }

        News::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'image_path' => $imagePath,
        ]);

        return redirect()->route('admin.news.index')->with('message', 'News posted successfully!');
    }

    public function destroy(News $news)
    {
        if ($news->image_path) {
            Storage::disk('public')->delete($news->image_path);
        }

        $news->delete();

        return redirect()->back()->with('message', 'News deleted successfully.');
    }
}
