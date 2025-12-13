import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Edit({ auth, news }) {
    // Setup form with initial values from the database
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put', // Method spoofing for Laravel (since file uploads require POST)
        title: news.title || '',
        content: news.content || '',
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);

        // Create a local preview URL
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // We use 'post' with _method: 'put' because sending files via actual PUT is buggy in some browsers
        post(route('admin.news.update', news.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit News Article</h2>
                    <Link href={route('admin.news.index')} className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
                        &larr; Back to List
                    </Link>
                </div>
            }
        >
            <Head title={`Edit: ${news.title}`} />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-8 text-gray-900">

                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* --- TITLE INPUT --- */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Headline Title</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Enter an engaging title..."
                                        required
                                    />
                                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                                </div>

                                {/* --- CONTENT TEXTAREA --- */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">News Content</label>
                                    <textarea
                                        rows="8"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Write the full details here..."
                                        required
                                    />
                                    {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                                </div>

                                {/* --- IMAGE UPLOAD SECTION --- */}
                                <div className="border-t pt-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-4">Featured Image</label>

                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        {/* Current / New Preview */}
                                        <div className="w-full md:w-1/3">
                                            <div className="aspect-video bg-gray-100 rounded-lg border flex items-center justify-center overflow-hidden relative">
                                                {imagePreview ? (
                                                    <img src={imagePreview} alt="New Preview" className="object-cover w-full h-full" />
                                                ) : news.image_path ? (
                                                    <img src={`/storage/${news.image_path}`} alt="Current" className="object-cover w-full h-full" />
                                                ) : (
                                                    <span className="text-gray-400 text-sm">No image</span>
                                                )}

                                                {imagePreview && (
                                                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded shadow">
                                                        New Image Selected
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs text-center text-gray-500 mt-2">Preview</p>
                                        </div>

                                        {/* Upload Control */}
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="block w-full text-sm text-gray-500
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-full file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-indigo-50 file:text-indigo-700
                                                    hover:file:bg-indigo-100"
                                            />
                                            <p className="text-xs text-gray-500 mt-2">
                                                Leave blank to keep the current image. Recommended size: 1200x600px.
                                            </p>
                                            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* --- ACTIONS --- */}
                                <div className="flex items-center justify-end gap-4 border-t pt-6">
                                    <Link
                                        href={route('admin.news.index')}
                                        className="px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </Link>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-6 py-3 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
                                    >
                                        {processing ? 'Saving Changes...' : 'Update Article'}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
