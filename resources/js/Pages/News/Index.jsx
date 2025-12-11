import { Head, Link } from '@inertiajs/react';

export default function Index({ news, auth, canLogin }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Latest News & Updates" />

            <nav className="bg-blue-900 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link href="/" className="text-xl font-bold flex items-center gap-2">
                            <span className="text-white">ASSISTA</span>
                        </Link>
                        <div className="flex gap-4">
                            <Link href="/" className="hover:text-blue-200">Home</Link>
                            {auth?.user ? (
                                <Link href={route('dashboard')} className="hover:text-blue-200 font-semibold">Dashboard</Link>
                            ) : (
                                <Link href={route('login')} className="hover:text-blue-200">Log in</Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900">Latest News & Announcements</h1>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {news.data.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                            <img
                                className="h-48 w-full object-cover"
                                src={item.image_path ? `/storage/${item.image_path}` : '/images/placeholder.jpg'}
                                alt={item.title}
                                onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.jpg'; }}
                            />
                            <div className="p-6">
                                <p className="text-sm font-medium text-blue-600 mb-2">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </p>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600 line-clamp-3">{item.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 flex justify-center gap-2">
                    {news.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url}
                            className={`px-4 py-2 border rounded ${link.active ? 'bg-blue-900 text-white' : 'bg-white text-gray-700'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
