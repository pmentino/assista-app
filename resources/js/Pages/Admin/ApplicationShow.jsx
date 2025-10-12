import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react'; // <-- Import usePage
import { useState, useEffect } from 'react';

export default function ApplicationShow({ application: initialApplication }) {
    // We get the 'auth' object from the global props, the standard way
    const { auth } = usePage().props;

    const [application, setApplication] = useState(initialApplication);

    useEffect(() => {
        setApplication(initialApplication);
    }, [initialApplication]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Application Details</h2>}
        >
            <Head title={`Application #${application.id}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 space-y-4">

                            {/* --- THIS SECTION IS NOW RESPONSIVE --- */}
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
                            {/* --- END OF CHANGE --- */}

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

                    {application.status === 'Pending' && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <h3 className="text-lg font-medium text-gray-900">Admin Actions</h3>
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
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
