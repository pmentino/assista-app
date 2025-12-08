import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

// --- CONFIGURATION: Citizen's Charter / Requirements List ---
const REQUIREMENTS_MAP = {
    'Hospitalization': [
        'Personal Letter to Mayor',
        'Final Hospital Bill',
        'Medical Abstract / Certificate',
        'Promissory Note (if discharged)'
    ],
    'Medicine Assistance': [
        'Personal Letter to Mayor',
        'Prescription (with license #)',
        'Medical Certificate',
        'Quotation of Medicine'
    ],
    'Laboratory / Diagnostic Tests': [
        'Personal Letter to Mayor',
        'Laboratory Request',
        'Medical Certificate',
        'Quotation of Procedure'
    ],
    'Chemotherapy': [
        'Personal Letter to Mayor',
        'Chemotherapy Protocol',
        'Medical Certificate',
        'Quotation of Medicine'
    ],
    'Anti-Rabies Vaccine': [
        'Personal Letter to Mayor',
        'Rabies Vaccination Card',
        'Medical Certificate'
    ],
    'Funeral Assistance': [
        'Personal Letter to Mayor',
        'Death Certificate (Certified True Copy)',
        'Burial Contract'
    ],
    'Educational Assistance': [
        'Personal Letter to Mayor',
        'Certificate of Enrollment / Registration',
        'School ID'
    ]
};

export default function Dashboard({ auth, applications = [] }) {
    const user = auth?.user || {};
    const [activeTab, setActiveTab] = useState('ongoing');

    // Filter Logic
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
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6 border-l-8 border-blue-600">
                        <div className="p-8 text-gray-900">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center text-center md:text-left">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2 text-blue-900">Welcome, {user.name}!</h1>
                                    <p className="text-gray-600">
                                        Account No: <span className="font-mono font-bold text-gray-800">{user.id ? String(user.id).padStart(6, '0') : 'N/A'}</span>
                                    </p>
                                </div>
                                <div className="mt-6 md:mt-0">
                                    <Link
                                        href={route('applications.create')}
                                        className="inline-flex items-center justify-center w-full md:w-auto bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:-translate-y-0.5 transition duration-200"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Apply for Assistance
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg min-h-[600px]">

                        {/* Custom Tab Navigation */}
                        <div className="border-b border-gray-200 px-6 pt-4">
                            <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                                {/* Ongoing Tab */}
                                <button
                                    onClick={() => setActiveTab('ongoing')}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                        activeTab === 'ongoing'
                                            ? 'border-blue-600 text-blue-700 font-bold'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Active / Pending
                                    {applications.filter(a => a.status === 'Pending').length > 0 && (
                                        <span className="ml-2 bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full text-xs">
                                            {applications.filter(a => a.status === 'Pending').length}
                                        </span>
                                    )}
                                </button>

                                {/* Approved Tab */}
                                <button
                                    onClick={() => setActiveTab('approved')}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                        activeTab === 'approved'
                                            ? 'border-blue-600 text-blue-700 font-bold'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Approved
                                </button>

                                {/* History Tab */}
                                <button
                                    onClick={() => setActiveTab('history')}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                        activeTab === 'history'
                                            ? 'border-blue-600 text-blue-700 font-bold'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    History
                                </button>

                                {/* Guidelines Tab (New & Highlighted) */}
                                <button
                                    onClick={() => setActiveTab('guidelines')}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center ${
                                        activeTab === 'guidelines'
                                            ? 'border-indigo-500 text-indigo-700 font-bold'
                                            : 'border-transparent text-gray-500 hover:text-indigo-600 hover:border-indigo-300'
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                    Requirements Checklist
                                </button>
                            </nav>
                        </div>

                        <div className="p-6 bg-gray-50/50 min-h-[500px]">

                            {/* --- TAB CONTENT: GUIDELINES --- */}
                            {activeTab === 'guidelines' ? (
                                <div className="animate-fade-in-up">
                                    <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-bold text-blue-800">Important Reminders</h3>
                                                <div className="mt-2 text-sm text-blue-700">
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        <li>All applicants must provide a <strong>Valid Government ID</strong> and a <strong>Certificate of Indigency</strong> from their Barangay.</li>
                                                        <li>Documents must be clear and readable (scanned or high-quality photo).</li>
                                                        <li>Only indigent residents of Roxas City are eligible for AICS.</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">Document Checklist per Assistance Type</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {Object.entries(REQUIREMENTS_MAP).map(([program, reqs]) => (
                                            <div key={program} className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                                                <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
                                                    <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">{program}</h4>
                                                </div>
                                                <ul className="p-5 space-y-3">
                                                    {reqs.map((req, idx) => (
                                                        <li key={idx} className="flex items-start text-sm text-gray-600">
                                                            <svg className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            <span>{req}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                /* --- TAB CONTENT: APPLICATIONS LIST --- */
                                <div className="space-y-4">
                                    {filteredApplications.length === 0 ? (
                                        <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
                                            <p className="mt-1 text-sm text-gray-500">There are no applications in this category.</p>
                                        </div>
                                    ) : (
                                        filteredApplications.map((app) => (
                                            <div key={app.id} className="bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900">{app.program}</h3>
                                                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                            <span className="flex items-center">
                                                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                                {new Date(app.created_at).toLocaleDateString()}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                                {app.barangay}
                                                            </span>
                                                        </div>
                                                        {/* Remarks Section */}
                                                        {app.remarks && (
                                                            <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded text-sm text-red-700">
                                                                <strong>Admin Note:</strong> {app.remarks}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col items-end gap-2">
                                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full uppercase tracking-wide ${
                                                            app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                            app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                            {app.status}
                                                        </span>

                                                        {/* Logic for Buttons */}
                                                        {app.status === 'Approved' && (
                                                            <a href={route('applications.claim-stub', app.id)} target="_blank" className="text-green-600 hover:text-green-800 text-sm font-bold flex items-center mt-2 underline">
                                                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                                Download Claim Stub
                                                            </a>
                                                        )}

                                                        {app.status === 'Rejected' && (
                                                            <Link href={route('applications.edit', app.id)} className="text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center mt-2 underline">
                                                                Edit Application
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
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
