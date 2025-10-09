import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function Dashboard({ auth, applications = [] }) {
    const [activeTab, setActiveTab] = useState('ongoing');
    const { props } = usePage();

    useEffect(() => {
        if (props.flash && props.flash.message) {
            toast.success(props.flash.message);
        }
    }, [props.flash]);

    // --- NEW FILTERING LOGIC ---
    // This filters the main 'applications' list based on the active tab.
    const filteredApplications = applications.filter(app => {
        if (activeTab === 'ongoing') {
            return app.status === 'Pending';
        }
        if (activeTab === 'approved') {
            return app.status === 'Approved';
        }
        if (activeTab === 'history') {
            // History can be anything that is no longer pending
            return app.status === 'Approved' || app.status === 'Rejected';
        }
        return true;
    });

    return (
        <AuthenticatedLayout
            user={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Applicants Dashboard</h2>}
        >
            <Head title="Applicant Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Welcome Section (no changes here) */}
                            <div className="flex justify-between items-center mb-6">
                                {/* ... */}
                            </div>

                            {/* Tabs Navigation (no changes here) */}
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

                            {/* Tab Content (Now uses the filtered list) */}
                            <div className="mt-6">
                                {filteredApplications.length === 0 ? (
                                    <div className="text-gray-600 italic">No Application Records Found for this category.</div>
                                ) : (
                                    <ul className="divide-y divide-gray-200">
                                        {filteredApplications.map((app) => (
                                            <li key={app.id} className="py-4 flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{app.program}</p>
                                                    <p className="text-sm text-gray-500">Submitted on: {new Date(app.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                        app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {app.status}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
