import { useState, useEffect } from 'react';
import { Link, Head, usePage, router } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';

// --- ICONS ---
const MenuIcon = () => (<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>);
const CloseIcon = () => (<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);

// Fallback Data
const defaultPrograms = [
    { title: 'Laboratory Tests', desc: 'Financial support for required medical laboratory examinations and workups.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 00-2-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { title: 'Anti-Rabies Vaccine', desc: 'Assistance for animal bite treatment and vaccination courses.', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { title: 'Funeral Assistance', desc: 'Support for burial and funeral expenses for indigent families.', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'Medicine Assistance', desc: 'Provision for prescription medicines and maintenance drugs.', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00-1.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
];

export default function Welcome({ news = [], programs = [], settings = {}, translations = {}, locale = 'en' }) {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // --- TRANSLATION HELPER ---
    const __ = (key) => (translations && translations[key]) ? translations[key] : key;

    const displayPrograms = programs.length > 0 ? programs : defaultPrograms;
    const announcement = settings.system_announcement;
    const isAccepting = settings.accepting_applications === '1' || settings.accepting_applications === true;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const switchLanguage = (lang) => {
        router.get(route('language.switch', lang), {}, { preserveScroll: true, preserveState: true });
    };

    // --- HELPER: DETERMINE DASHBOARD ROUTE ---
    const getDashboardRoute = () => {
        if (!auth.user) return route('login');
        if (auth.user.role === 'admin' || auth.user.type === 'admin') return route('admin.dashboard');
        if (auth.user.role === 'staff' || auth.user.type === 'staff') return route('staff.dashboard');
        return route('dashboard');
    };

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
                                {/* FIX: CHANGED TO Title Case ('Home', 'News') to match JSON keys */}
                                {['Home', 'News', 'Assistance', 'About'].map((item) => (
                                    <a key={item} href={`#${item.toLowerCase()}`} className="text-gray-300 hover:text-white transition-colors relative group uppercase">
                                        {__(item)}
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
                                    </a>
                                ))}

                                {/* --- ENHANCED LANGUAGE BUTTON --- */}
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition shadow-sm border border-blue-600 ml-4 group focus:outline-none focus:ring-2 focus:ring-yellow-400">
                                            {/* Universal Globe Icon */}
                                            <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>

                                            {/* Clear Label */}
                                            <span className="font-bold text-sm tracking-wide">
                                                {locale === 'fil' ? 'Tagalog' : locale === 'hil' ? 'Hiligaynon' : 'English'}
                                            </span>

                                            {/* Chevron */}
                                            <svg className="w-4 h-4 text-blue-300 group-hover:text-white transition-transform group-focus:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content width="48">
                                        <div className="p-1">
                                            <button onClick={() => switchLanguage('en')} className="flex items-center w-full px-4 py-3 text-left text-sm leading-5 text-gray-700 hover:bg-blue-50 focus:outline-none focus:bg-blue-100 transition rounded-md gap-3 group">
                                                <span className="text-xl">🇺🇸</span>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-800 group-hover:text-blue-900">English</span>
                                                    <span className="text-xs text-gray-500">International</span>
                                                </div>
                                            </button>
                                            <button onClick={() => switchLanguage('fil')} className="flex items-center w-full px-4 py-3 text-left text-sm leading-5 text-gray-700 hover:bg-blue-50 focus:outline-none focus:bg-blue-100 transition rounded-md gap-3 group">
                                                <span className="text-xl">🇵🇭</span>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-800 group-hover:text-blue-900">Tagalog</span>
                                                    <span className="text-xs text-gray-500">Filipino</span>
                                                </div>
                                            </button>
                                            <button onClick={() => switchLanguage('hil')} className="flex items-center w-full px-4 py-3 text-left text-sm leading-5 text-gray-700 hover:bg-blue-50 focus:outline-none focus:bg-blue-100 transition rounded-md gap-3 group">
                                                <span className="text-xl">🏝️</span>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-800 group-hover:text-blue-900">Hiligaynon</span>
                                                    <span className="text-xs text-gray-500">Local Dialect</span>
                                                </div>
                                            </button>
                                        </div>
                                    </Dropdown.Content>
                                </Dropdown>

                                {auth.user ? (
                                    <Link href={getDashboardRoute()} className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 px-6 py-2 rounded-full transition-transform hover:scale-105 shadow-lg">
                                        {__('My Dashboard')}
                                    </Link>
                                ) : (
                                    <div className="flex gap-4">
                                        <Link href={route('login')} className="text-white hover:text-yellow-400 transition">{__('Log In')}</Link>
                                        <Link href={route('register')} className="bg-white text-blue-900 px-5 py-2 rounded-full hover:bg-gray-100 font-bold shadow-md transition-transform hover:scale-105">{__('Get Started')}</Link>
                                    </div>
                                )}
                            </nav>
                            <button className="md:hidden text-white focus:outline-none" onClick={() => setMobileMenuOpen(true)}><MenuIcon /></button>
                        </div>
                    </header>
                </div>

                {/* MOBILE MENU (WITH BIG LANGUAGE BUTTONS) */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
                        <div className="relative bg-white w-3/4 max-w-sm h-full shadow-2xl p-6 flex flex-col">
                            <div className="flex justify-between items-center mb-8 border-b pb-4">
                                <span className="text-xl font-bold text-blue-900">MENU</span>
                                <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500 hover:text-red-500"><CloseIcon /></button>
                            </div>
                            <nav className="flex flex-col space-y-4 text-lg font-medium text-gray-700">
                                <a href="#home" onClick={() => setMobileMenuOpen(false)}>{__('Home')}</a>
                                <a href="#news" onClick={() => setMobileMenuOpen(false)}>{__('News & Updates')}</a>
                                <a href="#assistance" onClick={() => setMobileMenuOpen(false)}>{__('Assistance Programs')}</a>
                                <a href="#about" onClick={() => setMobileMenuOpen(false)}>{__('About Us')}</a>

                                {/* Mobile Language Switcher */}
                                <div className="border-t border-gray-100 pt-4 mt-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Language / Lengguwahe</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button onClick={() => { switchLanguage('en'); setMobileMenuOpen(false); }} className={`p-2 rounded-lg text-center border ${locale === 'en' ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-300' : 'border-gray-200'}`}>
                                            <div className="text-2xl">🇺🇸</div>
                                            <span className="text-xs font-bold text-gray-600 block mt-1">EN</span>
                                        </button>
                                        <button onClick={() => { switchLanguage('fil'); setMobileMenuOpen(false); }} className={`p-2 rounded-lg text-center border ${locale === 'fil' ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-300' : 'border-gray-200'}`}>
                                            <div className="text-2xl">🇵🇭</div>
                                            <span className="text-xs font-bold text-gray-600 block mt-1">FIL</span>
                                        </button>
                                        <button onClick={() => { switchLanguage('hil'); setMobileMenuOpen(false); }} className={`p-2 rounded-lg text-center border ${locale === 'hil' ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-300' : 'border-gray-200'}`}>
                                            <div className="text-2xl">🏝️</div>
                                            <span className="text-xs font-bold text-gray-600 block mt-1">HIL</span>
                                        </button>
                                    </div>
                                </div>

                                {auth.user && (
                                    <Link href={getDashboardRoute()} className="text-blue-600 font-bold mt-4 block" onClick={() => setMobileMenuOpen(false)}>
                                        {__('Go to Dashboard')}
                                    </Link>
                                )}
                            </nav>
                        </div>
                    </div>
                )}

                {/* --- 1. HERO SECTION (OFFICIAL & LOCALIZED) --- */}
                <section id="home" className="relative bg-blue-900 overflow-hidden pt-24 min-h-[90vh] flex items-center">
                    <div className="absolute inset-0">
                        <img className="w-full h-full object-cover opacity-20 mix-blend-overlay blur-sm scale-105" src="/images/aics-1.jpg" alt="Background Texture" />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900/95 to-blue-800/90"></div>
                    </div>

                    <div className="relative container mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-3/5 text-center md:text-left space-y-7">

                            {/* DUAL LOGOS */}
                            <div className="inline-flex items-center gap-4 bg-white/10 rounded-full px-5 py-2 border border-white/20 backdrop-blur-md animate-fade-in-down shadow-lg">
                                <div className="flex -space-x-2">
                                    <img src="/images/roxas-seal.png" alt="Roxas City Seal" className="h-10 w-auto drop-shadow-md z-10" />
                                    <img src="/images/cswdo-logo.jpg" alt="CSWDO Logo" className="h-10 w-auto drop-shadow-md rounded-full border-2 border-blue-900 z-0" />
                                </div>
                                <div className="h-4 w-px bg-white/30"></div>
                                <span className="text-blue-50 text-xs md:text-sm font-bold tracking-widest uppercase">Official CSWDO Program</span>
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-xl tracking-tight">
                                    {__('Compassionate Service')},<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">{__('Accessible to All')}.</span>
                                </h1>
                                <p className="text-xl md:text-2xl text-blue-200 font-serif italic opacity-90">"Bulig para sa mga Roxasnon nga ara sa krisis."</p>
                            </div>

                            <p className="text-lg text-blue-100 max-w-2xl leading-relaxed font-light border-l-4 border-yellow-500 pl-4 bg-blue-800/30 p-2 rounded-r-lg">
                                {__('The Assistance to Individuals in Crisis Situation (AICS) is a social welfare service providing medical, burial, transportation, education, food, or financial assistance for the distinct needs of a person or family.')}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
                                {isAccepting ? (
                                    <Link href={route('register')} className="bg-yellow-500 text-blue-900 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-yellow-400 hover:shadow-2xl transition transform hover:-translate-y-1 text-center border-b-4 border-yellow-600 ring-2 ring-yellow-300/50">
                                        {__('Apply for Assistance')}
                                    </Link>
                                ) : (
                                    <button disabled className="bg-gray-400 text-gray-800 px-8 py-4 rounded-xl font-bold text-lg cursor-not-allowed border-b-4 border-gray-500">
                                        {__('Applications Paused')}
                                    </button>
                                )}

                                <Link href={route('track.index')} className="px-8 py-4 rounded-xl font-bold text-lg text-white border-2 border-white/20 hover:bg-white/10 transition text-center backdrop-blur-sm flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    {__('Track Status')}
                                </Link>
                            </div>

                            {!isAccepting && (
                                <p className="mt-4 text-red-200 font-bold bg-red-900/40 border border-red-500/30 inline-block px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
                                    ⚠️ {__('Online applications are currently paused for maintenance.')}
                                </p>
                            )}
                        </div>

                        <div className="md:w-2/5 grid grid-cols-2 gap-4 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-blue-500/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
                            <img src="/images/aics-2.jpg" className="rounded-xl shadow-2xl shadow-black/60 transform translate-y-10 object-cover h-52 w-full border-[6px] border-white rotate-[-3deg] hover:rotate-0 transition duration-500 hover:scale-105 hover:z-20 hover:shadow-yellow-500/30" alt="Activity" />
                            <img src="/images/aics-3.jpg" className="rounded-xl shadow-2xl shadow-black/60 transform -translate-y-6 object-cover h-52 w-full border-[6px] border-white rotate-[3deg] hover:rotate-0 transition duration-500 hover:scale-105 hover:z-20 hover:shadow-yellow-500/30" alt="Staff" />
                        </div>
                    </div>
                </section>

                {/* --- 2. ELIGIBILITY SECTION (NEW) --- */}
                <section className="py-16 bg-white border-b border-gray-100">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 uppercase tracking-wide">{__('Who Can Avail?')}</h2>
                            <p className="text-slate-500 mt-2">{__('Eligibility Criteria for AICS Assistance')}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {[
                                { title: __('Indigent Families'), desc: __('Families with no regular income or those living below the poverty threshold.'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                                { title: __('Individuals in Crisis'), desc: __('Those facing unexpected life events (fire, calamities, death of family member).'), icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
                                { title: __('Vulnerable Sectors'), desc: __('Senior Citizens, PWDs, Solo Parents, and Out-of-School Youth.'), icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                                { title: __('Roxas City Residents'), desc: __('Must be a bona fide resident of Roxas City with valid proof of residency.'), icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
                            ].map((item, index) => (
                                <div key={index} className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:shadow-md transition text-center">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-sm text-slate-600 leading-snug">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- 3. MAYOR'S MESSAGE SECTION --- */}
                <section className="bg-white py-20 border-b border-gray-100">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto bg-blue-50 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 shadow-sm border border-blue-100">
                            <div className="shrink-0 relative">
                                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-20 transform translate-x-2 translate-y-2"></div>
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

                {/* --- 4. NEWS SECTION --- */}
                {news && news.length > 0 && (
                    <section id="news" className="py-24 bg-slate-50 scroll-mt-24">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{__('Latest Updates')}</h2>
                                <p className="text-slate-500 max-w-2xl mx-auto">{__('Official announcements from the City Social Welfare and Development Office.')}</p>
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
                                            <span className="text-blue-600 font-bold text-sm flex items-center group-hover:translate-x-2 transition-transform">{__('Read More')} &rarr;</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <div className="text-center mt-12">
                                <Link href={route('news.index')} className="inline-block px-8 py-3 border-2 border-blue-600 text-blue-600 font-bold rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                                    {__('View All News')}
                                </Link>
                            </div>
                        </div>
                    </section>
                )}

                {/* --- 5. ASSISTANCE PROGRAMS --- */}
                <section id="assistance" className="py-24 bg-gray-50 scroll-mt-24">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{__('Assistance Programs')}</h2>
                            <p className="text-slate-500 max-w-2xl mx-auto">{__('We provide financial aid for various crisis situations. Check if you are eligible.')}</p>
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

                {/* --- 6. ABOUT & CONTACT SECTION --- */}
                <section id="about" className="py-24 bg-white scroll-mt-24">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                            <div className="bg-slate-50 rounded-2xl shadow-sm p-8 border border-slate-100 h-full">
                                <h2 className="text-3xl font-bold text-slate-900 mb-6">{__('About Assista & CSWDO')}</h2>
                                <p className="text-slate-600 leading-relaxed mb-4 text-lg">
                                    {__('The Assistance to Individuals in Crisis Situation (AICS) is a social welfare service providing medical, burial, transportation, education, food, or financial assistance for the distinct needs of a person or family.')}
                                </p>
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    {__('Our mission is to provide fast, accessible, and transparent financial assistance to the residents of Roxas City, ensuring that help reaches those who need it most, when they need it most.')}
                                </p>
                            </div>

                            <div className="bg-blue-900 rounded-2xl shadow-lg p-8 text-white h-full flex flex-col justify-center">
                                <h2 className="text-3xl font-bold mb-8">{__('Contact Us')}</h2>
                                <ul className="space-y-8">
                                    <li className="flex items-start gap-5">
                                        <div className="bg-blue-800 p-3 rounded-xl shrink-0">
                                            <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">{__('Visit our Office')}</p>
                                            <p className="text-xl font-bold leading-snug">{settings.office_address || 'Inzo Arnaldo Village, Roxas City'}</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-5">
                                        <div className="bg-blue-800 p-3 rounded-xl shrink-0">
                                            <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">{__('Call Hotline')}</p>
                                            <p className="text-2xl font-bold tracking-tight">{settings.office_hotline || '(036) 52026-83'}</p>
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
