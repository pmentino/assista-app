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
        $news = News::latest()->paginate(10);

        return Inertia::render('Admin/News/Index', [
            'news' => $news,
            // *** THIS WAS THE MISSING DATA ***
            'auth' => [
                'user' => Auth::user(),
            ],
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

    // app/Http/Controllers/Admin/NewsController.php

// ... (other methods like index, store, create, etc.)

/**
 * Show the form for editing the specified news item.
 */
public function edit(News $news)
{
    // Pass the specific news item data to the Inertia component
    return Inertia::render('Admin/News/Edit', [
        'news' => $news,
        'auth' => [
            'user' => Auth::user(),
        ],
    ]);
}

// ... inside NewsController class

    public function update(Request $request, News $news)
    {
        // 1. Validate Input
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Max 2MB
        ]);

        // 2. Handle Image Upload (If a new one is provided)
        if ($request->hasFile('image')) {
            // Delete old image if it exists to save space
            if ($news->image_path && \Illuminate\Support\Facades\Storage::disk('public')->exists($news->image_path)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($news->image_path);
            }

            // Store new image
            $path = $request->file('image')->store('news_images', 'public');
            $news->image_path = $path;
        }

        // 3. Update Text Fields
        $news->title = $validated['title'];
        $news->content = $validated['content'];
        $news->save();

        // 4. Redirect with Success Message
        return redirect()->route('admin.news.index')->with('message', 'News updated successfully.');
    }

// ... (other methods like update, destroy, etc.)

    // ... inside NewsController class

    public function destroy(News $news)
    {
        // 1. Delete the image file if it exists
        if ($news->image_path && \Illuminate\Support\Facades\Storage::disk('public')->exists($news->image_path)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($news->image_path);
        }

        // 2. Delete the record from database
        $news->delete();

        // 3. Redirect back
        return redirect()->route('admin.news.index')->with('message', 'News item deleted successfully.');
    }
}

