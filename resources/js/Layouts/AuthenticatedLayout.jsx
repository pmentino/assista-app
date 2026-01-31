import { useState, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage, router } from '@inertiajs/react';
import { Toaster, toast } from 'react-hot-toast'; // Kept for other parts, but we use custom for main actions
import NotificationBell from '@/Components/NotificationBell';

export default function AuthenticatedLayout({ user, header, children }) {
    const { props } = usePage();
    const { locale = 'en', translations = {}, flash = {} } = props;
    const __ = (key) => (translations && translations[key]) ? translations[key] : key;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

    // --- 1. TOAST BUFFER STATE (The Fix) ---
    // We store the message here so it survives background refreshes
    const [toastInfo, setToastInfo] = useState(null);

    // Font Size Logic
    const fontSizes = ['text-sm', 'text-base', 'text-lg'];
    const [fontIndex, setFontIndex] = useState(() => {
        const saved = localStorage.getItem('fontSize');
        return fontSizes.includes(saved) ? fontSizes.indexOf(saved) : 1;
    });

    const currentUser = user || props.auth?.user || {};
    const isAdmin = currentUser?.role === 'admin' || currentUser?.type === 'admin';
    const isStaff = currentUser?.role === 'staff' || currentUser?.type === 'staff';
    const isApplicant = !isAdmin && !isStaff;

    // --- EFFECTS ---
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    useEffect(() => {
        document.documentElement.classList.remove(...fontSizes);
        document.documentElement.classList.add(fontSizes[fontIndex]);
        localStorage.setItem('fontSize', fontSizes[fontIndex]);
    }, [fontIndex]);

    // --- 2. SMART TOAST LOGIC (Capture & Hold) ---
    useEffect(() => {
        // Only trigger if a NEW message actually arrived from the backend
        if (flash.message || flash.success || flash.warning || flash.error) {

            // Save it to local state immediately
            setToastInfo({
                message: flash.message,
                success: flash.success,
                warning: flash.warning,
                error: flash.error
            });

            // Set a timer to clear the LOCAL state after 5 seconds
            const timer = setTimeout(() => {
                setToastInfo(null);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [flash]); // Only run when the 'flash' prop changes

    // --- NAVIGATION ITEMS ---
    const navItems = [
        ...(isApplicant ? [
            { name: __('My Dashboard'), route: 'dashboard', icon: null },
        ] : []),

        ...(isStaff ? [
            { name: 'Staff Dashboard', route: 'staff.dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
            { name: 'All Applications', route: 'staff.applications.index', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
            { name: 'Reports', route: 'staff.reports.index', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        ] : []),

        ...(isAdmin ? [
            { header: 'MAIN MENU' },
            { name: 'Dashboard', route: 'admin.dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
            { name: 'All Applications', route: 'admin.applications.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
            { name: 'Reports', route: 'admin.reports.index', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },

            { header: 'MANAGEMENT' },
            { name: 'Users', route: 'admin.users.index', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
            { name: 'News & Updates', route: 'admin.news.index', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
            { name: 'Programs', route: 'admin.programs.index', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00-1.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },

            { header: 'SYSTEM' },
            { name: 'Audit Logs', route: 'admin.audit-logs', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
            { name: 'Settings', route: 'admin.settings.index', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
        ] : []),
    ];

    return (
        <div className={`h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
            <Toaster position="top-right" />

            {/* --- 3. RENDER USING LOCAL 'toastInfo' STATE (Not 'flash' prop) --- */}
            {toastInfo && (
                <div className="fixed top-24 right-5 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">

                    {/* SUCCESS / DEFAULT (Green) */}
                    {(toastInfo.message || toastInfo.success) && (
                        <div className="bg-white dark:bg-gray-800 border-l-4 border-green-500 rounded-lg shadow-2xl p-4 flex items-start animate-fade-in-left pointer-events-auto ring-1 ring-black/5 dark:ring-white/10">
                            <div className="flex-shrink-0 text-green-500">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div className="ml-3 w-0 flex-1">
                                <h3 className="text-sm font-bold text-green-900 dark:text-green-300">Success</h3>
                                <p className="text-sm text-green-700 dark:text-green-400 mt-1">{toastInfo.message || toastInfo.success}</p>
                            </div>
                            <button onClick={() => setToastInfo(null)} className="ml-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    )}

                    {/* WARNING / REJECTION (Orange/Red) */}
                    {toastInfo.warning && (
                        <div className="bg-white dark:bg-gray-800 border-l-4 border-orange-500 rounded-lg shadow-2xl p-4 flex items-start animate-fade-in-left pointer-events-auto ring-1 ring-black/5 dark:ring-white/10">
                            <div className="flex-shrink-0 text-orange-500">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <div className="ml-3 w-0 flex-1">
                                <h3 className="text-sm font-bold text-orange-800 dark:text-orange-300">Attention</h3>
                                <p className="text-sm text-orange-700 dark:text-orange-200 mt-1">{toastInfo.warning}</p>
                            </div>
                            <button onClick={() => setToastInfo(null)} className="ml-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    )}

                    {/* ERROR / SYSTEM FAIL (Red) */}
                    {toastInfo.error && (
                        <div className="bg-white dark:bg-gray-800 border-l-4 border-red-600 rounded-lg shadow-2xl p-4 flex items-start animate-fade-in-left pointer-events-auto ring-1 ring-black/5 dark:ring-white/10">
                            <div className="flex-shrink-0 text-red-600">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div className="ml-3 w-0 flex-1">
                                <h3 className="text-sm font-bold text-red-800 dark:text-red-300">System Error</h3>
                                <p className="text-sm text-red-700 dark:text-red-200 mt-1">{toastInfo.error}</p>
                            </div>
                            <button onClick={() => setToastInfo(null)} className="ml-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-1 overflow-hidden">
                {/* --- SIDEBAR --- */}
                {!isApplicant && (
                    <div className={`fixed top-0 left-0 z-30 w-64 bg-blue-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
                        <div className="flex items-center justify-center h-16 bg-blue-950 border-b border-blue-800">
                            <Link href="/" className="flex items-center gap-2">
                                <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
                                <span className="text-xl font-bold tracking-widest">ASSISTA</span>
                            </Link>
                        </div>
                        <nav className="mt-5 px-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)] custom-scrollbar">
                            {navItems.map((item, index) => (
                                item.header ? (
                                    <div key={index} className="pt-4 pb-1 pl-3 text-xs font-bold text-blue-300 uppercase tracking-wider">{item.header}</div>
                                ) : (
                                    <Link
                                        key={index}
                                        href={route(item.route)}
                                        className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all ${
                                            route().current(item.route) || route().current(item.route + '.*')
                                                ? 'bg-yellow-500 text-blue-900 shadow-md'
                                                : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                                        }`}
                                    >
                                        <svg className={`mr-3 h-5 w-5 ${route().current(item.route) ? 'text-blue-900' : 'text-blue-300 group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                        </svg>
                                        {item.name}
                                    </Link>
                                )
                            ))}
                        </nav>
                    </div>
                )}

                {/* --- MAIN CONTENT AREA --- */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <header className={`h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm relative z-20 ${darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'}`}>
                        {/* LEFT CONTROLS */}
                        <div className="flex items-center gap-4">
                            {!isApplicant && (
                                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                                </button>
                            )}
                            {isApplicant && (
                                <Link href="/" className="flex items-center gap-2">
                                    <img src="/images/logo.png" alt="Logo" className="h-8 w-auto bg-white rounded-full p-1 border border-blue-100" />
                                    <span className={`text-xl font-bold tracking-widest hidden sm:block ${darkMode ? 'text-white' : 'text-blue-900'}`}>ASSISTA</span>
                                </Link>
                            )}
                        </div>

                        {/* APPLICANT NAVIGATION */}
                        {isApplicant && (
                            <div className="hidden md:flex space-x-8">
                                <Link href={route('dashboard')} className={`font-bold border-b-2 px-1 pt-1 text-sm ${route().current('dashboard') ? 'border-blue-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300'}`}>
                                    {__('My Dashboard')}
                                </Link>
                            </div>
                        )}

                        {/* RIGHT ACTIONS */}
                        <div className="flex items-center gap-3 sm:gap-6">
                            {/* Applicant Language/Font Controls */}
                            {isApplicant && (
                                <>
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full transition shadow-sm group">
                                            <svg className="w-4 h-4 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="font-bold text-xs tracking-wide uppercase">{locale}</span>
                                            <svg className="w-3 h-3 text-blue-200 group-hover:text-white transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <button onClick={() => router.get(route('language.switch', 'en'))} className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"><span>🇺🇸</span> English</button>
                                        <button onClick={() => router.get(route('language.switch', 'fil'))} className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"><span>🇵🇭</span> Filipino</button>
                                        <button onClick={() => router.get(route('language.switch', 'hil'))} className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"><span>🏝️</span> Hiligaynon</button>
                                    </Dropdown.Content>
                                </Dropdown>
                                <div className={`hidden sm:flex rounded-lg p-1 ${isApplicant ? 'bg-blue-50 border border-blue-100' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                    <button onClick={() => setFontIndex(Math.max(0, fontIndex - 1))} className={`px-2 text-xs font-bold ${isApplicant ? 'text-blue-600 hover:text-blue-800' : 'text-gray-600 dark:text-gray-300'}`}>A-</button>
                                    <button onClick={() => setFontIndex(Math.min(2, fontIndex + 1))} className={`px-2 text-xs font-bold ${isApplicant ? 'text-blue-600 hover:text-blue-800' : 'text-gray-600 dark:text-gray-300'}`}>A+</button>
                                </div>
                                </>
                            )}

                            <button onClick={() => setDarkMode(!darkMode)} className={`${isApplicant ? 'text-gray-400 hover:text-yellow-500' : 'text-gray-500 hover:text-yellow-500'} transition`}>
                                {darkMode ? '🌙' : '☀️'}
                            </button>

                            <NotificationBell />

                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-2 focus:outline-none group">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold border transition ${isApplicant ? 'bg-blue-600 text-white border-blue-500 shadow-md group-hover:bg-blue-700' : 'bg-white text-blue-900 border-blue-200'}`}>
                                            {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                                        </div>
                                        <span className={`hidden md:block text-sm font-medium ${isApplicant ? 'text-gray-700 dark:text-gray-200' : 'text-gray-700 dark:text-gray-200'}`}>
                                            {currentUser.name}
                                        </span>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <div className="px-4 py-2 border-b text-xs text-gray-500">{currentUser.email}</div>
                                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button" className="text-red-600">Log Out</Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
                        {header && (
                            <div className="mb-6">
                                <div className={`p-4 sm:p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    {header}
                                </div>
                            </div>
                        )}
                        {children}
                    </main>
                </div>
            </div>

            {sidebarOpen && <div className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}
        </div>
    );
}
