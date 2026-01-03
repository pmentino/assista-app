import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

// Reuse the Requirements Map for labels if needed, or keep it simple
const REQUIREMENTS_MAP = {
    'Hospitalization': [ 'Personal Letter to Mayor', 'Final Hospital Bill', 'Medical Abstract / Certificate', 'Promissory Note' ],
    'Laboratory Tests': [ 'Personal Letter to Mayor', 'Laboratory Request', 'Medical Certificate' ],
    'Anti-Rabies Vaccine Treatment': [ 'Personal Letter to Mayor', 'Rabies Vaccination Card', 'Medical Certificate' ],
    'Medicine Assistance': [ 'Personal Letter to Mayor', 'Prescription', 'Medical Certificate' ],
    'Funeral Assistance': [ 'Personal Letter to Mayor', 'Death Certificate', 'Burial Contract' ],
    'Chemotherapy': [ 'Personal Letter to Mayor', 'Chemotherapy Protocol', 'Medical Certificate', 'Quotation of Medicine' ],
    'Diagnostic Blood Tests': [ 'Personal Letter to Mayor', 'Diagnostic Request', 'Medical Certificate' ]
};

export default function ApplicationShow({ application: initialApplication }) {
    const { auth } = usePage().props;
    const [application, setApplication] = useState(initialApplication);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        remarks: application.remarks || '',
    });

    useEffect(() => {
        setApplication(initialApplication);
        setData('remarks', initialApplication.remarks || '');
    }, [initialApplication]);

    const submitRemark = (e) => {
        e.preventDefault();
        post(route('staff.applications.remarks.store', application.id), {
            preserveScroll: true,
        });
    };

    const getAttachmentLabel = (key) => {
        const labels = { valid_id: 'Valid Government ID', indigency_cert: 'Certificate of Indigency' };
        if (labels[key]) return labels[key];
        if (!application.program) return `Attachment ${key}`;
        const programReqs = REQUIREMENTS_MAP[application.program];
        const index = parseInt(key);
        return (programReqs && programReqs[index]) ? programReqs[index] : `Supporting Document #${index + 1}`;
    };

    const statusColors = {
        'Approved': 'bg-green-100 text-green-800 border-green-200',
        'Rejected': 'bg-red-100 text-red-800 border-red-200',
        'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href={route('staff.applications.index')} className="text-gray-500 hover:text-gray-700 flex items-center pr-3 border-r border-gray-300">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                            Back
                        </Link>
                        <h2 className="font-bold text-xl text-gray-800 leading-tight">
                            #{String(application.id).padStart(5, '0')}
                        </h2>
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${statusColors[application.status] || 'bg-gray-100'}`}>
                            {application.status}
                        </span>
                    </div>
                </div>
            }
        >
            <Head title={`Application #${application.id}`} />

            <div className="py-6 md:py-10 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Card 1: Request Info */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                                    <h3 className="font-bold text-gray-800">Assistance Request</h3>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Program Type</p>
                                            <p className="text-lg font-bold text-blue-900 mt-1">{application.program}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Submitted</p>
                                            <p className="text-gray-900 mt-1">{new Date(application.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {application.status === 'Approved' && (
                                        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100 flex justify-between items-center">
                                            <div>
                                                <p className="text-xs font-bold text-green-800 uppercase">Amount Released</p>
                                                <p className="text-xl font-bold text-green-700">₱{new Intl.NumberFormat('en-PH').format(application.amount_released)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-green-800 uppercase">Date Approved</p>
                                                <p className="text-green-900 font-medium">
                                                    {application.approved_date ? new Date(application.approved_date).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {application.status === 'Rejected' && application.remarks && (
                                        <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100">
                                            <p className="text-xs font-bold text-red-800 uppercase mb-1">Reason for Rejection</p>
                                            <p className="text-red-900">{application.remarks}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Card 2: Documents */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                                    <h3 className="font-bold text-gray-800">Submitted Documents</h3>
                                </div>
                                <div className="p-6 grid grid-cols-1 gap-4">
                                    {application.attachments && Object.entries(application.attachments).map(([key, path]) => {
                                        if (typeof path !== 'string') return null;
                                        return (
                                            <a
                                                key={key}
                                                href={`/storage/${path}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition group"
                                            >
                                                <div className="bg-blue-100 p-2 rounded-md text-blue-600 mr-3 shrink-0">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-bold text-gray-800 group-hover:text-blue-800 truncate">
                                                        {getAttachmentLabel(key)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">Click to view</p>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-6">
                            {/* Applicant Profile */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                                    <h3 className="font-bold text-gray-800">Applicant Profile</h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                                        <p className="text-gray-900 font-medium">{application.user?.name || 'N/A'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Birth Date</label>
                                            <p className="text-gray-900">{new Date(application.birth_date).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Sex</label>
                                            <p className="text-gray-900">{application.sex}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Civil Status</label>
                                        <p className="text-gray-900">{application.civil_status}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                                    <h3 className="font-bold text-gray-800">Contact Details</h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
                                        <p className="text-gray-900">{application.house_no} {application.barangay}, {application.city}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                                        <p className="text-gray-900 font-mono">{application.contact_number}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                                        <p className="text-gray-900 break-all">{application.email}</p>
                                    </div>
                                    {application.facebook_link && (
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Facebook Profile</label>
                                            <a
                                                href={application.facebook_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block mt-1 text-blue-600 hover:underline break-all font-medium"
                                            >
                                                {application.facebook_link}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Staff Actions */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                                    <h3 className="font-bold text-blue-800">Staff Verification</h3>
                                </div>
                                <div className="p-6">
                                    <p className="text-sm text-gray-500 mb-4">
                                        Review the application and add notes for the admin.
                                    </p>
                                    <form onSubmit={submitRemark}>
                                        <label htmlFor="remarks" className="block text-sm font-bold text-gray-700 mb-2">Remarks / Notes</label>
                                        <textarea
                                            id="remarks"
                                            value={data.remarks}
                                            onChange={(e) => setData('remarks', e.target.value)}
                                            className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
                                            rows="4"
                                            placeholder="e.g., Documents verified. Ready for approval."
                                        ></textarea>
                                        <InputError message={errors.remarks} className="mt-2" />
                                        <div className="flex items-center justify-between mt-4">
                                            {recentlySuccessful && <span className="text-sm text-green-600 font-bold">Saved!</span>}
                                            <PrimaryButton disabled={processing}>Save Remark</PrimaryButton>
                                        </div>
                                    </form>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
