import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function ApplicationShow({ auth, application }) {
    // Safety check: Prevents "Cannot read properties of undefined (reading 'user')"
    const user = auth?.user || { name: 'Admin' };

    const { data, setData, post, processing } = useForm({
        remarks: application.remarks || '',
    });

    const [showRejectModal, setShowRejectModal] = useState(false);

    // This function handles the rejection submission
    const submitRemark = (e) => {
        e.preventDefault();
        // Post to the correct route
        post(route('admin.applications.remarks.store', application.id), {
            preserveScroll: true,
            onSuccess: () => {
                 setShowRejectModal(false);
                 // Reload to see the status update
                 window.location.reload();
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={user} // Pass the safe user object
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Application Details</h2>}
        >
            <Head title={`Application #${application.id}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            {/* Header / Actions */}
                            <div className="flex justify-between items-start mb-6 border-b pb-4">
                                <div>
                                    <h3 className="text-2xl font-bold mb-1">{application.program}</h3>
                                    <p className="text-sm text-gray-500">
                                        Submitted by: <span className="font-semibold">{application.first_name} {application.last_name}</span>
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
                                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Approve
                                            </Link>
                                            <button
                                                onClick={() => setShowRejectModal(true)}
                                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <h4 className="font-bold text-lg mb-3 border-b border-gray-100 pb-2">Personal Information</h4>
                                    <div className="space-y-2">
                                        <p><span className="font-medium text-gray-600">Full Name:</span> {application.first_name} {application.middle_name} {application.last_name} {application.suffix_name}</p>
                                        <p><span className="font-medium text-gray-600">Birth Date:</span> {new Date(application.birth_date).toLocaleDateString()}</p>
                                        <p><span className="font-medium text-gray-600">Sex:</span> {application.sex}</p>
                                        <p><span className="font-medium text-gray-600">Civil Status:</span> {application.civil_status}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-3 border-b border-gray-100 pb-2">Contact & Address</h4>
                                    <div className="space-y-2">
                                        <p><span className="font-medium text-gray-600">Address:</span> {application.house_no}, {application.barangay}, {application.city}</p>
                                        <p><span className="font-medium text-gray-600">Contact No:</span> {application.contact_number}</p>
                                        <p><span className="font-medium text-gray-600">Email:</span> {application.email}</p>
                                        <p><span className="font-medium text-gray-600">Facebook:</span> {application.facebook_link || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Attachments Section */}
                            <div className="mb-8">
                                <h4 className="font-bold text-lg mb-3 border-b border-gray-100 pb-2">Attachments</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {/* Valid ID */}
                                    <div className="border rounded p-3 bg-gray-50">
                                        <p className="font-semibold text-sm mb-2">Valid ID</p>
                                        {application.attachments?.valid_id ? (
                                            <a
                                                href={`/storage/${application.attachments.valid_id}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 hover:underline text-sm break-all"
                                            >
                                                View Document
                                            </a>
                                        ) : <span className="text-gray-400 text-sm">No file</span>}
                                    </div>

                                    {/* Indigency */}
                                    <div className="border rounded p-3 bg-gray-50">
                                        <p className="font-semibold text-sm mb-2">Certificate of Indigency</p>
                                        {application.attachments?.indigency_cert ? (
                                            <a
                                                href={`/storage/${application.attachments.indigency_cert}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 hover:underline text-sm break-all"
                                            >
                                                View Document
                                            </a>
                                        ) : <span className="text-gray-400 text-sm">No file</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Rejection Modal / Remarks Area */}
                            {showRejectModal && (
                                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                                    <div className="bg-white p-5 rounded-lg shadow-xl w-96">
                                        <h3 className="text-lg font-bold mb-4">Reject Application</h3>
                                        <form onSubmit={submitRemark}>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Reason for Rejection
                                                </label>
                                                <textarea
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    rows="4"
                                                    value={data.remarks}
                                                    onChange={(e) => setData('remarks', e.target.value)}
                                                    placeholder="Please explain why this application is being returned..."
                                                    required
                                                ></textarea>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowRejectModal(false)}
                                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                                >
                                                    Confirm Rejection
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
