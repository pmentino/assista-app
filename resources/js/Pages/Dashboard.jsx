import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ auth, applications = [] }) {
    // Safety check: Ensure user object exists
    const user = auth?.user || {};

    const [activeTab, setActiveTab] = useState('ongoing');

    const filteredApplications = applications.filter(app => {
        if (activeTab === 'ongoing') { return app.status === 'Pending'; }
        if (activeTab === 'approved') { return app.status === 'Approved'; }
        if (activeTab === 'history') { return ['Approved', 'Rejected'].includes(app.status); }
        return true;
    });

    return (
        <AuthenticatedLayout
            user={user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Applicants Dashboard</h2>}
        >
            <Head title="Applicant Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0 text-center md:text-left">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold mb-2">WELCOME</h1>
                                    <p className="text-gray-700 text-lg">Email: {user.email || 'N/A'}</p>
                                    <p className="text-gray-700 text-lg">Number: {user.contact_number || 'N/A'}</p>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    <Link
                                        href={route('applications.create')}
                                        className="inline-flex items-center justify-center w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                                        Apply for Assistance
                                    </Link>
                                </div>
                            </div>

                            <div className="border-b border-gray-200 mt-8 mb-4">
                               <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                                    <button onClick={() => setActiveTab('ongoing')} className={'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ' + (activeTab === 'ongoing' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')}>Active / Ongoing</button>
                                    <button onClick={() => setActiveTab('approved')} className={'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ' + (activeTab === 'approved' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')}>Approved</button>
                                    <button onClick={() => setActiveTab('history')} className={'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ' + (activeTab === 'history' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')}>History</button>
                               </nav>
                            </div>

                            <div className="mt-6">
                                {filteredApplications.length === 0 ? (
                                    <div className="text-gray-600 italic">No Application Records Found for this category.</div>
                                ) : (
                                    <ul className="divide-y divide-gray-200">
                                        {filteredApplications.map((app) => (
                                            <li key={app.id} className="py-4 block md:flex justify-between items-start">
                                                <div className="mb-2 md:mb-0">
                                                    <p className="text-sm font-medium text-gray-900">{app.program}</p>
                                                    <p className="text-sm text-gray-500">Submitted on: {new Date(app.created_at).toLocaleDateString()}</p>

                                                    {app.remarks && (
                                                        <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-md max-w-xl">
                                                            <p className="text-sm font-semibold text-orange-800">Admin Remarks:</p>
                                                            <p className="text-sm text-orange-700 whitespace-pre-wrap">{app.remarks}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-shrink-0 flex flex-col items-end gap-3">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${app.status === 'Approved' ? 'bg-green-100 text-green-800' : app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                        {app.status}
                                                    </span>

                                                    {/* EDIT BUTTON: Only if Rejected */}
                                                    {app.status === 'Rejected' && (
                                                        <Link
                                                            href={route('applications.edit', app.id)}
                                                            className="inline-flex items-center px-3 py-1 border border-indigo-500 text-xs font-medium rounded text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-150"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                            </svg>
                                                            Edit / Resubmit
                                                        </Link>
                                                    )}

                                                    {/* NEW: CLAIM STUB BUTTON: Only if Approved */}
                                                    {app.status === 'Approved' && (
                                                        <a
                                                            href={route('applications.claim-stub', app.id)}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center px-3 py-1 border border-green-500 text-xs font-medium rounded text-green-700 bg-white hover:bg-green-50 transition-colors duration-150"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            Download Claim Stub
                                                        </a>
                                                    )}
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
