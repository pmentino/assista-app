import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// --- CONFIGURATION ---
const REQUIREMENTS_MAP = {
    'Hospitalization': [
        'Personal Letter to Mayor',
        'Final Hospital Bill',
        'Medical Abstract / Certificate',
        'Promissory Note'
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
        'Prescription',
        'Medical Certificate'
    ],
    'Funeral Assistance': [
        'Personal Letter to Mayor',
        'Death Certificate',
        'Burial Contract'
    ],
    'Chemotherapy': [
        'Personal Letter to Mayor',
        'Chemotherapy Protocol',
        'Medical Certificate',
        'Quotation of Medicine'
    ],
    'Diagnostic Blood Tests': [
        'Personal Letter to Mayor',
        'Diagnostic Request',
        'Medical Certificate'
    ]
};

export default function ApplicationShow({ application }) {
    // FIX: Access flash messages from props
    const { auth, flash } = usePage().props;
    const user = auth?.user || { name: 'Admin' };

    // Forms
    const { data, setData, post, processing } = useForm({ remarks: application.remarks || '' });
    const approveForm = useForm({ amount: '' });

    // Modals
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);

    // FIX: Local state for budget error
    const [budgetError, setBudgetError] = useState(null);

    // FIX: Watch for flash.budget_error and re-open modal if needed
    useEffect(() => {
        if (flash?.budget_error) {
            setBudgetError(flash.budget_error);
            setShowApproveModal(true);
        }
    }, [flash]);

    // Handlers
    const submitRemark = (e) => {
        e.preventDefault();
        post(route('admin.applications.remarks.store', application.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowRejectModal(false);
                window.location.reload();
            },
        });
    };

    const submitApprove = (e) => {
        e.preventDefault();
        setBudgetError(null); // Clear old errors

        approveForm.post(route('admin.applications.approve', application.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Only close if there is NO budget error coming back
                // (Note: useEffect handles re-opening, but we check here to be safe)
                if (!flash?.budget_error) {
                    setShowApproveModal(false);
                    approveForm.reset();
                    window.location.reload();
                }
            }
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

        return (programReqs && programReqs[index])
            ? programReqs[index]
            : `Supporting Document #${index + 1}`;
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

                    {/* Bottom Row: Buttons */}
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
                                    setBudgetError(null);
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
                        </div>

                    </div>

                    {/* REJECTION MODAL */}
                    {showRejectModal && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 backdrop-blur-sm p-4">
                            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
                                <h3 className="text-lg font-bold mb-2 text-red-700">Reject Application</h3>
                                <p className="text-sm text-gray-500 mb-4">Please provide a reason for rejection.</p>
                                <form onSubmit={submitRemark}>
                                    <textarea
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500 mb-4"
                                        rows="4"
                                        value={data.remarks}
                                        onChange={(e) => setData('remarks', e.target.value)}
                                        placeholder="Reason..."
                                        required
                                    ></textarea>
                                    <div className="flex justify-end gap-2">
                                        <button type="button" onClick={() => setShowRejectModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200">Cancel</button>
                                        <button type="submit" disabled={processing} className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow">Confirm</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* APPROVAL MODAL */}
                    {showApproveModal && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 backdrop-blur-sm p-4">
                            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
                                <h3 className="text-lg font-bold mb-2 text-green-700">Approve Application</h3>
                                <p className="text-sm text-gray-500 mb-4">Enter amount to release.</p>

                                {/* FIX: Display the Budget Error here */}
                                {budgetError && (
                                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm font-bold animate-pulse">
                                        <svg className="w-5 h-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        {budgetError}
                                    </div>
                                )}

                                <form onSubmit={submitApprove}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Amount (PHP)</label>
                                        <div className="relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-gray-500 sm:text-sm font-bold">₱</span></div>
                                            <input
                                                type="number"
                                                className="block w-full pl-7 sm:text-lg font-bold border rounded-lg py-3 border-gray-300 focus:ring-green-500 focus:border-green-500"
                                                placeholder="0.00"
                                                value={approveForm.data.amount}
                                                onChange={(e) => approveForm.setData('amount', e.target.value)}
                                                required
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button type="button" onClick={() => setShowApproveModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200">Cancel</button>
                                        <button type="submit" disabled={approveForm.processing} className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow">Confirm</button>
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
