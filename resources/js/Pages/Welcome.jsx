import { useState } from 'react';
import { Link, Head } from '@inertiajs/react';

// Icon components for the mobile menu
const MenuIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
);
const CloseIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// Added 'auth' prop and defaulted 'news' to empty array
export default function Welcome({ auth, news = [] }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <Head title="Welcome to Assista" />
            <div className="min-h-screen bg-white text-gray-800">

                {/* --- HEADER --- */}
                <header id="home" className="bg-blue-800 shadow-sm sticky top-0 z-50">
                    <div className="container mx-auto flex items-center justify-between p-4">
                        <a href="#home" className="flex items-center cursor-pointer">
                            <img src="/images/logo.png" alt="Assista Logo" className="h-10 w-auto mr-3" />
                            <span className="text-2xl font-bold text-white">ASSISTA</span>
                        </a>

                        {/* DESKTOP NAV */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#home" className="text-gray-200 hover:text-white font-medium">HOME</a>

                            {/* News Link (Only if news exists) */}
                            {news && news.length > 0 && (
                                <a href="#news" className="text-gray-200 hover:text-white font-medium">NEWS</a>
                            )}

                            <a href="#services" className="text-gray-200 hover:text-white font-medium">SERVICES</a>
                            <a href="#about" className="text-gray-200 hover:text-white font-medium">ABOUT</a>

                            {/* Auth Logic: Show Dashboard if logged in, else Register/Login */}
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-md hover:bg-yellow-600 transition duration-300"
                                >
                                    DASHBOARD
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="text-gray-200 hover:text-white font-medium">LOG IN</Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-md hover:bg-yellow-600 transition duration-300"
                                    >
                                        REGISTER
                                    </Link>
                                </>
                            )}
                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button onClick={() => setMobileMenuOpen(true)} className="text-white">
                                <MenuIcon />
                            </button>
                        </div>
                    </div>
                </header>

                {/* --- MOBILE MENU OVERLAY --- */}
                {mobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 z-50">
                        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setMobileMenuOpen(false)} />
                        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white p-6 overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xl font-bold text-blue-800">MENU</span>
                                <button onClick={() => setMobileMenuOpen(false)} className="text-gray-700">
                                    <CloseIcon />
                                </button>
                            </div>
                            <div className="flex flex-col space-y-4">
                                <a href="#home" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-lg font-semibold text-gray-900 hover:bg-gray-50 rounded-md px-3">HOME</a>
                                {news && news.length > 0 && (
                                    <a href="#news" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-lg font-semibold text-gray-900 hover:bg-gray-50 rounded-md px-3">NEWS</a>
                                )}
                                <a href="#services" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-lg font-semibold text-gray-900 hover:bg-gray-50 rounded-md px-3">SERVICES</a>
                                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-lg font-semibold text-gray-900 hover:bg-gray-50 rounded-md px-3">ABOUT</a>
                                <hr className="my-4" />

                                {/* Mobile Auth Logic */}
                                {auth.user ? (
                                     <Link href={route('dashboard')} className="block w-full text-center bg-yellow-500 text-white font-bold py-3 px-6 rounded-md hover:bg-yellow-600 transition duration-300">DASHBOARD</Link>
                                ) : (
                                    <>
                                        <Link href={route('register')} className="block w-full text-center bg-yellow-500 text-white font-bold py-3 px-6 rounded-md hover:bg-yellow-600 transition duration-300">REGISTER</Link>
                                        <Link href={route('login')} className="block w-full text-center bg-blue-800 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-900 transition duration-300 mt-2">LOG IN</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}


                {/* --- HERO SECTION --- */}
                <main className="container mx-auto mt-16 px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 min-h-[80vh]">
                        <div className="md:w-1/2 text-center md:text-left pt-16 md:pt-0">
                            <img src="/images/dswd-logo.png" alt="DSWD Logo" className="h-24 md:h-32 w-auto mb-6 mx-auto md:mx-0" />
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                                Assistance to Individuals in Crisis Situation (AICS)
                            </h1>
                            <p className="mt-4 text-lg text-gray-600">
                                Providing assistance and essential support to individuals in need.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 justify-center md:justify-start">
                                {/* Smart Apply Button */}
                                <Link
                                    href={auth.user ? route('dashboard') : route('register')}
                                    className="w-full sm:w-auto text-center bg-blue-800 text-white font-bold py-4 px-8 rounded-md hover:bg-blue-900 transition duration-300"
                                >
                                    {auth.user ? 'GO TO DASHBOARD' : 'APPLY NOW'}
                                </Link>
                                <a
                                    href="#about"
                                    className="w-full sm:w-auto text-center bg-white text-blue-800 font-bold py-4 px-8 rounded-md border-2 border-blue-800 hover:bg-gray-100 transition duration-300"
                                >
                                    LEARN MORE
                                </a>
                            </div>
                        </div>
                        <div className="md:w-1/2 flex items-center justify-center">
                            <img src="/images/assista-bg.png" alt="Illustration" className="w-full h-auto max-w-lg" />
                        </div>
                    </div>
                </main>

                {/* --- NEWS SECTION --- */}
                {news && news.length > 0 && (
                    <section id="news" className="py-20 bg-white">
                        <div className="container mx-auto px-4">
                            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Latest Updates</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {news.map((article) => (
                                    <div key={article.id} className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                        {article.image_path && (
                                            <img
                                                src={`/storage/${article.image_path}`}
                                                alt={article.title}
                                                className="w-full h-48 object-cover"
                                            />
                                        )}
                                        <div className="p-6">
                                            <p className="text-sm text-gray-500 mb-2">{new Date(article.created_at).toLocaleDateString()}</p>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                                            <p className="text-gray-600 line-clamp-3">{article.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* --- SERVICES SECTION --- */}
<section id="services" className="py-20 bg-gray-50">
    <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Assistance</h2>

        {/* Changed from GRID to FLEXBOX.
            'justify-center' ensures the last row (of 3 items) is perfectly centered.
        */}
        <div className="flex flex-wrap justify-center gap-6">

            {/* Service Cards - Using fixed percentage widths to mimic a 4-column grid but with centering */}

            <div className="w-full md:w-[45%] lg:w-[22%] p-6 bg-white rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                    <svg className="w-8 h-8 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-blue-800">Laboratory Tests</h3>
                <p className="text-sm text-gray-600">Financial support for required medical laboratory examinations and workups.</p>
            </div>

            <div className="w-full md:w-[45%] lg:w-[22%] p-6 bg-white rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                    <svg className="w-8 h-8 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-blue-800">Anti-Rabies Vaccine</h3>
                <p className="text-sm text-gray-600">Assistance for animal bite treatment and vaccination courses.</p>
            </div>

            <div className="w-full md:w-[45%] lg:w-[22%] p-6 bg-white rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                    <svg className="w-8 h-8 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-blue-800">Funeral Assistance</h3>
                <p className="text-sm text-gray-600">Support for burial and funeral expenses for indigent families.</p>
            </div>

            <div className="w-full md:w-[45%] lg:w-[22%] p-6 bg-white rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                    <svg className="w-8 h-8 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-blue-800">Medicine Assistance</h3>
                <p className="text-sm text-gray-600">Provision for prescription medicines and maintenance drugs.</p>
            </div>

            {/* --- Second Row (Automatically Centered) --- */}

            <div className="w-full md:w-[45%] lg:w-[22%] p-6 bg-white rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                    <svg className="w-8 h-8 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-blue-800">Hospitalization</h3>
                <p className="text-sm text-gray-600">Help with hospital bills, confinement costs, and surgical procedures.</p>
            </div>

            <div className="w-full md:w-[45%] lg:w-[22%] p-6 bg-white rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                    <svg className="w-8 h-8 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-blue-800">Chemotherapy</h3>
                <p className="text-sm text-gray-600">Financial aid specifically for cancer treatments and chemo sessions.</p>
            </div>

            <div className="w-full md:w-[45%] lg:w-[22%] p-6 bg-white rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                    <svg className="w-8 h-8 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-blue-800">Diagnostic Blood Tests</h3>
                <p className="text-sm text-gray-600">Coverage for specialized blood chemistry and diagnostic scans.</p>
            </div>

        </div>
    </div>
</section>

                {/* --- ABOUT SECTION --- */}
                <section id="about" className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">About Assista & AICS</h2>
                            <p className="text-gray-600 leading-7 text-center">
                                The <strong>Assista</strong> system is a web-based platform designed to digitize and streamline the application process for the DSWD's <strong>Assistance to Individuals in Crisis Situation (AICS)</strong> program. AICS serves as a social safety net or a stop-gap measure to support the recovery of individuals and families from unexpected life events or crises. Our platform allows applicants to submit their requests for medical, burial, or food assistance online, reducing the need for travel and long queues. Administrators can efficiently manage, review, and update the status of these applications, ensuring a faster and more transparent process for everyone involved.
                            </p>
                        </div>
                    </div>
                </section>

                <footer className="py-10 text-center text-sm text-gray-500">
                    Assista © 2025 - A Capstone Project for Filamer Christian University.
                </footer>
            </div>
        </>
    );
}
