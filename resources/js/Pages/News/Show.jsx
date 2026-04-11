import { Head, Link } from '@inertiajs/react';
import { useState } from 'react'; // Added useState

export default function Show({ news, auth }) {
    // --- NEW: STATE FOR IMAGE PREVIEW ---
    const [previewImage, setPreviewImage] = useState(null);

    if (!news) return <div className="text-center py-20 font-bold text-gray-500 animate-pulse">Loading Article...</div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased">
            <Head title={news.title} />

            {/* --- PUBLIC HEADER --- */}
            <header className="bg-blue-800 shadow-md sticky top-0 z-50">
                <div className="container mx-auto flex items-center justify-between p-4 px-6">
                    <Link href="/" className="flex items-center gap-3 group">
                        <img src="/images/logo.png" alt="Logo" className="h-10 w-auto bg-white rounded-full p-1 transition-transform group-hover:scale-105" />
                        <span className="text-xl font-bold text-white tracking-wide group-hover:text-yellow-300 transition-colors">ASSISTA</span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-gray-200 hover:text-white font-medium transition">HOME</Link>
                        <Link href={route('news.index')} className="text-white font-bold border-b-2 border-yellow-400">NEWS</Link>

                        <Link
                            href={auth?.user ? route('dashboard') : route('login')}
                            className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-2 px-6 rounded-full shadow transition-transform transform hover:scale-105"
                        >
                            {auth?.user ? 'DASHBOARD' : 'LOGIN'}
                        </Link>
                    </nav>
                </div>
            </header>

            {/* --- CONTENT --- */}
            <main className="py-12 pb-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="mb-8">
                        <Link href={route('news.index')} className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-blue-700 hover:border-blue-300 hover:shadow-md font-bold transition-all group">
                            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to All Updates
                        </Link>
                    </div>

                    <article className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        {news.image_path && (
                            // --- FIX: ADDED CLICK HANDLER AND HOVER EFFECTS TO MAIN IMAGE ---
                            <div
                                className="w-full h-64 md:h-[500px] relative bg-gray-900 group cursor-pointer overflow-hidden"
                                onClick={() => setPreviewImage(`/storage/${news.image_path}`)}
                            >
                                <img
                                    src={`/storage/${news.image_path}`}
                                    alt={news.title}
                                    className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>

                                {/* Zoom Icon Overlay (Appears on Hover) */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-sm">
                                    <div className="bg-black/60 text-white px-4 py-2 rounded-full font-bold flex items-center shadow-lg border border-white/20">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                        Click to Enlarge
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="p-8 md:p-12">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    Announcement
                                </span>
                                <span className="text-sm font-medium text-gray-500">
                                    {news.created_at ? new Date(news.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent'}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
                                {news.title}
                            </h1>
                            <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {news.content}
                            </div>
                        </div>
                    </article>
                </div>
            </main>

            {/* --- NEW: IMAGE PREVIEW MODAL (Uniform Frame) --- */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8 cursor-pointer transition-opacity"
                    onClick={() => setPreviewImage(null)}
                >
                    <div
                        className="relative w-full max-w-5xl h-[70vh] sm:h-[85vh] bg-gray-900/80 rounded-2xl shadow-2xl flex items-center justify-center border border-gray-700/50 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-4 right-4 z-50 bg-black/60 hover:bg-red-600 text-white rounded-full p-2 backdrop-blur transition-all duration-200 focus:outline-none group shadow-lg border border-white/10"
                            title="Close Preview"
                        >
                            <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="w-full h-full p-2 sm:p-8 flex items-center justify-center">
                            <img
                                src={previewImage}
                                className="max-w-full max-h-full object-contain drop-shadow-2xl"
                                alt="Enlarged View"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
