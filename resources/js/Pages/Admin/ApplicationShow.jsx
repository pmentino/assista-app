import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

export default function ApplicationShow({ auth, application: initialApplication }) {
    const [application, setApplication] = useState(initialApplication);

    const handleUpdateStatus = (newStatus) => {
        if (confirm(`Are you sure you want to ${newStatus.toLowerCase()} this application?`)) {
            // This is the critical line that ensures the correct URL is used.
            router.patch(route('admin.applications.status.update', { application: application.id }), {
                status: newStatus,
            }, {
                preserveScroll: true,
                onSuccess: (page) => {
                    toast.success(`Application status updated to ${newStatus}.`);
                    setApplication(page.props.application);
                },
                onError: (errors) => {
                    console.error(errors);
                    toast.error('Failed to update status. See console for details.');
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Application Details</h2>}
        >
            <Head title={`Application #${application.id}`} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold">Application #{application.id}</h3>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${ application.status === 'Approved' ? 'bg-green-100 text-green-800' : application.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800' }`}>
                                    {application.status}
                                </span>
                            </div>
                            <hr className="my-4" />
                            <h4 className="font-bold text-lg mb-2">Applicant Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                <p><strong>Name:</strong> {application.user.name}</p>
                                <p><strong>Birth Date:</strong> {application.birth_date}</p>
                                <p><strong>Address:</strong> {application.address}</p>
                                <p><strong>Contact #:</strong> {application.contact_number}</p>
                                <p><strong>Email:</strong> {application.email}</p>
                            </div>
                            <hr className="my-4" />
                            <h4 className="font-bold text-lg mb-2">Assistance Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                <p><strong>Program:</strong> {application.program}</p>
                                <p><strong>Date of Incident:</strong> {application.date_of_incident || 'N/A'}</p>
                            </div>
                            <div className="mt-6">
                                <Link href={route('admin.applications.index')} className="text-blue-600 hover:underline">&larr; Back to all applications</Link>
                            </div>
                        </div>
                    </div>

                    {application.status === 'Pending' && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <h3 className="text-lg font-medium">Admin Actions</h3>
                                <div className="mt-4 flex items-center space-x-4">
                                    <button onClick={() => handleUpdateStatus('Approved')} className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-500 active:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150">Approve</button>
                                    <button onClick={() => handleUpdateStatus('Rejected')} className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150">Reject</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
