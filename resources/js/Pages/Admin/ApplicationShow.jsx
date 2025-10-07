import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react'; // <-- 1. Import 'router' from Inertia

export default function ApplicationShow({ auth, application }) {

    // 2. Use Inertia's router to send the update request
    const handleUpdateStatus = (newStatus) => {
        if (confirm(`Are you sure you want to ${newStatus.toLowerCase()} this application?`)) {
            router.patch(route('applications.status.update', { application: application.id }), {
                status: newStatus,
            }, {
                preserveScroll: true, // This stops the page from scrolling to the top after update
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth} // <-- 3. FIX: Pass 'auth' directly
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
                                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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

                    {/* This section with buttons will only show if the status is 'Pending' */}
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
