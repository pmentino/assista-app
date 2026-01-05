import { useState, useEffect } from 'react';
import { Link, Head, usePage } from '@inertiajs/react';

// --- ICONS ---
const MenuIcon = () => (<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>);
const CloseIcon = () => (<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);

// Fallback Data
const defaultPrograms = [
    { title: 'Laboratory Tests', desc: 'Financial support for required medical laboratory examinations and workups.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { title: 'Anti-Rabies Vaccine', desc: 'Assistance for animal bite treatment and vaccination courses.', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { title: 'Funeral Assistance', desc: 'Support for burial and funeral expenses for indigent families.', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'Medicine Assistance', desc: 'Provision for prescription medicines and maintenance drugs.', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
];

export default function Welcome({ news = [], programs = [], settings = {} }) {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const displayPrograms = programs.length > 0 ? programs : defaultPrograms;
    const announcement = settings.system_announcement;
    const isAccepting = settings.accepting_applications === '1' || settings.accepting_applications === true;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head title="Welcome to Assista" />
            <div className="min-h-screen bg-gray-50 text-gray-800 font-sans scroll-smooth">

                {/* --- FIXED NAVIGATION WRAPPER --- */}
                <div className="fixed top-0 w-full z-50">
                    {announcement && (
                        <div className="bg-yellow-400 text-blue-900 text-center py-2 px-4 text-sm font-bold tracking-wide shadow-sm relative z-[60]">
                            <span className="mr-2">📢</span> {announcement}
                        </div>
                    )}
                    <header className={`w-full transition-all duration-300 ${scrolled ? 'bg-blue-900 shadow-md py-2' : 'bg-blue-900/95 backdrop-blur-sm py-4'}`}>
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
                </div>

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

                {/* --- 1. HERO SECTION (POLISHED) --- */}
<section id="home" className="relative bg-blue-900 overflow-hidden pt-24 min-h-[85vh] flex items-center">
    {/* Background Image with Overlay */}
    <div className="absolute inset-0">
        {/* WE ARE USING YOUR REAL UPLOADED PHOTO HERE FOR TEXTURE */}
        <img
            className="w-full h-full object-cover opacity-20 mix-blend-overlay blur-sm"
            src="/images/aics-1.jpg"
            alt="Background Texture"
        />
        {/* Gradient Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/95 to-blue-800/90"></div>
    </div>

    <div className="relative container mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row items-center gap-12">
        {/* Left Content */}
        <div className="md:w-3/5 text-center md:text-left space-y-6">
            <div className="inline-flex items-center gap-3 bg-white/10 rounded-full px-4 py-1.5 border border-white/20 backdrop-blur-md mb-4 animate-fade-in-down shadow-sm">
                <img src="/images/roxas-seal.png" alt="Seal" className="h-8 w-auto drop-shadow-md" />
                <span className="text-blue-50 text-xs font-bold tracking-widest uppercase">Official Program of Roxas City</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
                Compassionate Service,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">Accessible to All.</span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100 max-w-2xl leading-relaxed font-light">
                The <strong>CSWDO AICS Program</strong> provides immediate financial aid for medical, burial, and crisis situations. Apply online today for faster, transparent processing.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                {isAccepting ? (
                    <Link href={route('register')} className="bg-yellow-500 text-blue-900 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-yellow-400 hover:shadow-2xl transition transform hover:-translate-y-1 text-center border-b-4 border-yellow-600">
                        Apply for Assistance
                    </Link>
                ) : (
                    <button disabled className="bg-gray-400 text-gray-800 px-8 py-4 rounded-xl font-bold text-lg cursor-not-allowed border-b-4 border-gray-500">
                        Applications Paused
                    </button>
                )}
                <a href="#assistance" className="px-8 py-4 rounded-xl font-bold text-lg text-white border-2 border-white/20 hover:bg-white/10 transition text-center backdrop-blur-sm">
                    View Programs
                </a>
            </div>

            {!isAccepting && (
                <p className="mt-4 text-red-200 font-bold bg-red-900/40 border border-red-500/30 inline-block px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
                    ⚠️ Online applications are currently paused for maintenance.
                </p>
            )}
        </div>

        {/* Right Content: Photo Grid (POLAROID STYLE - TWEAKED) */}
<div className="md:w-2/5 grid grid-cols-2 gap-4 relative">
    {/* Stronger decorative glow behind images */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/30 rounded-full blur-3xl -z-10"></div>

    <img
        src="/images/aics-2.jpg"
        className="rounded-xl shadow-2xl shadow-black/40 transform translate-y-8 object-cover h-48 w-full border-[6px] border-white rotate-[-3deg] hover:rotate-0 transition duration-500 hover:scale-105 hover:z-20 hover:shadow-yellow-500/20"
        alt="Distribution Activity"
    />
    <img
        src="/images/aics-3.jpg"
        className="rounded-xl shadow-2xl shadow-black/40 transform -translate-y-4 object-cover h-48 w-full border-[6px] border-white rotate-[3deg] hover:rotate-0 transition duration-500 hover:scale-105 hover:z-20 hover:shadow-yellow-500/20"
        alt="CSWDO Staff"
    />
</div>
    </div>
</section>

                {/* --- 2. MAYOR'S MESSAGE SECTION (NEW) --- */}
                <section className="bg-white py-20 border-b border-gray-100">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto bg-blue-50 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 shadow-sm border border-blue-100">
                            <div className="shrink-0 relative">
                                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-20 transform translate-x-2 translate-y-2"></div>
                                {/* Make sure 'mayor.jpg' exists in public/images/ */}
                                <img src="/images/mayor.jpg" alt="Mayor Ronnie Dadivas" className="relative w-48 h-48 md:w-56 md:h-56 object-cover rounded-full border-4 border-white shadow-xl" />
                            </div>
                            <div className="text-center md:text-left">
                                <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">"Serbisyo nga tinud-anay para sa pumuluyo."</h2>
                                <p className="text-slate-600 leading-relaxed italic mb-6 text-lg">
                                    "We are committed to bringing government services closer to the people. With the Assista system, we ensure that every Roxasnon receives the help they need efficiently, transparently, and with dignity."
                                </p>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900">Hon. Ronnie T. Dadivas</h4>
                                    <p className="text-blue-600 font-medium text-sm uppercase tracking-wide">City Mayor, Roxas City</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 3. NEWS SECTION (KEPT AS IS) --- */}
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

                {/* --- 4. ASSISTANCE PROGRAMS (KEPT AS IS) --- */}
                <section id="assistance" className="py-24 bg-gray-50 scroll-mt-24">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Assistance Programs</h2>
                            <p className="text-slate-500 max-w-2xl mx-auto">We provide financial aid for various crisis situations. Check if you are eligible.</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6">
                            {displayPrograms.map((item, idx) => (
                                <div key={idx} className="w-full sm:w-[48%] lg:w-[22%] p-8 border border-slate-100 rounded-2xl bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center flex flex-col items-center h-full">
                                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon_path || item.icon} />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-800 mb-2 min-h-[3rem] flex items-center justify-center">{item.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed flex-1">{item.description || item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- 5. ABOUT & CONTACT SECTION (KEPT AS IS) --- */}
                <section id="about" className="py-24 bg-white scroll-mt-24">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                            {/* Left: About Text */}
                            <div className="bg-slate-50 rounded-2xl shadow-sm p-8 border border-slate-100 h-full">
                                <h2 className="text-3xl font-bold text-slate-900 mb-6">About Assista & CSWDO</h2>
                                <p className="text-slate-600 leading-relaxed mb-4 text-lg">
                                    The <strong>Assista</strong> system is a premier initiative by the Roxas City Government to digitize and streamline the application process for the DSWD's <strong>Assistance to Individuals in Crisis Situation (AICS) </strong> program.
                                </p>
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    Our mission is to provide fast, accessible, and transparent financial assistance to the residents of Roxas City, ensuring that help reaches those who need it most, when they need it most.
                                </p>
                            </div>

                            {/* Right: Contact Information */}
                            <div className="bg-blue-900 rounded-2xl shadow-lg p-8 text-white h-full flex flex-col justify-center">
                                <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
                                <ul className="space-y-8">
                                    <li className="flex items-start gap-5">
                                        <div className="bg-blue-800 p-3 rounded-xl shrink-0">
                                            <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Visit our Office</p>
                                            <p className="text-xl font-bold leading-snug">Inzo Arnaldo Village,<br/>Roxas City, 5800</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-5">
                                        <div className="bg-blue-800 p-3 rounded-xl shrink-0">
                                            <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Call Hotline</p>
                                            <p className="text-2xl font-bold tracking-tight">(036) 5206-83</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm border-t border-slate-800">
                    <p className="mb-2">&copy; 2025 City Social Welfare and Development Office (CSWDO). All rights reserved.</p>
                    <p>Roxas City Government • Western Visayas, Philippines</p>
                </footer>
            </div>
        </>
    );
}
