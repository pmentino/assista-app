<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class NewsController extends Controller
{
    /**
     * Display a listing of the news.
     */
    public function index()
    {
        // We use get() instead of paginate() so your React 'news.map' works perfectly
        $news = News::latest()->get();

        return Inertia::render('Admin/News/Index', [
            'news' => $news,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/News/Create', [
            'auth' => ['user' => Auth::user()]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
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

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(News $news)
    {
        return Inertia::render('Admin/News/Edit', [
            'news' => $news,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, News $news)
    {
        // 1. Validate Input
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // 2. Handle Image Upload
        if ($request->hasFile('image')) {
            // Delete old image to save space
            if ($news->image_path && Storage::disk('public')->exists($news->image_path)) {
                Storage::disk('public')->delete($news->image_path);
            }
            // Store new one
            $news->image_path = $request->file('image')->store('news_images', 'public');
        }

        // 3. Update Text
        $news->title = $validated['title'];
        $news->content = $validated['content'];
        $news->save();

        return redirect()->route('admin.news.index')->with('message', 'News updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(News $news)
    {
        // 1. Delete the image file if it exists
        if ($news->image_path && Storage::disk('public')->exists($news->image_path)) {
            Storage::disk('public')->delete($news->image_path);
        }

        // 2. Delete the record from database
        $news->delete();

        // 3. Redirect back
        return redirect()->route('admin.news.index')->with('message', 'News item deleted successfully.');
    }
}
