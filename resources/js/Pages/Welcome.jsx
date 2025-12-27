import { useState, useEffect } from 'react';
import { Link, Head } from '@inertiajs/react';

// --- ICONS ---
const MenuIcon = () => (<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>);
const CloseIcon = () => (<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);

// Fallback Data (If DB is empty, use these defaults)
const defaultPrograms = [
    { title: 'Laboratory Tests', desc: 'Financial support for required medical laboratory examinations and workups.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { title: 'Anti-Rabies Vaccine', desc: 'Assistance for animal bite treatment and vaccination courses.', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { title: 'Funeral Assistance', desc: 'Support for burial and funeral expenses for indigent families.', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'Medicine Assistance', desc: 'Provision for prescription medicines and maintenance drugs.', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { title: 'Hospitalization', desc: 'Help with hospital bills, confinement costs, and surgical procedures.', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { title: 'Chemotherapy', desc: 'Financial aid specifically for cancer treatments and chemo sessions.', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { title: 'Diagnostic Blood Tests', desc: 'Coverage for specialized blood chemistry and diagnostic scans.', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' }
];

export default function Welcome({ auth, news = [], programs = [] }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Use DB programs if available, otherwise use default
    const displayPrograms = programs.length > 0 ? programs : defaultPrograms;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head title="Welcome to Assista" />
            <div className="min-h-screen bg-gray-50 text-gray-800 font-sans scroll-smooth">

                {/* HEADER */}
                <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-blue-900 shadow-md py-2' : 'bg-blue-800 py-4'}`}>
                    <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
                        <a href="#home" className="flex items-center gap-3 group">
                            <div className="bg-white p-1 rounded-full group-hover:scale-105 transition-transform">
                                <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
                            </div>
                            <span className="text-xl md:text-2xl font-extrabold text-white tracking-wide">ASSISTA</span>
                        </a>

                        <nav className="hidden md:flex items-center space-x-8 text-sm font-bold tracking-wide">
                            {['HOME', 'NEWS', 'ASSISTANCE', 'ABOUT'].map((item) => (
                                <a key={item} href={`#${item.toLowerCase()}`} className="text-gray-300 hover:text-white transition-colors relative group">
                                    {item}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
                                </a>
                            ))}
                            {auth.user ? (
                                <Link href={route('dashboard')} className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 px-6 py-2 rounded-full transition-transform hover:scale-105 shadow-lg">DASHBOARD</Link>
                            ) : (
                                <div className="flex gap-4">
                                    <Link href={route('login')} className="text-white hover:text-yellow-400 transition">LOG IN</Link>
                                    <Link href={route('register')} className="bg-white text-blue-900 px-5 py-2 rounded-full hover:bg-gray-100 font-bold shadow-md transition-transform hover:scale-105">GET STARTED</Link>
                                </div>
                            )}
                        </nav>
                        <button className="md:hidden text-white focus:outline-none" onClick={() => setMobileMenuOpen(true)}><MenuIcon /></button>
                    </div>
                </header>

                {/* MOBILE MENU */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
                        <div className="relative bg-white w-3/4 max-w-sm h-full shadow-2xl p-6 flex flex-col">
                            <div className="flex justify-between items-center mb-8 border-b pb-4">
                                <span className="text-xl font-bold text-blue-900">MENU</span>
                                <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500 hover:text-red-500"><CloseIcon /></button>
                            </div>
                            <nav className="flex flex-col space-y-4 text-lg font-medium text-gray-700">
                                <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
                                <a href="#news" onClick={() => setMobileMenuOpen(false)}>News & Updates</a>
                                <a href="#assistance" onClick={() => setMobileMenuOpen(false)}>Assistance Programs</a>
                                <a href="#about" onClick={() => setMobileMenuOpen(false)}>About Us</a>
                            </nav>
                        </div>
                    </div>
                )}

                {/* HERO SECTION */}
                <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white scroll-mt-24">
                    <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center gap-12">
                        <div className="md:w-1/2 text-center md:text-left z-10">
                            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">Assistance to Individuals in <span className="text-blue-700">Crisis Situation (AICS)</span></h1>
                            <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto md:mx-0">Providing assistance and essential support to individuals in need. Our platform offers immediate medical, burial, and other financial assistance to families in crisis.</p>
                            <div className="flex gap-4 justify-center md:justify-start">
                                <Link href={auth.user ? route('dashboard') : route('register')} className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold shadow-lg">APPLY NOW</Link>
                                <a href="#assistance" className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold hover:bg-slate-50">VIEW PROGRAMS</a>
                            </div>
                        </div>
                        <div className="md:w-1/2 relative"><img src="/images/assista-bg.png" alt="Hero" className="relative z-10 w-full max-w-md mx-auto drop-shadow-2xl" /></div>
                    </div>
                </section>

                {/* --- NEWS SECTION --- */}
                {news && news.length > 0 && (
                    <section id="news" className="py-24 bg-slate-50 scroll-mt-24">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Latest Updates</h2>
                                <p className="text-slate-500 max-w-2xl mx-auto">Official announcements from the City Social Welfare and Development Office.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {news.slice(0, 3).map((article) => (
                                    <Link key={article.id} href={route('news.show', article.id)} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-slate-100">
                                        <div className="h-48 overflow-hidden bg-gray-200 relative">
                                            {article.image_path ? (
                                                <img src={`/storage/${article.image_path}`} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-400"><svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                                            )}
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-900 shadow-sm">
                                                {new Date(article.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">{article.title}</h3>
                                            <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">{article.content}</p>
                                            <span className="text-blue-600 font-bold text-sm flex items-center group-hover:translate-x-2 transition-transform">Read More &rarr;</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <div className="text-center mt-12">
                                <Link href={route('news.index')} className="inline-block px-8 py-3 border-2 border-blue-600 text-blue-600 font-bold rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                                    View All News
                                </Link>
                            </div>
                        </div>
                    </section>
                )}

                {/* DYNAMIC ASSISTANCE PROGRAMS */}
                <section id="assistance" className="py-24 bg-gray-50 scroll-mt-24">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Assistance Programs</h2>
                            <p className="text-slate-500 max-w-2xl mx-auto">We provide financial aid for various crisis situations. Check if you are eligible.</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6">
                            {displayPrograms.map((item, idx) => (
                                <div key={idx} className="w-full sm:w-[48%] lg:w-[22%] p-8 border border-slate-100 rounded-2xl bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center flex flex-col items-center">
                                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon_path || item.icon} />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-800 mb-2 min-h-[3rem] flex items-center justify-center">{item.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{item.description || item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ABOUT SECTION */}
                <section id="about" className="py-24 bg-white scroll-mt-24">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto bg-slate-50 rounded-2xl shadow-sm p-8 md:p-12 border border-slate-100 text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">About Assista & AICS</h2>
                            <p className="text-slate-600 leading-relaxed">The <strong>Assista</strong> system is a web-based platform designed to digitize and streamline the application process for the DSWD's <strong>Assistance to Individuals in Crisis Situation (AICS)</strong> program.</p>
                        </div>
                    </div>
                </section>

                <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm">
                    &copy; 2025 City Social Welfare and Development Office. All rights reserved.
                </footer>
            </div>
        </>
    );
}
