import { useState, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage, router } from '@inertiajs/react';
import { Toaster, toast } from 'react-hot-toast';
import NotificationBell from '@/Components/NotificationBell';

export default function AuthenticatedLayout({ user, header, children }) {
    // 1. GET LOCALE & TRANSLATIONS
    const { props } = usePage();
    const { locale = 'en', translations = {} } = props;

    // 2. HELPER FUNCTION
    const __ = (key) => (translations && translations[key]) ? translations[key] : key;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    // --- ACCESSIBILITY STATES ---
    const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

    // Define available sizes
    const fontSizes = ['text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl'];

    // Track current size index (Default: 1 = text-base)
    const [fontIndex, setFontIndex] = useState(() => {
        const saved = localStorage.getItem('fontSize');
        const index = fontSizes.indexOf(saved);
        return index !== -1 ? index : 1;
    });

    const currentUser = user || props.auth?.user || {};
    const isAdmin = currentUser?.role === 'admin' || currentUser?.type === 'admin';
    const isStaff = currentUser?.role === 'staff' || currentUser?.type === 'staff';
    const isApplicant = !isAdmin && !isStaff;
    const showApplicantDashboard = isApplicant;

    // --- LANGUAGE SWITCHER ---
    const switchLanguage = (lang) => {
        router.get(route('language.switch', lang), {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

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
        const newClass = fontSizes[fontIndex];
        document.documentElement.classList.add(newClass);
        localStorage.setItem('fontSize', newClass);
    }, [fontIndex]);

    const toggleTheme = () => setDarkMode(!darkMode);
    const increaseFont = () => setFontIndex((prev) => (prev < fontSizes.length - 1 ? prev + 1 : prev));
    const decreaseFont = () => setFontIndex((prev) => (prev > 0 ? prev - 1 : prev));

    // --- TOASTS ---
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

            {/* Error Banner */}
            {props.flash?.error && (
                <div className="bg-red-600 text-white px-6 py-4 text-center font-bold text-lg sticky top-0 z-[100] shadow-xl animate-pulse flex items-center justify-center">
                    <span>{props.flash.error}</span>
                </div>
            )}

            {/* ==================================================================================== */}
            {/* NEW: ELDERLY-FRIENDLY ACCESSIBILITY BAR (Always Visible Top Strip)                   */}
            {/* ==================================================================================== */}
            <div className="bg-blue-950 text-white text-xs py-2 px-2 sm:px-4 border-b border-blue-800 relative z-[60]">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-end gap-3 sm:gap-6">

                    {/* 1. LANGUAGE SWITCHER (With Label) */}
                    {isApplicant && (
                        <div className="flex items-center">
                            <span className="text-gray-400 mr-2 hidden sm:inline font-bold">Language:</span>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center font-bold hover:text-yellow-400 transition bg-blue-900/50 px-2 py-1 rounded">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012 2v1.035M12 21a9 9 0 100-18 9 9 0 000 18z" />
                                        </svg>
                                        {locale === 'fil' ? 'Filipino' : locale === 'hil' ? 'Hiligaynon' : 'English'}
                                        <span className="ml-1 text-[10px]">▼</span>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <button onClick={() => switchLanguage('en')} className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">English</button>
                                    <button onClick={() => switchLanguage('fil')} className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">Filipino</button>
                                    <button onClick={() => switchLanguage('hil')} className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">Hiligaynon</button>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    )}

                    {/* 2. TEXT SIZE CONTROLS (With Label) */}
                    <div className="flex items-center">
                        <span className="text-gray-400 mr-2 hidden sm:inline font-bold">Text Size:</span>
                        <div className="flex bg-blue-900/50 rounded overflow-hidden border border-blue-800">
                            <button onClick={decreaseFont} className="px-3 py-1 hover:bg-blue-700 hover:text-yellow-300 transition border-r border-blue-800 font-bold" title="Make Text Smaller">A-</button>
                            <button onClick={increaseFont} className="px-3 py-1 hover:bg-blue-700 hover:text-yellow-300 transition font-bold" title="Make Text Bigger">A+</button>
                        </div>
                    </div>

                    {/* 3. DARK MODE (With Label) */}
                    <div className="flex items-center">
                        <span className="text-gray-400 mr-2 hidden sm:inline font-bold">Mode:</span>
                        <button onClick={toggleTheme} className="flex items-center bg-blue-900/50 px-3 py-1 rounded border border-blue-800 hover:bg-blue-700 hover:text-yellow-300 transition">
                            {darkMode ? (
                                <><span className="mr-1">🌙</span> <span className="hidden sm:inline">Dark</span></>
                            ) : (
                                <><span className="mr-1">☀️</span> <span className="hidden sm:inline">Light</span></>
                            )}
                        </button>
                    </div>

                </div>
            </div>

            <nav className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-800 border-blue-900'} border-b sticky top-0 z-50 transition-colors duration-300 shadow-md`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">

                        {/* LEFT: Logo & Links */}
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <img src="/images/logo.png" alt="Assista Logo" className="block h-10 w-auto" />
                                </Link>
                            </div>

                            {/* Desktop Links */}
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                {showApplicantDashboard && (
                                    <Link href={route('dashboard')} className={navLinkClasses(route().current('dashboard'))}>
                                        {__('My Dashboard')}
                                    </Link>
                                )}

                                {isStaff && (
                                    <>
                                        <Link href={route('staff.dashboard')} className={navLinkClasses(route().current('staff.dashboard'))}>Staff Dashboard</Link>
                                        <Link href={route('staff.applications.index')} className={navLinkClasses(route().current('staff.applications.index'))}>All Applications</Link>
                                        <Link href={route('staff.reports.index')} className={navLinkClasses(route().current('staff.reports.*'))}>Reports</Link>
                                    </>
                                )}

                                {/* --- RESTORED ADMIN LINKS --- */}
                                {isAdmin && (
                                    <>
                                        <Link href={route('admin.dashboard')} className={navLinkClasses(route().current('admin.dashboard'))}>Admin Dashboard</Link>
                                        <Link href={route('admin.applications.index')} className={navLinkClasses(route().current('admin.applications.*'))}>All Applications</Link>
                                        <Link href={route('admin.reports.index')} className={navLinkClasses(route().current('admin.reports.*'))}>Reports</Link>
                                        <Link href={route('admin.users.index')} className={navLinkClasses(route().current('admin.users.*'))}>Manage Users</Link>
                                        <Link href={route('admin.news.index')} className={navLinkClasses(route().current('admin.news.*'))}>News</Link>
                                        <Link href={route('admin.programs.index')} className={navLinkClasses(route().current('admin.programs.*'))}>Programs</Link>
                                        <Link href={route('admin.audit-logs')} className={navLinkClasses(route().current('admin.audit-logs'))}>Audit Logs</Link>
                                        <Link href={route('admin.settings.index')} className={navLinkClasses(route().current('admin.settings.*'))}>Settings</Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: Notifications & Profile */}
                        <div className="flex items-center gap-4">

                            <NotificationBell />

                            {/* Profile Dropdown (Desktop) */}
                            <div className="hidden sm:flex relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button type="button" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-200 bg-transparent hover:text-white focus:outline-none transition ease-in-out duration-150">
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

                            {/* Hamburger (Mobile) */}
                            <div className="-mr-2 flex items-center sm:hidden">
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
                </div>

                {/* --- MOBILE MENU --- */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ` sm:hidden ${darkMode ? 'bg-gray-800' : 'bg-blue-800'} border-t border-blue-900`}>
                    <div className="pt-2 pb-3 space-y-1">
                        {showApplicantDashboard && (
                            <Link href={route('dashboard')} className={mobileNavLinkClasses(route().current('dashboard'))}>
                                {__('My Dashboard')}
                            </Link>
                        )}
                        {isStaff && (
                            <>
                                <Link href={route('staff.dashboard')} className={mobileNavLinkClasses(route().current('staff.dashboard'))}>Staff Dashboard</Link>
                                <Link href={route('staff.applications.index')} className={mobileNavLinkClasses(route().current('staff.applications.index'))}>All Applications</Link>
                                <Link href={route('staff.reports.index')} className={mobileNavLinkClasses(route().current('staff.reports.*'))}>Reports</Link>
                            </>
                        )}
                        {/* --- RESTORED ADMIN LINKS (MOBILE) --- */}
                        {isAdmin && (
                            <>
                                <Link href={route('admin.dashboard')} className={mobileNavLinkClasses(route().current('admin.dashboard'))}>Admin Dashboard</Link>
                                <Link href={route('admin.applications.index')} className={mobileNavLinkClasses(route().current('admin.applications.*'))}>All Applications</Link>
                                <Link href={route('admin.reports.index')} className={mobileNavLinkClasses(route().current('admin.reports.*'))}>Reports</Link>
                                <Link href={route('admin.users.index')} className={mobileNavLinkClasses(route().current('admin.users.*'))}>Manage Users</Link>
                                <Link href={route('admin.news.index')} className={mobileNavLinkClasses(route().current('admin.news.*'))}>News</Link>
                                <Link href={route('admin.programs.index')} className={mobileNavLinkClasses(route().current('admin.programs.*'))}>Programs</Link>
                                <Link href={route('admin.audit-logs')} className={mobileNavLinkClasses(route().current('admin.audit-logs'))}>Audit Logs</Link>
                                <Link href={route('admin.settings.index')} className={mobileNavLinkClasses(route().current('admin.settings.*'))}>Settings</Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Profile Section */}
                    <div className="pt-4 pb-4 border-t border-blue-700 dark:border-gray-700">
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
