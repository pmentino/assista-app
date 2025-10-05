import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

export default function ApplicationShow({ auth, application: initialApplication }) {
    const [application, setApplication] = useState(initialApplication);

    const handleUpdateStatus = (newStatus) => {
        axios.patch(`/api/applications/${application.id}/status`, { status: newStatus })
            .then(response => {
                setApplication(response.data);
            })
            .catch(error => {
                console.error("There was an error updating the status!", error);
            });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Application #{application.id}</h2>}
        >
            <Head title={`Application #${application.id}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium text-gray-900">Applicant Information</h3>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <p><strong>Name:</strong> {application.first_name} {application.last_name}</p>
                                <p><strong>Birth Date:</strong> {application.birth_date}</p>
                                <p><strong>Address:</strong> {application.address}</p>
                                <p><strong>Contact #:</strong> {application.contact_number}</p>
                                <p><strong>Assistance Type:</strong> {application.assistance_type}</p>
                                <p><strong>Status:</strong>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        application.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                        application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {application.status}
                                    </span>
                                </p>
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
