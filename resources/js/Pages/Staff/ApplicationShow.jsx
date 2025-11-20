import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

export default function ApplicationShow({ application: initialApplication }) {
    // 1. Get auth safely
    const { auth } = usePage().props;
    const [application, setApplication] = useState(initialApplication);

    // 2. Setup form for remarks
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        remarks: application.remarks || '',
    });

    useEffect(() => {
        setApplication(initialApplication);
        setData('remarks', initialApplication.remarks || '');
    }, [initialApplication]);

    const submitRemark = (e) => {
        e.preventDefault();
        // Post to the STAFF specific route for remarks (or shared route if configured)
        // We reused the same controller method, so the route name is shared or specific.
        // In our web.php, we defined: route('staff.applications.remarks.store') ??
        // Let's double check web.php. We defined: name('applications.remarks.store') inside the staff group.
        // So the full name is 'staff.applications.remarks.store'.
        post(route('staff.applications.remarks.store', application.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Application Details</h2>}
        >
            <Head title={`Application #${application.id}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Application Details Card (Read-Only) */}
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
                                <Link href={route('staff.applications.index')} className="text-blue-600 hover:underline">
                                    &larr; Back to list
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Staff Actions Card */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium text-gray-900">Staff Actions</h3>

                            {/* NO Approve/Reject Buttons Here - Staff only verifies */}
                            <p className="text-sm text-gray-500 mb-4">
                                As staff, you can review the application and add remarks for the admin or applicant. You cannot change the final status.
                            </p>

                            {/* Remarks Form */}
                            <form onSubmit={submitRemark} className="mt-6 border-t pt-6">
                                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">Add Verification Note / Remark</label>
                                <textarea
                                    id="remarks"
                                    value={data.remarks}
                                    onChange={(e) => setData('remarks', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    rows="4"
                                    placeholder="e.g., Documents verified. Ready for approval."
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
