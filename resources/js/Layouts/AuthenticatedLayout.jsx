import { useState, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage, router } from '@inertiajs/react';
import { Toaster, toast } from 'react-hot-toast';
import NotificationBell from '@/Components/NotificationBell';

export default function AuthenticatedLayout({ user, header, children }) {
    // 1. GET LOCALE & TRANSLATIONS (With Safe Defaults)
    const { props } = usePage();
    // FIX: Default 'translations' to an empty object {} to prevent crashes
    const { locale = 'en', translations = {} } = props;

    // 2. HELPER FUNCTION: Translate text
    // FIX: Added optional chaining (?.) just in case
    const __ = (key) => (translations && translations[key]) ? translations[key] : key;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    // --- ACCESSIBILITY STATES ---
    const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
    const [fontSize, setFontSize] = useState(localStorage.getItem('fontSize') || 'text-base');

    const currentUser = user || props.auth?.user || {};
    const isAdmin = currentUser?.role === 'admin' || currentUser?.type === 'admin';
    const isStaff = currentUser?.role === 'staff' || currentUser?.type === 'staff';

    // LOGIC: Check if the user is a regular applicant (not staff/admin)
    const isApplicant = !isAdmin && !isStaff;
    const showApplicantDashboard = isApplicant;

    // --- LANGUAGE SWITCHER HANDLER ---
    const switchLanguage = (lang) => {
        // USE WINDOW.LOCATION INSTEAD OF ROUTER.GET
        // This forces a hard refresh, ensuring the session updates immediately.
        window.location.href = route('language.switch', lang);
    };

    // --- EFFECT: HANDLE DARK MODE ---
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    // --- EFFECT: HANDLE FONT SIZE ---
    useEffect(() => {
        document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');
        document.documentElement.classList.add(fontSize);
        localStorage.setItem('fontSize', fontSize);
    }, [fontSize]);

    const toggleTheme = () => setDarkMode(!darkMode);

    const cycleFontSize = () => {
        if (fontSize === 'text-sm') setFontSize('text-base');
        else if (fontSize === 'text-base') setFontSize('text-lg');
        else if (fontSize === 'text-lg') setFontSize('text-xl');
        else setFontSize('text-sm');
    };

    // --- TOAST NOTIFICATIONS ---
    useEffect(() => {
        if (props.flash?.message) toast.success(props.flash.message);
        if (props.flash?.success) toast.success(props.flash.success);
        if (props.flash?.error) {
            toast.error(props.flash.error, {
                duration: 5000,
                style: { border: '1px solid #EF4444', color: '#B91C1C', background: '#FEF2F2' },
            });
        }
    }, [props.flash]);

    const navLinkClasses = (isActive) =>
        isActive
            ? 'inline-flex items-center px-1 pt-1 border-b-2 border-yellow-400 text-sm font-medium text-white focus:outline-none transition duration-150 ease-in-out'
            : 'inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-300 hover:text-white hover:border-gray-300 focus:outline-none focus:text-white focus:border-gray-300 transition duration-150 ease-in-out';

    const mobileNavLinkClasses = (isActive) =>
        isActive
            ? 'block pl-3 pr-4 py-2 border-l-4 border-yellow-400 text-base font-medium text-white bg-blue-900 focus:outline-none focus:text-white focus:bg-blue-900 transition duration-150 ease-in-out'
            : 'block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:text-white hover:bg-blue-700 hover:border-gray-300 focus:outline-none focus:text-white focus:bg-blue-700 transition duration-150 ease-in-out';

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
            <Toaster position="top-right" />

            {props.flash?.error && (
                <div className="bg-red-600 text-white px-6 py-4 text-center font-bold text-lg sticky top-0 z-[100] shadow-xl animate-pulse flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{props.flash.error}</span>
                </div>
            )}

            <nav className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-800 border-blue-900'} border-b sticky top-0 z-50 transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <img src="/images/logo.png" alt="Assista Logo" className="block h-9 w-auto" />
                                </Link>
                            </div>

                            {/* --- DESKTOP NAVIGATION --- */}
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                {showApplicantDashboard && (
                                    <Link href={route('dashboard')} className={navLinkClasses(route().current('dashboard'))}>
                                        {__('My Dashboard')}
                                    </Link>
                                )}

                                {isStaff && (
                                    <>
                                        <Link href={route('staff.dashboard')} className={navLinkClasses(route().current('staff.dashboard'))}>
                                            Staff Dashboard
                                        </Link>
                                        <Link href={route('staff.applications.index')} className={navLinkClasses(route().current('staff.applications.index'))}>
                                            All Applications
                                        </Link>
                                        <Link href={route('staff.reports.index')} className={navLinkClasses(route().current('staff.reports.*'))}>
                                            Reports
                                        </Link>
                                    </>
                                )}

                                {isAdmin && (
                                    <>
                                        <Link href={route('admin.dashboard')} className={navLinkClasses(route().current('admin.dashboard'))}>
                                            Admin Dashboard
                                        </Link>
                                        <Link href={route('admin.applications.index')} className={navLinkClasses(route().current('admin.applications.*'))}>
                                            All Applications
                                        </Link>
                                        <Link href={route('admin.reports.index')} className={navLinkClasses(route().current('admin.reports.*'))}>
                                            Reports
                                        </Link>
                                        <Link href={route('admin.users.index')} className={navLinkClasses(route().current('admin.users.*'))}>
                                            Manage Users
                                        </Link>
                                        <Link href={route('admin.news.index')} className={navLinkClasses(route().current('admin.news.*'))}>
                                            News
                                        </Link>
                                        <Link href={route('admin.programs.index')} className={navLinkClasses(route().current('admin.programs.*'))}>
                                            Programs
                                        </Link>
                                        <Link href={route('admin.audit-logs')} className={navLinkClasses(route().current('admin.audit-logs'))}>
                                            Audit Logs
                                        </Link>
                                        <Link href={route('admin.settings.index')} className={navLinkClasses(route().current('admin.settings.*'))}>
                                            Settings
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Settings Dropdown & Bell */}
                        <div className="hidden sm:flex sm:items-center sm:ml-6 gap-3">

                            {/* --- LANGUAGE SWITCHER (HIDDEN FOR STAFF/ADMIN) --- */}
                            {isApplicant && (
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button type="button" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-bold rounded-md text-white bg-black/20 hover:bg-black/30 focus:outline-none transition ease-in-out duration-150 uppercase">
                                                {locale || 'EN'}
                                                <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <button onClick={() => switchLanguage('en')} className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out">
                                            English
                                        </button>
                                        <button onClick={() => switchLanguage('fil')} className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out">
                                            Filipino
                                        </button>
                                        <button onClick={() => switchLanguage('hil')} className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out">
                                            Hiligaynon
                                        </button>
                                    </Dropdown.Content>
                                </Dropdown>
                            )}

                            {/* --- ACCESSIBILITY CONTROLS --- */}
                            <div className="flex items-center bg-black/20 rounded-full p-1 border border-white/10">
                                {/* Font Size Toggle */}
                                <button
                                    onClick={cycleFontSize}
                                    className="p-1.5 rounded-full text-gray-200 hover:text-white hover:bg-white/10 transition"
                                    title="Change Font Size"
                                >
                                    <span className="font-serif font-bold text-xs">A</span>
                                    <span className="font-serif font-bold text-lg ml-0.5">A</span>
                                </button>

                                {/* Dark Mode Toggle */}
                                <button
                                    onClick={toggleTheme}
                                    className="p-1.5 rounded-full text-yellow-300 hover:text-yellow-200 hover:bg-white/10 transition ml-1"
                                    title="Toggle Dark Mode"
                                >
                                    {darkMode ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            <NotificationBell />

                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button type="button" className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-200 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-800 hover:text-white'} focus:outline-none transition ease-in-out duration-150`}>
                                                {currentUser.name || 'Account'}
                                                <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>{__('Profile')}</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">{__('Log Out')}</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Hamburger */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            {/* Mobile Language Switcher (Hidden for Staff/Admin) */}
                            {isApplicant && (
                                <button onClick={() => switchLanguage(locale === 'en' ? 'fil' : 'en')} className="text-gray-200 p-2 font-bold uppercase text-xs">
                                    {locale || 'EN'}
                                </button>
                            )}

                            <button onClick={toggleTheme} className="text-gray-200 p-2">
                                {darkMode ? '☀️' : '🌙'}
                            </button>
                            <div className="mr-2">
                                <NotificationBell />
                            </div>
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-blue-700 focus:outline-none transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- MOBILE MENU --- */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ` sm:hidden ${darkMode ? 'bg-gray-800' : 'bg-blue-800'} border-t border-blue-900`}>
                    <div className="pt-2 pb-3 space-y-1">
                        <button onClick={cycleFontSize} className={`w-full text-left pl-3 pr-4 py-2 text-base font-medium ${darkMode ? 'text-gray-300' : 'text-blue-100'}`}>
                            Adjust Font Size: {fontSize.replace('text-', '').toUpperCase()}
                        </button>

                        {/* Only show Language options for Applicant */}
                        {isApplicant && (
                            <div className={`pl-3 pr-4 py-2 text-base font-medium ${darkMode ? 'text-gray-300' : 'text-blue-100'}`}>
                                Language:
                                <button onClick={() => switchLanguage('en')} className="ml-2 underline">EN</button>
                                <button onClick={() => switchLanguage('fil')} className="ml-2 underline">FIL</button>
                                <button onClick={() => switchLanguage('hil')} className="ml-2 underline">HIL</button>
                            </div>
                        )}

                        {showApplicantDashboard && (
                            <Link href={route('dashboard')} className={mobileNavLinkClasses(route().current('dashboard'))}>
                                {__('My Dashboard')}
                            </Link>
                        )}
                        {isStaff && (
                            <>
                                <Link href={route('staff.dashboard')} className={mobileNavLinkClasses(route().current('staff.dashboard'))}>
                                    Staff Dashboard
                                </Link>
                                <Link href={route('staff.applications.index')} className={mobileNavLinkClasses(route().current('staff.applications.index'))}>
                                    All Applications
                                </Link>
                            </>
                        )}
                        {isAdmin && (
                            <>
                                <Link href={route('admin.dashboard')} className={mobileNavLinkClasses(route().current('admin.dashboard'))}>
                                    Admin Dashboard
                                </Link>
                                <Link href={route('admin.applications.index')} className={mobileNavLinkClasses(route().current('admin.applications.*'))}>
                                    All Applications
                                </Link>
                                <Link href={route('admin.reports.index')} className={mobileNavLinkClasses(route().current('admin.reports.*'))}>
                                    Reports
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="pt-4 pb-4 border-t border-blue-700">
                        <div className="px-4 flex items-center">
                            <div className="shrink-0">
                                <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold text-lg">
                                    {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                                </div>
                            </div>
                            <div className="ml-3">
                                <div className="font-medium text-base text-white">{currentUser.name}</div>
                                <div className="font-medium text-sm text-blue-200">{currentUser.email}</div>
                            </div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <Link href={route('profile.edit')} className="block w-full pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-blue-200 hover:text-white hover:bg-blue-700 transition">
                                {__('Profile')}
                            </Link>
                            <Link href={route('logout')} method="post" as="button" className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-blue-200 hover:text-white hover:bg-blue-700 transition">
                                {__('Log Out')}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className={`${darkMode ? 'bg-gray-800 shadow-gray-900' : 'bg-white'} shadow relative z-10 transition-colors duration-300`}>
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <div className={darkMode ? 'text-gray-100' : 'text-gray-800'}>
                            {header}
                        </div>
                    </div>
                </header>
            )}

            <main className={darkMode ? 'text-gray-100' : ''}>{children}</main>
        </div>
    );
}
