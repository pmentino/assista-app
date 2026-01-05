import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react'; // <--- Added usePage
import { useState } from 'react';

// --- CONFIGURATION: Citizen's Charter / Requirements List ---
const REQUIREMENTS_MAP = {
    'Hospitalization': ['Personal Letter to Mayor', 'Final Hospital Bill', 'Medical Abstract / Certificate', 'Promissory Note (if discharged)'],
    'Medicine Assistance': ['Personal Letter to Mayor', 'Prescription (with license #)', 'Medical Certificate', 'Quotation of Medicine'],
    'Laboratory / Diagnostic Tests': ['Personal Letter to Mayor', 'Laboratory Request', 'Medical Certificate', 'Quotation of Procedure'],
    'Chemotherapy': ['Personal Letter to Mayor', 'Chemotherapy Protocol', 'Medical Certificate', 'Quotation of Medicine'],
    'Anti-Rabies Vaccine': ['Personal Letter to Mayor', 'Rabies Vaccination Card', 'Medical Certificate'],
    'Funeral Assistance': ['Personal Letter to Mayor', 'Death Certificate (Certified True Copy)', 'Burial Contract'],
    'Educational Assistance': ['Personal Letter to Mayor', 'Certificate of Enrollment / Registration', 'School ID']
};

export default function Dashboard({ applications = [] }) { // Removed 'auth' from props here
    // FIX: Get User from Global Page Props (More Reliable)
    const { auth } = usePage().props;
    const user = auth?.user || { name: 'Applicant', id: 0 };

    const [activeTab, setActiveTab] = useState('ongoing');

    // Filter Logic
    const filteredApplications = applications.filter(app => {
        if (activeTab === 'ongoing') return app.status === 'Pending';
        if (activeTab === 'approved') return app.status === 'Approved';
        if (activeTab === 'history') return ['Approved', 'Rejected'].includes(app.status);
        return true;
    });

    return (
        <AuthenticatedLayout
            user={user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Applicant Dashboard</h2>}
        >
            <Head title="Applicant Dashboard" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* --- WELCOME CARD --- */}
                    <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl shadow-xl mb-8 overflow-hidden relative">
                        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform origin-bottom-left"></div>
                        <div className="p-8 md:p-10 text-white relative z-10">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {user.name}!</h1>
                                    <p className="text-blue-100 text-lg">
                                        Account No: <span className="font-mono font-bold text-white bg-blue-800/50 px-2 py-1 rounded">{String(user.id).padStart(6, '0')}</span>
                                    </p>
                                </div>
                                <Link
                                    href={route('applications.create')}
                                    className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all flex items-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                    Apply for Assistance
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* --- TABS & CONTENT --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">

                        {/* Tabs Header */}
                        <div className="border-b border-gray-200 px-6 bg-gray-50">
                            <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                                {['ongoing', 'approved', 'history'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors duration-200 ${
                                            activeTab === tab
                                                ? 'border-blue-600 text-blue-700 font-bold'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        {tab === 'ongoing' ? 'Active / Pending' : tab}
                                        {tab === 'ongoing' && applications.filter(a => a.status === 'Pending').length > 0 && (
                                            <span className="ml-2 bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full text-xs font-bold">
                                                {applications.filter(a => a.status === 'Pending').length}
                                            </span>
                                        )}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setActiveTab('guidelines')}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center ${
                                        activeTab === 'guidelines'
                                            ? 'border-indigo-500 text-indigo-700 font-bold'
                                            : 'border-transparent text-gray-500 hover:text-indigo-600 hover:border-indigo-300'
                                    }`}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                                    Requirements Checklist
                                </button>
                            </nav>
                        </div>

                        {/* Content Body */}
                        <div className="p-6 md:p-8">

                            {/* --- GUIDELINES TAB --- */}
                            {activeTab === 'guidelines' ? (
                                <div className="animate-fade-in">
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r mb-8">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-bold text-blue-800">Important Reminders</h3>
                                                <ul className="mt-1 list-disc pl-5 text-sm text-blue-700 space-y-1">
                                                    <li>Prepare <strong>Valid Government ID</strong> & <strong>Barangay Indigency</strong>.</li>
                                                    <li>Ensure photos/scans are clear and readable.</li>
                                                    <li>Only indigent residents of Roxas City are eligible.</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {Object.entries(REQUIREMENTS_MAP).map(([program, reqs]) => (
                                            <div key={program} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                                <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 font-bold text-gray-700 text-sm uppercase tracking-wide">
                                                    {program}
                                                </div>
                                                <ul className="p-5 space-y-3">
                                                    {reqs.map((req, idx) => (
                                                        <li key={idx} className="flex items-start text-sm text-gray-600">
                                                            <svg className="w-5 h-5 text-green-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                            {req}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                /* --- APPLICATIONS LIST --- */
                                <div className="space-y-4">
                                    {filteredApplications.length === 0 ? (
                                        <div className="text-center py-20 flex flex-col items-center">
                                            <div className="bg-gray-100 p-4 rounded-full mb-4">
                                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900">No applications found</h3>
                                            <p className="text-gray-500 mt-1">You don't have any applications in this category yet.</p>
                                            {activeTab === 'ongoing' && (
                                                <Link href={route('applications.create')} className="mt-4 text-blue-600 hover:underline font-bold">Start a New Application</Link>
                                            )}
                                        </div>
                                    ) : (
                                        filteredApplications.map((app) => (
                                            <div key={app.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group">
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{app.program}</h3>
                                                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                                                            <span className="flex items-center">
                                                                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                                {new Date(app.created_at).toLocaleDateString()}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                                {app.barangay}
                                                            </span>
                                                        </div>
                                                        {app.remarks && (
                                                            <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded text-sm text-red-800">
                                                                <strong>Admin Note:</strong> {app.remarks}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col items-end gap-3 min-w-[140px]">
                                                        <StatusBadge status={app.status} />

                                                        {app.status === 'Approved' && (
                                                            <a href={route('applications.claim-stub', app.id)} target="_blank" className="inline-flex items-center text-green-600 hover:text-green-800 text-sm font-bold bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition">
                                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                                Get Claim Stub
                                                            </a>
                                                        )}

                                                        {app.status === 'Rejected' && (
                                                            <Link href={route('applications.edit', app.id)} className="text-blue-600 hover:text-blue-800 text-sm font-bold hover:underline">
                                                                Edit & Resubmit
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

function StatusBadge({ status }) {
    const styles = {
        'Approved': 'bg-green-100 text-green-800 border-green-200',
        'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Rejected': 'bg-red-100 text-red-800 border-red-200',
    };
    return (
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full uppercase tracking-wide border ${styles[status] || 'bg-gray-100'}`}>
            {status}
        </span>
    );
}
