import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

// --- CONFIGURATION ---
const REQUIREMENTS_MAP = {
    'Hospitalization': ['Personal Letter to Mayor', 'Final Hospital Bill', 'Medical Abstract / Certificate', 'Promissory Note'],
    'Laboratory Tests': ['Personal Letter to Mayor', 'Laboratory Request', 'Medical Certificate'],
    'Anti-Rabies Vaccine Treatment': ['Personal Letter to Mayor', 'Rabies Vaccination Card', 'Medical Certificate'],
    'Medicine Assistance': ['Personal Letter to Mayor', 'Prescription', 'Medical Certificate'],
    'Funeral Assistance': ['Personal Letter to Mayor', 'Death Certificate', 'Burial Contract'],
    'Chemotherapy': ['Personal Letter to Mayor', 'Chemotherapy Protocol', 'Medical Certificate', 'Quotation of Medicine'],
    'Diagnostic Blood Tests': ['Personal Letter to Mayor', 'Diagnostic Request', 'Medical Certificate']
};

export default function ApplicationShow({ application }) {
    // FIX: Destructure 'errors' from global props safely
    const { auth, errors = {} } = usePage().props;
    const user = auth?.user || { name: 'Admin' };

    // Form for Remarks (Rejection / Staff Note)
const { data, setData, post, processing, recentlySuccessful } = useForm({ remarks: application.remarks || '' });

    // Form for Approval (Amount)
    const approveForm = useForm({ amount: '' });

    // Modals State
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);

    // --- HANDLERS ---

    // 1. Submit Rejection (Changes status to Rejected)
    const submitReject = (e) => {
        e.preventDefault();
        post(route('admin.applications.remarks.store', application.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowRejectModal(false);
                window.location.reload();
            },
        });
    };

    // 2. Submit Approval (Changes status to Approved)
    const submitApprove = (e) => {
        e.preventDefault();
        approveForm.post(route('admin.applications.approve', application.id), {
            preserveScroll: true,
            preserveState: true, // Keep modal open on error
            onSuccess: () => {
                setShowApproveModal(false);
                approveForm.reset();
                window.location.reload();
            },
        });
    };

    // 3. Submit Staff Verification Note (Does NOT change status) - FIX APPLIED HERE
    const submitNote = (e) => {
        e.preventDefault();
        // Uses the new safe Admin route
        post(route('admin.applications.note.store', application.id), {
            preserveScroll: true,
        });
    };

    const getAttachmentLabel = (key) => {
        const labels = {
            valid_id: 'Valid Government ID',
            indigency_cert: 'Certificate of Indigency'
        };
        if (labels[key]) return labels[key];
        if (!application.program) return `Attachment ${key}`;
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
            user={user}
            header={
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    {/* Top Row: Back, ID, Status */}
                    <div className="flex flex-wrap items-center gap-3">
                        <Link href={route('admin.applications.index')} className="text-gray-500 hover:text-gray-700 flex items-center pr-3 border-r border-gray-300">
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

                    {/* RESTORED: Approve / Reject Buttons */}
                    {application.status === 'Pending' && (
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <button
                                onClick={() => setShowRejectModal(true)}
                                className="w-full sm:w-auto justify-center px-4 py-3 bg-white border border-red-300 text-red-700 font-bold rounded-lg shadow-sm hover:bg-red-50 transition flex items-center"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => {
                                    approveForm.clearErrors();
                                    setShowApproveModal(true);
                                }}
                                className="w-full sm:w-auto justify-center px-4 py-3 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 transition flex items-center"
                            >
                                Approve
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

                                    {application.status === 'Approved' && (
                                        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100 flex justify-between items-center">
                                            <div>
                                                <p className="text-xs font-bold text-green-800 uppercase">Amount</p>
                                                <p className="text-xl font-bold text-green-700">₱{new Intl.NumberFormat('en-PH').format(application.amount_released)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-green-800 uppercase">Date Approved</p>
                                                <p className="text-green-900 font-medium">
                                                    {application.approved_date ? new Date(application.approved_date).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {application.status === 'Rejected' && application.remarks && (
                                        <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100">
                                            <p className="text-xs font-bold text-red-800 uppercase mb-1">Reason for Rejection</p>
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
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                                        <p className="text-gray-900 font-medium">{application.first_name} {application.middle_name} {application.last_name} {application.suffix_name}</p>
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
                                        <label className="text-xs font-bold text-gray-500 uppercase">Civil Status</label>
                                        <p className="text-gray-900">{application.civil_status}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                                    <h3 className="font-bold text-gray-800">Contact Details</h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
                                        <p className="text-gray-900">{application.house_no} {application.barangay}, {application.city}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                                        <p className="text-gray-900 font-mono">{application.contact_number}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                                        <p className="text-gray-900 break-all">{application.email}</p>
                                    </div>
                                    {application.facebook_link && (
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Facebook Profile</label>
                                            <a
                                                href={application.facebook_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block mt-1 text-blue-600 hover:underline break-all font-medium"
                                            >
                                                {application.facebook_link}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ADMIN/STAFF NOTE BOX (FIXED) */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                                    <h3 className="font-bold text-blue-800">Staff Verification</h3>
                                </div>
                                <div className="p-6">
                                    <p className="text-sm text-gray-500 mb-4">
                                        Review the application and add notes for the admin.
                                    </p>
                                    <form onSubmit={submitNote}>
                                        <label htmlFor="remarks" className="block text-sm font-bold text-gray-700 mb-2">Remarks / Notes</label>
                                        <textarea
                                            id="remarks"
                                            value={data.remarks}
                                            onChange={(e) => setData('remarks', e.target.value)}
                                            className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
                                            rows="4"
                                            placeholder="e.g., Documents verified."
                                        ></textarea>
                                        <div className="flex items-center justify-between mt-4">
    {/* Success Message */}
    {recentlySuccessful && (
        <span className="text-sm text-green-600 font-bold animate-pulse">
            ✓ Note Saved
        </span>
    )}
    {!recentlySuccessful && <span></span>} {/* Spacer to keep button on right */}

    <PrimaryButton disabled={processing} className="bg-blue-800">
        Save Remark
    </PrimaryButton>
</div>
                                    </form>
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* --- REJECTION MODAL --- */}
                    {showRejectModal && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 backdrop-blur-sm p-4">
                            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
                                <h3 className="text-lg font-bold mb-2 text-red-700">Reject Application</h3>
                                <p className="text-sm text-gray-500 mb-4">Please provide a reason for rejection.</p>
                                <form onSubmit={submitReject}>
                                    <textarea
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500 mb-4"
                                        rows="4"
                                        value={data.remarks}
                                        onChange={(e) => setData('remarks', e.target.value)}
                                        placeholder="Reason for rejection..."
                                        required
                                    ></textarea>
                                    <div className="flex justify-end gap-2">
                                        <button type="button" onClick={() => setShowRejectModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200">Cancel</button>
                                        <button type="submit" disabled={processing} className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow">Confirm Rejection</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* --- APPROVAL MODAL --- */}
                    {showApproveModal && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 backdrop-blur-sm p-4">
                            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
                                <h3 className="text-lg font-bold mb-2 text-green-700">Approve Application</h3>
                                <p className="text-sm text-gray-500 mb-4">Enter amount to release.</p>
                                <form onSubmit={submitApprove}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Amount (PHP)</label>
                                        <div className="relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-gray-500 sm:text-sm font-bold">₱</span></div>
                                            <input
                                                type="number"
                                                className={`block w-full pl-7 sm:text-lg font-bold border rounded-lg py-3 ${(approveForm.errors.amount || errors?.amount) ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'}`}
                                                placeholder="0.00"
                                                value={approveForm.data.amount}
                                                onChange={(e) => approveForm.setData('amount', e.target.value)}
                                                required
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>

                                        {/* ERROR MESSAGE DISPLAY */}
                                        {(approveForm.errors.amount || errors?.amount) && (
                                            <div className="mt-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative text-sm font-bold animate-pulse shadow-sm">
                                                <div className="flex items-center">
                                                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {approveForm.errors.amount || errors?.amount}
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button type="button" onClick={() => setShowApproveModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200">Cancel</button>
                                        <button type="submit" disabled={approveForm.processing} className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow">Confirm Approval</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
