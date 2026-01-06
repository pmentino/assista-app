import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
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

export default function Dashboard({ applications = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user || { name: 'Applicant', id: 0 };

    // Default to guidelines so users see requirements immediately
    const [activeTab, setActiveTab] = useState('guidelines');

    const filteredApplications = applications.filter(app => {
        if (activeTab === 'ongoing') return app.status === 'Pending';
        if (activeTab === 'approved') return app.status === 'Approved';
        if (activeTab === 'history') return ['Approved', 'Rejected'].includes(app.status);
        return true;
    });

    // Counts for badges
    const pendingCount = applications.filter(a => a.status === 'Pending').length;
    const approvedCount = applications.filter(a => a.status === 'Approved').length;
    // NEW: Calculate rejected count for the badge
    const rejectedCount = applications.filter(a => a.status === 'Rejected').length;

    return (
        <AuthenticatedLayout
            user={user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Applicant Dashboard</h2>}
        >
            <Head title="Applicant Dashboard" />

            <div className="py-8 md:py-12 bg-gray-50 min-h-screen font-sans">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* --- WELCOME CARD --- */}
                    <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl shadow-xl mb-8 overflow-hidden relative mx-4 sm:mx-0">
                        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform origin-bottom-left"></div>
                        <div className="p-6 md:p-10 text-white relative z-10">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold mb-2">Maayong adlaw, {user.name}!</h1>
                                    <p className="text-blue-100 text-sm md:text-base mb-1">
                                        Welcome to the official <strong>Assista</strong> portal of Roxas City.
                                    </p>
                                    <div className="inline-flex items-center gap-2 mt-2 bg-blue-900/40 px-3 py-1 rounded-lg border border-blue-500/30">
                                        <span className="text-xs text-blue-200 uppercase tracking-widest">Account ID:</span>
                                        <span className="font-mono font-bold text-yellow-400">{String(user.id).padStart(6, '0')}</span>
                                    </div>
                                </div>
                                <Link
                                    href={route('applications.create')}
                                    className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all flex items-center justify-center border-b-4 border-yellow-600"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                    Apply for Assistance
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* --- MAIN INTERFACE --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px] mx-4 sm:mx-0">

                        {/* Mobile-Friendly Scrollable Tabs */}
                        <div className="border-b border-gray-200 px-4 md:px-6 bg-gray-50">
                            <nav className="-mb-px flex space-x-6 overflow-x-auto no-scrollbar py-1" aria-label="Tabs">
                                <TabButton
                                    active={activeTab === 'guidelines'}
                                    onClick={() => setActiveTab('guidelines')}
                                    icon={<svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                                    label="Requirements"
                                />
                                <TabButton
                                    active={activeTab === 'ongoing'}
                                    onClick={() => setActiveTab('ongoing')}
                                    label="Active / Pending"
                                    count={pendingCount}
                                    badgeColor="yellow"
                                />
                                <TabButton
                                    active={activeTab === 'approved'}
                                    onClick={() => setActiveTab('approved')}
                                    label="Approved"
                                    count={approvedCount}
                                    badgeColor="green"
                                />
                                {/* UPDATED HISTORY TAB: Now shows Red Badge for Rejections */}
                                <TabButton
                                    active={activeTab === 'history'}
                                    onClick={() => setActiveTab('history')}
                                    label="History"
                                    count={rejectedCount}
                                    badgeColor="red"
                                />
                            </nav>
                        </div>

                        {/* Content Area */}
                        <div className="p-4 md:p-8">

                            {/* --- GUIDELINES TAB (First View) --- */}
                            {activeTab === 'guidelines' && (
                                <div className="animate-fade-in space-y-6">
                                    <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-r-lg shadow-sm">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-base font-bold text-blue-900">Before you apply:</h3>
                                                <div className="mt-2 text-sm text-blue-800 space-y-1">
                                                    <p>1. Make sure you are a <strong>resident of Roxas City</strong>.</p>
                                                    <p>2. Prepare clear photos of your <strong>Valid ID</strong> and <strong>Barangay Indigency</strong>.</p>
                                                    <p>3. Review the requirements below for your specific need.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {Object.entries(REQUIREMENTS_MAP).map(([program, reqs]) => (
                                            <div key={program} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-white">
                                                <div className="bg-slate-50 px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                                                    <span className="font-bold text-slate-700 text-sm uppercase tracking-wide">{program}</span>
                                                </div>
                                                <ul className="p-5 space-y-3">
                                                    {reqs.map((req, idx) => (
                                                        <li key={idx} className="flex items-start text-sm text-gray-600">
                                                            <svg className="w-4 h-4 text-green-500 mr-2 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                            {req}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* --- APPLICATIONS LIST --- */}
                            {activeTab !== 'guidelines' && (
                                <div className="space-y-6">
                                    {filteredApplications.length === 0 ? (
                                        <EmptyState activeTab={activeTab} />
                                    ) : (
                                        filteredApplications.map((app) => (
                                            <ApplicationCard key={app.id} app={app} />
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- HELP WIDGET --- */}
                    <div className="mt-8 text-center border-t border-gray-200 pt-8 pb-4">
                        <p className="text-gray-500 text-sm">Need assistance with your application?</p>
                        <p className="text-blue-900 font-bold text-lg mt-1">
                            <span className="mr-2">📞</span> Hotline: (036) 52026-83
                        </p>
                        <p className="text-gray-400 text-xs mt-2">CSWDO Office, Inzo Arnaldo Village, Roxas City</p>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// --- SUB-COMPONENTS ---

function TabButton({ active, onClick, label, count, badgeColor, icon }) {
    const activeClass = "border-blue-600 text-blue-800 font-bold bg-blue-50/50";
    const inactiveClass = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";

    // ADDED: Red badge style for rejections
    const badgeColors = {
        yellow: "bg-yellow-100 text-yellow-800",
        green: "bg-green-100 text-green-800",
        red: "bg-red-100 text-red-800"
    };

    return (
        <button
            onClick={onClick}
            className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-all duration-200 rounded-t-lg flex items-center ${active ? activeClass : inactiveClass}`}
        >
            {icon}
            {label}
            {count > 0 && (
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs font-bold ${badgeColors[badgeColor] || 'bg-gray-100'} ${badgeColor === 'red' ? 'animate-pulse' : ''}`}>
                    {count}
                </span>
            )}
        </button>
    );
}

function ApplicationCard({ app }) {
    // --- DEADLINE / EXPIRATION LOGIC ---
    const createdDate = new Date(app.created_at);
    const deadlineDate = new Date(createdDate);
    deadlineDate.setDate(createdDate.getDate() + 7);

    const today = new Date();
    const isExpired = today > deadlineDate && app.status === 'Pending';

    const validUntil = deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const isApproved = app.status === 'Approved';
    const isRejected = app.status === 'Rejected';
    const isPending = app.status === 'Pending';

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
            {/* Status Strip */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isApproved ? 'bg-green-500' : isRejected ? 'bg-red-500' : (isExpired ? 'bg-gray-400' : 'bg-yellow-400')}`}></div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pl-2">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">#{String(app.id).padStart(6, '0')}</span>
                        <span className="text-xs text-gray-500 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {new Date(app.created_at).toLocaleDateString()}
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-1">{app.program}</h3>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <p className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {app.barangay}
                        </p>

                        {/* VALIDITY DISPLAY */}
                        {isPending && !isExpired && (
                            <p className="flex items-center text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">
                                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Valid until: {validUntil}
                            </p>
                        )}
                        {isExpired && (
                            <p className="flex items-center text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                                Validity Expired: {validUntil}
                            </p>
                        )}
                    </div>

                    {/* VISUAL TIMELINE */}
                    <div className="mt-6 flex items-center gap-2 max-w-sm">
                        <TimelineStep active={true} label="Submitted" />
                        <div className={`h-1 flex-1 rounded-full ${!isPending && !isExpired ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                        <TimelineStep active={!isPending && !isExpired} label="Reviewed" />
                        <div className={`h-1 flex-1 rounded-full ${(isApproved || isRejected) ? (isApproved ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-200'}`}></div>
                        <TimelineStep active={isApproved || isRejected} label="Result" color={isRejected ? 'bg-red-500' : isApproved ? 'bg-green-500' : ''} />
                    </div>
                </div>

                {/* --- ACTION SECTION --- */}
                <div className="flex flex-col items-end gap-3 min-w-[160px]">
                    <StatusBadge status={isExpired ? 'Expired' : app.status} />

                    {/* STATUS EXPLANATION BOX */}
                    <div className="text-right">
                        {isPending && !isExpired && (
                            <p className="text-xs text-yellow-700 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-100 max-w-[200px]">
                                Your application is currently under review. Please keep your lines open for verification.
                            </p>
                        )}

                        {isExpired && (
                            <p className="text-xs text-gray-600 bg-gray-100 px-3 py-2 rounded-lg border border-gray-200 max-w-[200px]">
                                This application has passed the 7-day validity period. Please contact CSWDO.
                            </p>
                        )}

                        {isApproved && (
                            <div className="flex flex-col gap-2 items-end">
                                <p className="text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100 max-w-[200px]">
                                    Approved! You may now download your claim stub.
                                </p>
                                <a href={route('applications.claim-stub', app.id)} target="_blank" className="inline-flex items-center justify-center w-full text-white text-sm font-bold bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg shadow transition">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    Download Claim Stub
                                </a>
                            </div>
                        )}

                        {isRejected && (
                            <div className="flex flex-col gap-2 items-end">
                                {app.remarks && (
                                    <p className="text-xs text-red-700 bg-red-50 px-3 py-2 rounded-lg border border-red-100 max-w-[200px] text-left">
                                        <strong>Issue:</strong> {app.remarks}
                                    </p>
                                )}
                                <Link href={route('applications.edit', app.id)} className="inline-flex items-center justify-center w-full text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-sm font-bold px-4 py-2 rounded-lg transition">
                                    Edit & Resubmit
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TimelineStep({ active, label, color }) {
    const bgColor = color || 'bg-blue-500';
    return (
        <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full ${active ? bgColor : 'bg-gray-300'} ring-4 ring-white shadow-sm`}></div>
            <span className={`text-[10px] mt-1 font-bold ${active ? 'text-gray-700' : 'text-gray-400'}`}>{label}</span>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        'Approved': 'bg-green-100 text-green-800 border-green-200',
        'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Rejected': 'bg-red-100 text-red-800 border-red-200',
        'Expired': 'bg-gray-100 text-gray-500 border-gray-300',
    };
    return (
        <span className={`px-4 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full uppercase tracking-wide border shadow-sm ${styles[status] || 'bg-gray-100'}`}>
            {status}
        </span>
    );
}

function EmptyState({ activeTab }) {
    return (
        <div className="text-center py-16 flex flex-col items-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">No applications found</h3>
            <p className="text-gray-500 mt-1 text-sm">You don't have any {activeTab} applications yet.</p>
            {activeTab === 'ongoing' && (
                <Link href={route('applications.create')} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow transition transform hover:-translate-y-0.5">
                    Start a New Application
                </Link>
            )}
        </div>
    );
}
