import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'react-hot-toast';

export default function ApplicationShow({ auth, application }) {

    const handleUpdateStatus = (newStatus) => {
        if (confirm(`Are you sure you want to ${newStatus.toLowerCase()} this application?`)) {

            const url = `/admin/applications/${application.id}/status`;

            router.patch(url, {
                status: newStatus,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`Application status updated to ${newStatus}.`);
                },
                onError: (errors) => {
                    toast.error('Failed to update status.');
                    console.error(errors);
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
                        <div className="p-6 text-gray-900 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-bold">Application #{application.id}</h3>
                                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                    <p><strong>Name:</strong> {application.first_name} {application.last_name}</p>
                                    <p><strong>Birth Date:</strong> {application.birth_date}</p>
                                    <p><strong>Address:</strong> {application.address}</p>
                                    <p><strong>Contact #:</strong> {application.contact_number}</p>
                                    <p><strong>Email:</strong> {application.email}</p>
                                    <p><strong>Account Name:</strong> {application.user.name}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-lg mt-4">Assistance Details</h4>
                                <p><strong>Program:</strong> {application.program}</p>
                                <p><strong>Date of Incident:</strong> {application.date_of_incident || 'N/A'}</p>
                            </div>

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
                                <div className="mt-4 flex items-center space-x-4">
                                    <button
                                        onClick={() => handleUpdateStatus('Approved')}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-500 active:bg-green-700"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus('Rejected')}
                                        className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
