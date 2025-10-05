import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ auth }) {
    const [activeTab, setActiveTab] = useState('ongoing');

    return (
        <AuthenticatedLayout
            user={auth} // Pass the auth object (which is the user)
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Applicants Dashboard</h2>}
        >
            <Head title="Applicant Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-4xl font-bold mb-2">WELCOME</h1>
                                    {/* Use auth?.email to prevent error if auth is missing */}
                                    <p className="text-gray-700 text-lg">Email: {auth?.email}</p>
                                    <p className="text-gray-700 text-lg">Number: 0923456789</p>
                                </div>
                                <div>
                                    <Link
                                        href={route('applications.create')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Apply for Assistance
                                    </Link>
                                </div>
                            </div>

                            {/* Tabs Navigation */}
                            <div className="border-b border-gray-200 mt-8 mb-4">
                                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                    <button onClick={() => setActiveTab('ongoing')} className={`${ activeTab === 'ongoing' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                                        Active / Ongoing Application
                                    </button>
                                    <button onClick={() => setActiveTab('approved')} className={`${ activeTab === 'approved' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                                        Approved Application
                                    </button>
                                    <button onClick={() => setActiveTab('history')} className={`${ activeTab === 'history' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                                        Application History
                                    </button>
                                </nav>
                            </div>
                            {/* Tab Content */}
                            <div className="mt-6">
                                {activeTab === 'ongoing' && ( <div className="text-gray-600 italic">No Ongoing Application Records.</div> )}
                                {activeTab === 'approved' && ( <div className="text-gray-600 italic">No Approved Application Records.</div> )}
                                {activeTab === 'history' && ( <div className="text-gray-600 italic">No Application History Records.</div> )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
