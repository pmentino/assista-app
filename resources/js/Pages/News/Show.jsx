import { Head, Link } from '@inertiajs/react';

export default function Show({ news, auth }) {
    if (!news) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased">
            <Head title={news.title} />

            {/* --- PUBLIC HEADER --- */}
            <header className="bg-blue-800 shadow-md sticky top-0 z-50">
                <div className="container mx-auto flex items-center justify-between p-4 px-6">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/images/logo.png" alt="Logo" className="h-10 w-auto bg-white rounded-full p-1" />
                        <span className="text-xl font-bold text-white tracking-wide">ASSISTA</span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-gray-200 hover:text-white font-medium transition">HOME</Link>
                        <Link href={route('news.index')} className="text-white font-bold border-b-2 border-yellow-400">NEWS</Link>

                        <Link
                            href={auth?.user ? route('dashboard') : route('login')}
                            className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-2 px-6 rounded-full shadow transition"
                        >
                            {auth?.user ? 'DASHBOARD' : 'LOGIN'}
                        </Link>
                    </nav>
                </div>
            </header>

            {/* --- CONTENT --- */}
            <main className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="mb-8">
                        <Link href={route('news.index')} className="inline-flex items-center text-gray-500 hover:text-blue-800 font-bold transition-colors">
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to All Updates
                        </Link>
                    </div>

                    <article className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        {news.image_path && (
                            <div className="w-full h-64 md:h-[500px] relative bg-gray-100">
                                <img
                                    src={`/storage/${news.image_path}`}
                                    alt={news.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>
                        )}

                        <div className="p-8 md:p-12">
                            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
                                {news.title}
                            </h1>
                            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {news.content}
                            </div>
                        </div>
                    </article>
                </div>
            </main>
        </div>
    );
}
