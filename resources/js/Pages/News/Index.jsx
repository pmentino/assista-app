import { Head, Link } from '@inertiajs/react';

export default function Index({ news = [], auth }) {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased">
            <Head title="News & Updates" />

            {/* --- PUBLIC HEADER (Always visible) --- */}
            <header className="bg-blue-800 shadow-md sticky top-0 z-50">
                <div className="container mx-auto flex items-center justify-between p-4 px-6">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/images/logo.png" alt="Logo" className="h-10 w-auto bg-white rounded-full p-1" />
                        <span className="text-xl font-bold text-white tracking-wide">ASSISTA</span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-gray-200 hover:text-white font-medium transition">HOME</Link>
                        <Link href={route('news.index')} className="text-white font-bold border-b-2 border-yellow-400">NEWS</Link>
                        <Link href="/#assistance" className="text-gray-200 hover:text-white font-medium transition">ASSISTANCE</Link>
                        <Link href="/#about" className="text-gray-200 hover:text-white font-medium transition">ABOUT</Link>

                        {/* Dynamic Button: Shows 'Dashboard' if logged in, 'Login' if not */}
                        <Link
                            href={auth?.user ? route('dashboard') : route('login')}
                            className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-2 px-6 rounded-full shadow transition-transform transform hover:scale-105"
                        >
                            {auth?.user ? 'DASHBOARD' : 'LOGIN'}
                        </Link>
                    </nav>
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-extrabold text-blue-900 tracking-tight">Latest Updates</h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                            Stay informed with the latest announcements from the CSWDO.
                        </p>
                    </div>

                    {news.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                            {news.map((item) => (
                                <Link
                                    href={route('news.show', item.id)}
                                    key={item.id}
                                    className="group flex flex-col bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2 h-full"
                                >
                                    {/* Image Section */}
                                    <div className="relative h-56 w-full bg-gray-200 overflow-hidden">
                                        {item.image_path ? (
                                            <img
                                                src={`/storage/${item.image_path}`}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                                <svg className="h-16 w-16 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-blue-900/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-lg shadow-sm">
                                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Update'}
                                        </div>
                                    </div>

                                    {/* Text Content */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-blue-700 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">
                                            {item.content}
                                        </p>
                                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center text-blue-600 font-bold text-sm group-hover:underline">
                                            Read Full Article
                                            <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200 mx-4">
                            <p className="text-gray-500 text-lg">No news updates available.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
