import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

// --- CONFIGURATION: Requirements Labels ---
const REQUIREMENTS_MAP = {
    'Hospitalization': [
        'Personal Letter to Mayor',
        'Final Hospital Bill',
        'Medical Abstract / Medical Certificate',
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
    const { auth } = usePage().props;
    const user = auth?.user || { name: 'Admin' };

    // Form for Rejection
    const { data, setData, post, processing } = useForm({
        remarks: application.remarks || '',
    });

    // Form for Approval (Amount)
    const approveForm = useForm({
        amount: '',
    });

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);

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
        approveForm.post(route('admin.applications.approve', application.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowApproveModal(false);
                window.location.reload();
            }
        });
    };

    const getAttachmentLabel = (index) => {
        if (!application.program) return `Attachment ${parseInt(index) + 1}`;
        const programReqs = REQUIREMENTS_MAP[application.program];
        const i = parseInt(index);
        if (programReqs && programReqs[i]) {
            return programReqs[i];
        }
        return `Attachment #${i + 1}`;
    };

    return (
        <AuthenticatedLayout
            user={user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Application Details</h2>}
        >
            <Head title={`Application #${application.id}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            {/* Header / Actions */}
                            <div className="flex flex-col md:flex-row justify-between items-start mb-6 border-b pb-4 gap-4">
                                <div>
                                    <h3 className="text-3xl font-bold mb-1 text-blue-900">{application.program}</h3>
                                    <p className="text-sm text-gray-500">
                                        Submitted by: <span className="font-semibold text-gray-900">{application.first_name} {application.last_name}</span>
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Date Submitted: {new Date(application.created_at).toLocaleDateString()}
                                    </p>

                                    {/* --- NEW CODE: SHOW APPROVED DATE HERE --- */}
                                    {application.status === 'Approved' && application.approved_date && (
                                       <p className="text-sm text-green-700 font-bold mt-1">
                                           Date Approved: {new Date(application.approved_date).toLocaleString('en-PH', {
                                               year: 'numeric', month: 'long', day: 'numeric',
                                               hour: '2-digit', minute: '2-digit'
                                           })}
                                       </p>
                                    )}
                                    {/* ----------------------------------------- */}

                                    {/* Display Amount if Approved */}
                                    {application.status === 'Approved' && application.amount_released && (
                                        <p className="mt-2 text-lg font-bold text-green-600">
                                            Amount Released: ₱{new Intl.NumberFormat('en-PH').format(application.amount_released)}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    {application.status === 'Pending' && (
                                        <>
                                            <button
                                                onClick={() => setShowApproveModal(true)}
                                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => setShowRejectModal(true)}
                                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded shadow"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    <span className={`px-4 py-2 rounded-full font-bold text-sm border ${
                                        application.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
                                        application.status === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                                        'bg-yellow-100 text-yellow-800 border-yellow-200'
                                    }`}>
                                        {application.status}
                                    </span>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="bg-gray-50 p-4 rounded-lg border">
                                    <h4 className="font-bold text-lg mb-3 border-b border-gray-200 pb-2 text-gray-700">Personal Information</h4>
                                    <div className="space-y-3 text-sm">
                                        <p><span className="font-medium text-gray-500 block">Full Name:</span> {application.first_name} {application.middle_name} {application.last_name} {application.suffix_name}</p>
                                        <p><span className="font-medium text-gray-500 block">Birth Date:</span> {new Date(application.birth_date).toLocaleDateString()}</p>
                                        <p><span className="font-medium text-gray-500 block">Sex:</span> {application.sex}</p>
                                        <p><span className="font-medium text-gray-500 block">Civil Status:</span> {application.civil_status}</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg border">
                                    <h4 className="font-bold text-lg mb-3 border-b border-gray-200 pb-2 text-gray-700">Contact & Address</h4>
                                    <div className="space-y-3 text-sm">
                                        <p><span className="font-medium text-gray-500 block">Address:</span> {application.house_no} {application.barangay}, {application.city}</p>
                                        <p><span className="font-medium text-gray-500 block">Contact No:</span> {application.contact_number}</p>
                                        <p><span className="font-medium text-gray-500 block">Email:</span> {application.email}</p>
                                        <p><span className="font-medium text-gray-500 block">Facebook:</span> {application.facebook_link || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Attachments Section */}
                            <div className="mb-8">
                                <h4 className="font-bold text-lg mb-4 text-gray-800">Submitted Documents</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {application.attachments?.valid_id && (
                                        <div className="border rounded-lg p-4 bg-blue-50 hover:bg-blue-100 transition">
                                            <p className="font-bold text-sm text-blue-900 mb-2">Valid ID</p>
                                            <a href={`/storage/${application.attachments.valid_id}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm font-medium flex items-center">
                                                View Document
                                            </a>
                                        </div>
                                    )}
                                    {application.attachments?.indigency_cert && (
                                        <div className="border rounded-lg p-4 bg-blue-50 hover:bg-blue-100 transition">
                                            <p className="font-bold text-sm text-blue-900 mb-2">Social Case Summary</p>
                                            <a href={`/storage/${application.attachments.indigency_cert}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm font-medium flex items-center">
                                                View Document
                                            </a>
                                        </div>
                                    )}
                                    {application.attachments && Object.entries(application.attachments).map(([key, path]) => {
                                        if (key === 'valid_id' || key === 'indigency_cert' || typeof path !== 'string') return null;
                                        return (
                                            <div key={key} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
                                                <p className="font-bold text-sm text-gray-800 mb-2">{getAttachmentLabel(key)}</p>
                                                <a href={`/storage/${path}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm font-medium flex items-center">
                                                    View Document
                                                </a>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* --- REJECTION MODAL --- */}
                            {showRejectModal && (
                                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                                    <div className="bg-white p-6 rounded-lg shadow-xl w-96 transform transition-all scale-100">
                                        <h3 className="text-lg font-bold mb-4 text-red-700">Reject Application</h3>
                                        <form onSubmit={submitRemark}>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                                                <textarea
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500"
                                                    rows="4"
                                                    value={data.remarks}
                                                    onChange={(e) => setData('remarks', e.target.value)}
                                                    required
                                                ></textarea>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <button type="button" onClick={() => setShowRejectModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Cancel</button>
                                                <button type="submit" disabled={processing} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Confirm Rejection</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* --- APPROVAL MODAL --- */}
                            {showApproveModal && (
                                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                                    <div className="bg-white p-6 rounded-lg shadow-xl w-96 transform transition-all scale-100">
                                        <h3 className="text-lg font-bold mb-4 text-green-700">Approve Application</h3>
                                        <p className="text-sm text-gray-500 mb-4">Please enter the total amount of financial assistance to be released.</p>
                                        <form onSubmit={submitApprove}>
                                            <div className="mb-4">
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Amount (PHP) *</label>
                                                <div className="relative rounded-md shadow-sm">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <span className="text-gray-500 sm:text-sm">₱</span>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        className="focus:ring-green-500 focus:border-green-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md"
                                                        placeholder="0.00"
                                                        value={approveForm.data.amount}
                                                        onChange={(e) => approveForm.setData('amount', e.target.value)}
                                                        required
                                                        min="0"
                                                        step="0.01"
                                                    />
                                                </div>
                                                {approveForm.errors.amount && (
                                                    <p className="text-red-500 text-xs mt-1">{approveForm.errors.amount}</p>
                                                )}
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <button type="button" onClick={() => setShowApproveModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Cancel</button>
                                                <button type="submit" disabled={approveForm.processing} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-bold shadow">
                                                    Confirm & Approve
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
