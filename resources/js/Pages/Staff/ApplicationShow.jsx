import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

// --- CONFIGURATION ---
// Note: Ideally, this should also come from the DB props in the future,
// but for viewing old applications, this map is a fine fallback.
const REQUIREMENTS_MAP = {
    'Hospitalization': [ 'Personal Letter to Mayor', 'Final Hospital Bill', 'Medical Abstract / Certificate', 'Promissory Note' ],
    'Laboratory Tests': [ 'Personal Letter to Mayor', 'Laboratory Request', 'Medical Certificate' ],
    'Anti-Rabies Vaccine Treatment': [ 'Personal Letter to Mayor', 'Rabies Vaccination Card', 'Medical Certificate' ],
    'Medicine Assistance': [ 'Personal Letter to Mayor', 'Prescription', 'Medical Certificate' ],
    'Funeral Assistance': [ 'Personal Letter to Mayor', 'Death Certificate', 'Burial Contract' ],
    'Chemotherapy': [ 'Personal Letter to Mayor', 'Chemotherapy Protocol', 'Medical Certificate', 'Quotation of Medicine' ],
    'Diagnostic Blood Tests': [ 'Personal Letter to Mayor', 'Diagnostic Request', 'Medical Certificate' ]
};

export default function ApplicationShow({ application: initialApplication }) {
    const { auth } = usePage().props;
    const [application, setApplication] = useState(initialApplication);
    const [showRejectModal, setShowRejectModal] = useState(false); // <--- NEW STATE

    // Form for Staff Remarks (General Notes)
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        remarks: application.remarks || '',
    });

    // Form for Rejection (Specific Return Reason)
    const rejectForm = useForm({
        remarks: '',
    });

    useEffect(() => {
        setApplication(initialApplication);
        setData('remarks', initialApplication.remarks || '');
    }, [initialApplication]);

    // Save General Note
    const submitRemark = (e) => {
        e.preventDefault();
        post(route('staff.applications.remarks.store', application.id), {
            preserveScroll: true,
        });
    };

    // Submit Rejection
    const submitReject = (e) => {
        e.preventDefault();
        rejectForm.post(route('staff.applications.reject', application.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowRejectModal(false);
                // Optional: Force reload to see status change immediately
                // window.location.reload();
            },
        });
    };

    const getAttachmentLabel = (key) => {
        const labels = { valid_id: 'Valid Government ID', indigency_cert: 'Certificate of Indigency' };
        if (labels[key]) return labels[key];
        if (!application.program) return `Attachment ${key}`;

        // Try to find requirements from DB prop if available, else fallback to map
        // For now, we stick to the map or generic label
        const programReqs = REQUIREMENTS_MAP[application.program];
        const index = parseInt(key);
        return (programReqs && programReqs[index]) ? programReqs[index] : `Supporting Document #${index + 1}`;
    };

    const statusColors = {
        'Approved': 'bg-green-100 text-green-800 border-green-200',
        'Rejected': 'bg-red-100 text-red-800 border-red-200',
        'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    {/* Top Row: Back, ID, Status */}
                    <div className="flex flex-wrap items-center gap-3">
                        <Link href={route('staff.applications.index')} className="text-gray-500 hover:text-gray-700 flex items-center pr-3 border-r border-gray-300">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                            Back
                        </Link>
                        <h2 className="font-bold text-xl text-gray-800 leading-tight">
                            #{String(application.id).padStart(5, '0')}
                        </h2>
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${statusColors[application.status] || 'bg-gray-100'}`}>
                            {application.status}
                        </span>
                    </div>

                    {/* --- NEW: REJECT BUTTON (Only if Pending) --- */}
                    {application.status === 'Pending' && (
                        <div>
                            <button
                                onClick={() => setShowRejectModal(true)}
                                className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 active:bg-red-900 focus:outline-none focus:border-red-900 focus:ring ring-red-300 disabled:opacity-25 transition ease-in-out duration-150"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Reject / Return
                            </button>
                        </div>
                    )}
                </div>
            }
        >
            <Head title={`Application #${application.id}`} />

            <div className="py-6 md:py-10 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Card 1: Request Info */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                                    <h3 className="font-bold text-gray-800">Assistance Request</h3>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Program Type</p>
                                            <p className="text-lg font-bold text-blue-900 mt-1">{application.program}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Submitted</p>
                                            <p className="text-gray-900 mt-1">{new Date(application.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* Rejected Reason Display */}
                                    {application.status === 'Rejected' && application.remarks && (
                                        <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100">
                                            <p className="text-xs font-bold text-red-800 uppercase mb-1">Reason for Return/Rejection</p>
                                            <p className="text-red-900">{application.remarks}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Card 2: Documents */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                                    <h3 className="font-bold text-gray-800">Submitted Documents</h3>
                                </div>
                                <div className="p-6 grid grid-cols-1 gap-4">
                                    {application.attachments && Object.entries(application.attachments).map(([key, path]) => {
                                        if (typeof path !== 'string') return null;
                                        return (
                                            <a
                                                key={key}
                                                href={`/storage/${path}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition group"
                                            >
                                                <div className="bg-blue-100 p-2 rounded-md text-blue-600 mr-3 shrink-0">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-bold text-gray-800 group-hover:text-blue-800 truncate">
                                                        {getAttachmentLabel(key)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">Click to view</p>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-6">

                            {/* Profile Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                                    <h3 className="font-bold text-gray-800">Applicant Profile</h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    {/* (Same Profile Info Logic as before) */}
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                                        <p className="text-gray-900 font-medium">{application.first_name} {application.last_name}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Birth Date</label>
                                            <p className="text-gray-900">{new Date(application.birth_date).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Sex</label>
                                            <p className="text-gray-900">{application.sex}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
                                        <p className="text-gray-900">{application.house_no} {application.barangay}, {application.city}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                                        <p className="text-gray-900 font-mono">{application.contact_number}</p>
                                    </div>
                                </div>
                            </div>

                            {/* STAFF VERIFICATION ACTION */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                                    <h3 className="font-bold text-blue-800">Internal Notes</h3>
                                </div>
                                <div className="p-6">
                                    <p className="text-sm text-gray-500 mb-4">
                                        Add internal verification notes for the Admin (not visible to applicant).
                                    </p>
                                    <form onSubmit={submitRemark}>
                                        <label htmlFor="remarks" className="block text-sm font-bold text-gray-700 mb-2">Remarks</label>
                                        <textarea
                                            id="remarks"
                                            value={data.remarks}
                                            onChange={(e) => setData('remarks', e.target.value)}
                                            className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
                                            rows="4"
                                            placeholder="e.g., Documents checked and valid. Recommended for approval."
                                        ></textarea>
                                        <InputError message={errors.remarks} className="mt-2" />

                                        <div className="flex items-center justify-between mt-4">
                                            {recentlySuccessful && (
                                                <span className="text-sm text-green-600 font-bold animate-pulse">✓ Saved</span>
                                            )}
                                            {!recentlySuccessful && <span></span>}
                                            <PrimaryButton disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                                                Save Note
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* --- REJECTION MODAL (NEW) --- */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 backdrop-blur-sm p-4">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
                        <h3 className="text-lg font-bold mb-2 text-red-700">Reject / Return Application</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Please provide a reason. The applicant will see this and can resubmit.
                        </p>
                        <form onSubmit={submitReject}>
                            <textarea
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500 mb-4"
                                rows="4"
                                value={rejectForm.data.remarks}
                                onChange={(e) => rejectForm.setData('remarks', e.target.value)}
                                placeholder="Reason for rejection (e.g., ID is blurry)..."
                                required
                            ></textarea>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowRejectModal(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={rejectForm.processing}
                                    className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow"
                                >
                                    Confirm Reject
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}
