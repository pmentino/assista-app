import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
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
    // FIX 1: Safe Auth Access
    const { auth } = usePage().props;
    const user = auth?.user || { name: 'Admin' };

    const { data, setData, post, processing } = useForm({
        remarks: application.remarks || '',
    });

    const [showRejectModal, setShowRejectModal] = useState(false);

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

    // Helper to get the label. index matches the order in REQUIREMENTS_MAP
    const getAttachmentLabel = (index) => {
        if (!application.program) return `Attachment ${parseInt(index) + 1}`;

        const programReqs = REQUIREMENTS_MAP[application.program];
        // The index comes from the loop as a string "0", "1", need to parse it
        const i = parseInt(index);

        if (programReqs && programReqs[i]) {
            return programReqs[i];
        }
        return `Attachment #${i + 1}`; // Fallback
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
                                        Date: {new Date(application.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    {application.status === 'Pending' && (
                                        <>
                                            <Link
                                                href={route('admin.applications.approve', application.id)}
                                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow"
                                            >
                                                Approve
                                            </Link>
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

                            {/* Applicant Details Grid */}
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

                            {/* --- ATTACHMENTS SECTION --- */}
                            <div className="mb-8">
                                <h4 className="font-bold text-lg mb-4 text-gray-800">Submitted Documents</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                                    {/* 1. Valid ID (Manually Checked) */}
                                    {application.attachments?.valid_id && (
                                        <div className="border rounded-lg p-4 bg-blue-50 hover:bg-blue-100 transition">
                                            <p className="font-bold text-sm text-blue-900 mb-2">Valid ID</p>
                                            <a
                                                href={`/storage/${application.attachments.valid_id}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 hover:underline text-sm font-medium flex items-center"
                                            >
                                                View Document
                                            </a>
                                        </div>
                                    )}

                                    {/* 2. Indigency (Manually Checked) */}
                                    {application.attachments?.indigency_cert && (
                                        <div className="border rounded-lg p-4 bg-blue-50 hover:bg-blue-100 transition">
                                            <p className="font-bold text-sm text-blue-900 mb-2">Social Case Summary</p>
                                            <a
                                                href={`/storage/${application.attachments.indigency_cert}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 hover:underline text-sm font-medium flex items-center"
                                            >
                                                View Document
                                            </a>
                                        </div>
                                    )}

                                    {/* 3. FIX: Iterate over Object.entries for the rest */}
                                    {application.attachments && Object.entries(application.attachments).map(([key, path]) => {
                                        // Skip the keys we already displayed manually
                                        if (key === 'valid_id' || key === 'indigency_cert') return null;

                                        // Check if path is valid string (not null)
                                        if (typeof path !== 'string') return null;

                                        return (
                                            <div key={key} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
                                                <p className="font-bold text-sm text-gray-800 mb-2">
                                                    {getAttachmentLabel(key)}
                                                </p>
                                                <a
                                                    href={`/storage/${path}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-600 hover:underline text-sm font-medium flex items-center"
                                                >
                                                    View Document
                                                </a>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Rejection Modal */}
                            {showRejectModal && (
                                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                                    <div className="bg-white p-6 rounded-lg shadow-xl w-96 transform transition-all scale-100">
                                        <h3 className="text-lg font-bold mb-4 text-red-700">Reject Application</h3>
                                        <form onSubmit={submitRemark}>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Rejection</label>
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

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
