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

export default function Welcome(props) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <Head title="Welcome to Assista" />
            <div className="min-h-screen bg-white text-gray-800">
                {/* Header is no longer the 'home' anchor point */}
                <header className="bg-blue-800 shadow-sm sticky top-0 z-50">
                    <div className="container mx-auto flex items-center justify-between p-4">
                        <a href="#home" className="flex items-center">
                            <img src="/images/logo.png" alt="Assista Logo" className="h-10 w-auto mr-3" />
                            <span className="text-2xl font-bold text-white">ASSISTA</span>
                        </a>
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#home" className="text-gray-200 hover:text-white font-medium">HOME</a>
                            <a href="#services" className="text-gray-200 hover:text-white font-medium">SERVICES</a>
                            <a href="#about" className="text-gray-200 hover:text-white font-medium">ABOUT</a>
                            <Link
                                href={route('register')}
                                className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-md hover:bg-yellow-600 transition duration-300"
                            >
                                REGISTER
                            </Link>
                        </nav>
                        <div className="md:hidden">
                            <button onClick={() => setMobileMenuOpen(true)} className="text-white">
                                <MenuIcon />
                            </button>
                        </div>
                    </div>
                </header>
                {mobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 z-50">
                        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setMobileMenuOpen(false)} />
                        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white p-6">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xl font-bold text-blue-800">MENU</span>
                                <button onClick={() => setMobileMenuOpen(false)} className="text-gray-700">
                                    <CloseIcon />
                                </button>
                            </div>
                            <div className="flex flex-col space-y-4">
                                <a href="#home" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-lg font-semibold text-gray-900 hover:bg-gray-50 rounded-md px-3">HOME</a>
                                <a href="#services" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-lg font-semibold text-gray-900 hover:bg-gray-50 rounded-md px-3">SERVICES</a>
                                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-lg font-semibold text-gray-900 hover:bg-gray-50 rounded-md px-3">ABOUT</a>
                                <hr className="my-4" />
                                <Link href={route('register')} className="block w-full text-center bg-yellow-500 text-white font-bold py-3 px-6 rounded-md hover:bg-yellow-600 transition duration-300">REGISTER</Link>
                                <Link href={route('login')} className="block w-full text-center bg-blue-800 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-900 transition duration-300">LOG IN</Link>
                            </div>
                        </div>
                    </div>
                )}


                {/* --- THIS IS THE FIX: id="home" is now on the <main> tag --- */}
                <main id="home" className="container mx-auto mt-16 px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 min-h-[90vh]">
                        <div className="md:w-1/2 text-center md:text-left pt-16 md:pt-0">
                            <img src="/images/dswd-logo.png" alt="DSWD Logo" className="h-24 md:h-32 w-auto mb-6 mx-auto md:mx-0" />
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                                Assistance to Individuals in Crisis Situation (AICS)
                            </h1>
                            <p className="mt-4 text-lg text-gray-600">
                                Providing assistance and essential support to individuals in need.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 justify-center md:justify-start">
                                <Link
                                    href={route('register')}
                                    className="w-full sm:w-auto text-center bg-blue-800 text-white font-bold py-4 px-8 rounded-md hover:bg-blue-900 transition duration-300"
                                >
                                    APPLY NOW
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
                            <img src="/images/assista-bg.png" alt="Illustration of people receiving aid" className="w-full h-auto max-w-lg" />
                        </div>
                    </div>
                </main>


                {/* --- Services Section --- */}
                <section id="services" className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Services</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="p-8 bg-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl">
                                <h3 className="text-xl font-semibold mb-2">Medical Assistance</h3>
                                <p className="text-gray-600">Support for hospitalization expenses, cost of medicines, and other medical treatments.</p>
                            </div>
                            <div className="p-8 bg-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl">
                                <h3 className="text-xl font-semibold mb-2">Burial Assistance</h3>
                                <p className="text-gray-600">Financial aid to help cover funeral and burial expenses for deceased family members.</p>
                            </div>
                            <div className="p-8 bg-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl">
                                <h3 className="text-xl font-semibold mb-2">Food Assistance</h3>
                                <p className="text-gray-600">Provision of food packs or financial support for families unable to secure their basic food needs.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- About Section --- */}
                <section id="about" className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">About Assista & AICS</h2>
                            <p className="text-gray-600 leading-7 text-center">
                                The **Assista** system is a web-based platform designed to digitize and streamline the application process for the DSWD's **Assistance to Individuals in Crisis Situation (AICS)** program. AICS serves as a social safety net or a stop-gap measure to support the recovery of individuals and families from unexpected life events or crises. Our platform allows applicants to submit their requests for medical, burial, or food assistance online, reducing the need for travel and long queues. Administrators can efficiently manage, review, and update the status of these applications, ensuring a faster and more transparent process for everyone involved.
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
