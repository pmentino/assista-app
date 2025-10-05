import { Link, Head } from '@inertiajs/react';

export default function Welcome(props) {
    return (
        <>
            <Head title="Welcome to Assista" />
            <div className="min-h-screen bg-white">
                {/* Header/Navigation Section */}
<header className="bg-blue-800 shadow-sm"> {/* <-- Added bg-blue-800 */}
    <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo on the left */}
        <div className="flex items-center">
            <img src="/images/logo.png" alt="Assista Logo" className="h-10 w-auto mr-3" />
            <span className="text-2xl font-bold text-white">ASSISTA</span> {/* <-- Changed text to white */}
        </div>

        {/* Navigation Links and Register Button on the right */}
        <nav className="flex items-center space-x-8">
            <Link href="#" className="text-gray-200 hover:text-white font-medium">HOME</Link> {/* <-- Changed text */}
            <Link href="#" className="text-gray-200 hover:text-white font-medium">SERVICES</Link> {/* <-- Changed text */}
            <Link href="#" className="text-gray-200 hover:text-white font-medium">ABOUT</Link> {/* <-- Changed text */}
            <Link
                href={route('register')}
                className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-md hover:bg-yellow-600 transition duration-300"
            >
                REGISTER
            </Link>
        </nav>
    </div>
</header>

                {/* Main Hero Section */}
                <main className="container mx-auto mt-16 px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Left Column: Text and Buttons */}
                        <div className="text-left">
                            <img src="/images/dswd-logo.png" alt="DSWD Logo" className="h-32 w-auto mb-6" />
                            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                                Assistance to Individuals in Crisis Situation (AICS)
                            </h1>
                            <p className="mt-4 text-lg text-gray-600">
                                Providing assistance and essential support to individuals in need.
                            </p>
                            <div className="mt-8 flex space-x-4">
                                <Link
                                    href={route('login')}
                                    className="bg-blue-800 text-white font-bold py-3 px-8 rounded-md hover:bg-blue-900 transition duration-300"
                                >
                                    APPLY NOW
                                </Link>
                                <Link
                                    href="#"
                                    className="bg-white text-blue-800 font-bold py-3 px-8 rounded-md border-2 border-blue-800 hover:bg-gray-100 transition duration-300"
                                >
                                    LEARN MORE
                                </Link>
                            </div>
                        </div>

                        {/* Right Column: Illustration */}
                        <div>
                            <img src="/images/assista-bg.png" alt="Illustration of people receiving aid" className="w-3/4 h-auto" />
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
