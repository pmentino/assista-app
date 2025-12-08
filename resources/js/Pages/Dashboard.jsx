import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

// --- SHARED DATA: List of Requirements ---
const REQUIREMENTS_MAP = {
    'Hospitalization': [
        'Personal Letter to Mayor',
        'Final Hospital Bill',
        'Medical Abstract / Medical Certificate',
        'Promissory Note (if discharged)'
    ],
    'Laboratory Tests': [
        'Personal Letter to Mayor',
        'Laboratory Request',
        'Medical Certificate'
    ],
    'Anti-Rabies Vaccine Treatment': [
        'Personal Letter to Mayor',
        'Rabies Vaccination Card',
        'Medical Certificate'
    ],
    'Medicine Assistance': [
        'Personal Letter to Mayor',
        'Prescription (with price & doctor license)',
        'Medical Certificate'
    ],
    'Funeral Assistance': [
        'Personal Letter to Mayor',
        'Death Certificate (Certified True Copy)',
        'Burial Contract'
    ],
    'Chemotherapy': [
        'Personal Letter to Mayor',
        'Chemotherapy Protocol / Doctor\'s Order',
        'Medical Certificate',
        'Quotation of Medicine'
    ],
    'Diagnostic Blood Tests': [
        'Personal Letter to Mayor',
        'Laboratory/Diagnostic Request',
        'Medical Certificate'
    ]
};

export default function Dashboard({ auth, applications = [] }) {
    const user = auth?.user || {};
    const [activeTab, setActiveTab] = useState('ongoing');

    // Filter logic
    const filteredApplications = applications.filter(app => {
        if (activeTab === 'ongoing') { return app.status === 'Pending'; }
        if (activeTab === 'approved') { return app.status === 'Approved'; }
        if (activeTab === 'history') { return ['Approved', 'Rejected'].includes(app.status); }
        return true;
    });

    return (
        <AuthenticatedLayout
            user={user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Applicant Dashboard</h2>}
        >
            <Head title="Applicant Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Welcome Card */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center text-center md:text-left">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold mb-1 text-blue-900">Welcome, {user.name}!</h1>
                                    <p className="text-gray-600">Track your applications and view requirements here.</p>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    <Link
                                        href={route('applications.create')}
                                        className="inline-flex items-center justify-center w-full md:w-auto bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                                        New Application
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg min-h-[500px]">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs">
                                <button onClick={() => setActiveTab('ongoing')} className={'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ' + (activeTab === 'ongoing' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')}>
                                    Active / Pending
                                </button>
                                <button onClick={() => setActiveTab('approved')} className={'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ' + (activeTab === 'approved' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')}>
                                    Approved
                                </button>
                                <button onClick={() => setActiveTab('history')} className={'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ' + (activeTab === 'history' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')}>
                                    History
                                </button>
                                {/* NEW TAB: Guidelines */}
                                <button onClick={() => setActiveTab('guidelines')} className={'whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm ' + (activeTab === 'guidelines' ? 'border-blue-500 text-blue-800' : 'border-transparent text-blue-600 hover:text-blue-800')}>
                                    📋 Requirements Checklist
                                </button>
                            </nav>
                        </div>

                        <div className="p-6">
                            {/* --- GUIDELINES TAB CONTENT --- */}
                            {activeTab === 'guidelines' ? (
                                <div>
                                    <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                                        <h3 className="text-lg font-bold text-blue-900">Before you apply...</h3>
                                        <p className="text-sm text-blue-800">
                                            Please ensure you have clear photos or scanned copies of the following documents based on the type of assistance you need.
                                            <strong> All applications also require a Valid ID and a Certificate of Indigency.</strong>
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {Object.entries(REQUIREMENTS_MAP).map(([program, reqs]) => (
                                            <div key={program} className="border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                                                <div className="bg-gray-100 px-4 py-3 border-b font-bold text-gray-800">
                                                    {program}
                                                </div>
                                                <ul className="p-4 space-y-2">
                                                    {reqs.map((req, idx) => (
                                                        <li key={idx} className="flex items-start text-sm text-gray-600">
                                                            <svg className="h-5 w-5 text-green-500 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            {req}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                /* --- APPLICATION LIST TABS --- */
                                <div>
                                    {filteredApplications.length === 0 ? (
                                        <div className="text-center py-10">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
                                            <p className="mt-1 text-sm text-gray-500">You don't have any applications in this category yet.</p>
                                        </div>
                                    ) : (
                                        <ul className="divide-y divide-gray-200">
                                            {filteredApplications.map((app) => (
                                                <li key={app.id} className="py-4 block md:flex justify-between items-start">
                                                    <div className="mb-2 md:mb-0">
                                                        <p className="text-lg font-bold text-gray-800">{app.program}</p>
                                                        <p className="text-sm text-gray-500">Submitted on: {new Date(app.created_at).toLocaleDateString()}</p>

                                                        {app.remarks && (
                                                            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md max-w-xl">
                                                                <p className="text-xs font-bold text-red-800 uppercase">Action Required / Admin Remarks:</p>
                                                                <p className="text-sm text-red-700 whitespace-pre-wrap">{app.remarks}</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-shrink-0 flex flex-col items-end gap-3">
                                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            app.status === 'Approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                                                            app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                                            'bg-red-100 text-red-800 border border-red-200'
                                                        }`}>
                                                            {app.status}
                                                        </span>

                                                        {app.status === 'Rejected' && (
                                                            <Link
                                                                href={route('applications.edit', app.id)}
                                                                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
                                                            >
                                                                Edit / Resubmit
                                                            </Link>
                                                        )}

                                                        {app.status === 'Approved' && (
                                                            <a
                                                                href={route('applications.claim-stub', app.id)}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 active:bg-green-900 transition ease-in-out duration-150"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
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
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
