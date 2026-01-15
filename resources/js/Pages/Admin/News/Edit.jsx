import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Edit({ auth, news }) {
    // Setup form with method spoofing for file upload (PUT via POST)
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        title: news.title || '',
        content: news.content || '',
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.news.update', news.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-white leading-tight">Edit News Article</h2>
                    <Link href={route('admin.news.index')} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center transition-colors">
                        &larr; Back to List
                    </Link>
                </div>
            }
        >
            <Head title={`Edit: ${news.title}`} />

            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                        <div className="p-8 text-gray-900 dark:text-gray-100">

                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* --- TITLE --- */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Headline Title</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                                        placeholder="Enter headline..."
                                        required
                                    />
                                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                                </div>

                                {/* --- CONTENT --- */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">News Content</label>
                                    <textarea
                                        rows="8"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                                        placeholder="Write the full details here..."
                                        required
                                    />
                                    {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                                </div>

                                {/* --- IMAGE SECTION --- */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Featured Image</label>

                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        {/* Preview Box */}
                                        <div className="w-full md:w-1/3">
                                            <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center overflow-hidden relative shadow-inner">
                                                {imagePreview ? (
                                                    <img src={imagePreview} alt="New Preview" className="object-cover w-full h-full" />
                                                ) : news.image_path ? (
                                                    <img src={`/storage/${news.image_path}`} alt="Current" className="object-cover w-full h-full" />
                                                ) : (
                                                    <span className="text-gray-400 dark:text-gray-500 text-sm">No image set</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">Current / Preview</p>
                                        </div>

                                        {/* File Input */}
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="block w-full text-sm text-gray-500 dark:text-gray-400
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-full file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-indigo-50 dark:file:bg-indigo-900/50
                                                    file:text-indigo-700 dark:file:text-indigo-300
                                                    hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/70
                                                    transition-colors"
                                            />
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                Upload a new image to replace the current one.
                                            </p>
                                            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* --- ACTIONS --- */}
                                <div className="flex items-center justify-end gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <Link
                                        href={route('admin.news.index')}
                                        className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-200 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                                    >
                                        Cancel
                                    </Link>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-6 py-3 bg-indigo-600 dark:bg-indigo-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 dark:hover:bg-indigo-600 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 dark:focus:border-indigo-300 focus:ring ring-indigo-300 dark:ring-indigo-800 disabled:opacity-25 transition ease-in-out duration-150 shadow-md"
                                    >
                                        {processing ? 'Saving...' : 'Update Article'}
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
