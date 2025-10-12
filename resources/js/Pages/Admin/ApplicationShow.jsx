import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

export default function ApplicationShow({ application: initialApplication }) {
    const { auth } = usePage().props;
    const [application, setApplication] = useState(initialApplication);

    // useForm hook to handle the remarks form state and submission
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        remarks: application.remarks || '',
    });

    useEffect(() => {
        setApplication(initialApplication);
        setData('remarks', initialApplication.remarks || '');
    }, [initialApplication]);

    // Function to submit the remark to the backend
    const submitRemark = (e) => {
        e.preventDefault();
        post(route('admin.applications.remarks.store', application.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Application Details</h2>}
        >
            <Head title={`Application #${application.id}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Application Details Card */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start text-center sm:text-left">
                                <h3 className="text-2xl font-bold mb-2 sm:mb-0">Application #{application.id}</h3>
                                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full self-center sm:self-auto ${
                                    application.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                    application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {application.status}
                                </span>
                            </div>
                            <hr/>
                            <div>
                                <h4 className="font-bold text-lg mb-2">Applicant Information</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                    <p><strong>Name:</strong> {application.user?.name || 'N/A'}</p>
                                    <p><strong>Birth Date:</strong> {application.birth_date}</p>
                                    <p><strong>Sex:</strong> {application.sex}</p>
                                    <p><strong>Civil Status:</strong> {application.civil_status}</p>
                                    <p className="sm:col-span-2"><strong>Address:</strong> {`${application.house_no || ''} ${application.barangay}, ${application.city}`}</p>
                                    <p><strong>Contact #:</strong> {application.contact_number}</p>
                                    <p><strong>Email:</strong> {application.email}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mt-4">Assistance Details</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                    <p><strong>Program:</strong> {application.program}</p>
                                    <p><strong>Date of Incident:</strong> {application.date_of_incident || 'N/A'}</p>
                                </div>
                            </div>
                            {application.attachments && application.attachments.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-lg mt-4">Attachment Files</h4>
                                    <ul className="list-disc list-inside mt-2 space-y-1">
                                        {application.attachments.map((file, index) => (
                                            <li key={index}>
                                                <a href={`/storage/${file}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    Attachment {index + 1}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="mt-6">
                                <Link href={route('admin.applications.index')} className="text-blue-600 hover:underline">
                                    &larr; Back to all applications
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Admin Actions and Remarks Card */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium text-gray-900">Admin Actions</h3>

                            {/* Approve/Reject Buttons are here */}
                            {application.status === 'Pending' && (
                                <div className="mt-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                    <div className="relative group">
                                        <Link
                                            href={route('admin.applications.approve', application.id)}
                                            as="button" method="get" preserveState={false}
                                            className="w-full justify-center inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-500 active:bg-green-700"
                                        >
                                            Approve
                                        </Link>
                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            Approve this application
                                        </span>
                                    </div>
                                    <div className="relative group">
                                        <Link
                                            href={route('admin.applications.reject', application.id)}
                                            as="button" method="get" preserveState={false}
                                            className="w-full justify-center inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700"
                                        >
                                            Reject
                                        </Link>
                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            Reject this application
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Remarks Form is here */}
                            <form onSubmit={submitRemark} className="mt-6 border-t pt-6">
                                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">Add or Edit a Remark</label>
                                <textarea
                                    id="remarks"
                                    value={data.remarks}
                                    onChange={(e) => setData('remarks', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    rows="4"
                                    placeholder="e.g., Your requirements are incomplete. Please submit a valid ID..."
                                ></textarea>
                                <InputError message={errors.remarks} className="mt-2" />
                                <div className="flex items-center gap-4 mt-4">
                                    <PrimaryButton disabled={processing}>Save Remark</PrimaryButton>
                                    {recentlySuccessful && <p className="text-sm text-gray-600">Saved.</p>}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
