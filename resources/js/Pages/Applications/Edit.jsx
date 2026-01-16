import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// --- CONFIGURATION: Requirements per Program ---
const REQUIREMENTS_MAP = {
    'Hospitalization': [ 'Personal Letter to Mayor', 'Final Hospital Bill', 'Medical Abstract / Medical Certificate', 'Promissory Note (if discharged)' ],
    'Laboratory Tests': [ 'Personal Letter to Mayor', 'Laboratory Request', 'Medical Certificate' ],
    'Anti-Rabies Vaccine Treatment': [ 'Personal Letter to Mayor', 'Rabies Vaccination Card', 'Medical Certificate' ],
    'Medicine Assistance': [ 'Personal Letter to Mayor', 'Prescription (with price & doctor license)', 'Medical Certificate' ],
    'Funeral Assistance': [ 'Personal Letter to Mayor', 'Death Certificate (Certified True Copy)', 'Burial Contract' ],
    'Chemotherapy': [ 'Personal Letter to Mayor', 'Chemotherapy Protocol / Doctor\'s Order', 'Medical Certificate', 'Quotation of Medicine' ],
    'Diagnostic Blood Tests': [ 'Personal Letter to Mayor', 'Laboratory/Diagnostic Request', 'Medical Certificate' ]
};

// --- BARANGAY LIST ---
const BARANGAYS = [
    'Adlawan', 'Bago', 'Balijuagan', 'Banica', 'Barra', 'Bato', 'Baybay', 'Bolo',
    'Cabugao', 'Cagay', 'Cogon', 'Culajao', 'Culasi', 'Dayao', 'Dinginan', 'Dumolog',
    'Gabuan', 'Inzo Arnaldo Village', 'Jumaguicjic', 'Lanot', 'Lawaan', 'Libas',
    'Liongs', 'Li-ong', 'Loctugan', 'Lonoy', 'Milibili', 'Molo', 'Mongpong', 'Oloyan',
    'Punta Cogon', 'Punta Tabuc', 'Rizal', 'Saloque', 'San Jose', 'Sibaguan', 'Talon',
    'Tanque', 'Tanza', 'Tiza', 'Poblacion I', 'Poblacion II', 'Poblacion III',
    'Poblacion IV', 'Poblacion V', 'Poblacion VI', 'Poblacion VII', 'Poblacion VIII',
    'Poblacion IX', 'Poblacion X', 'Poblacion XI'
];

export default function Edit({ application }) {
    const { auth } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        program: application.program || '',
        date_of_incident: application.date_of_incident || '',
        first_name: application.first_name,
        middle_name: application.middle_name || '',
        last_name: application.last_name,
        suffix_name: application.suffix_name || '',
        sex: application.sex,
        civil_status: application.civil_status,
        birth_date: application.birth_date,
        house_no: application.house_no || '',
        barangay: application.barangay,
        city: application.city,
        contact_number: application.contact_number,
        email: application.email,
        facebook_link: application.facebook_link || '',
        valid_id: null,
        indigency_cert: null,
        attachments: []
    });

    const [requiredDocs, setRequiredDocs] = useState([]);

    useEffect(() => {
        if (data.program && REQUIREMENTS_MAP[data.program]) {
            setRequiredDocs(REQUIREMENTS_MAP[data.program]);
            // Note: Unlike create, we don't clear attachments automatically on edit to avoid accidental data loss feeling
        } else {
            setRequiredDocs([]);
        }
    }, [data.program]);

    const handleDynamicFileChange = (e, index) => {
        const newAttachments = [...data.attachments];
        newAttachments[index] = e.target.files[0];
        setData('attachments', newAttachments);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('applications.update', application.id), {
            forceFormData: true,
            onSuccess: () => {
                 // Success logic
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-semibold text-2xl text-gray-800 dark:text-white leading-tight">Edit Application</h2>}
        >
            <Head title="Edit Application" />

            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans transition-colors duration-300">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">

                    {/* --- HEADER BANNER --- */}
                    <div className="bg-blue-900 dark:bg-blue-800 rounded-t-2xl p-8 shadow-lg text-white">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-full">
                                <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight">Edit Application #{application.id}</h1>
                                <p className="text-blue-100 mt-1">Update your information and resubmit your request.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-b-2xl border border-t-0 border-gray-200 dark:border-gray-700 transition-colors">
                        <form onSubmit={submit} className="p-8 space-y-12" encType="multipart/form-data">

                            {/* Rejection Reason (If applicable) */}
                            {application.remarks && (
                                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-lg">
                                    <h3 className="text-red-800 dark:text-red-300 font-bold uppercase text-sm mb-1">Application Returned</h3>
                                    <p className="text-red-700 dark:text-red-200"><strong>Reason:</strong> {application.remarks}</p>
                                </div>
                            )}

                            {/* --- SECTION 1: ASSISTANCE TYPE --- */}
                            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                                <div className="flex items-center mb-6">
                                    <div className="flex-shrink-0 bg-blue-600 dark:bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold shadow-sm mr-3">1</div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-blue-200 uppercase tracking-wide">Assistance Selection</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <InputLabel htmlFor="program" value="Type of Assistance *" className="text-gray-700 dark:text-gray-300 font-bold" />
                                        <select
                                            id="program"
                                            value={data.program}
                                            onChange={(e) => setData('program', e.target.value)}
                                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 text-base"
                                            required
                                        >
                                            <option value="">-- Select Program --</option>
                                            {Object.keys(REQUIREMENTS_MAP).map((prog) => <option key={prog} value={prog}>{prog}</option>)}
                                        </select>
                                        <InputError message={errors.program} />
                                    </div>
                                    <div className="space-y-2">
                                        <InputLabel htmlFor="date_of_incident" value="Date of Incident / Admission *" className="text-gray-700 dark:text-gray-300 font-bold" />
                                        <TextInput
                                            id="date_of_incident"
                                            type="date"
                                            className="block w-full py-2.5 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                            value={data.date_of_incident}
                                            onChange={(e) => setData('date_of_incident', e.target.value)}
                                        />
                                        <InputError message={errors.date_of_incident} />
                                    </div>
                                </div>
                            </div>

                            {/* --- SECTION 2: PERSONAL INFO --- */}
                            <div>
                                <div className="flex items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                                    <div className="flex-shrink-0 bg-gray-700 dark:bg-gray-600 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold shadow-sm mr-3">2</div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white uppercase tracking-wide">Personal Information</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <InputLabel htmlFor="first_name" value="First Name *" className="dark:text-gray-300" />
                                        <TextInput id="first_name" className="block w-full capitalize dark:bg-gray-700 dark:text-white dark:border-gray-600" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} required />
                                        <InputError message={errors.first_name} />
                                    </div>
                                    <div className="space-y-1">
                                        <InputLabel htmlFor="middle_name" value="Middle Name (Optional)" className="dark:text-gray-300" />
                                        <TextInput id="middle_name" className="block w-full capitalize dark:bg-gray-700 dark:text-white dark:border-gray-600" value={data.middle_name} onChange={(e) => setData('middle_name', e.target.value)} />
                                    </div>
                                    <div className="space-y-1">
                                        <InputLabel htmlFor="last_name" value="Last Name *" className="dark:text-gray-300" />
                                        <TextInput id="last_name" className="block w-full capitalize dark:bg-gray-700 dark:text-white dark:border-gray-600" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} required />
                                        <InputError message={errors.last_name} />
                                    </div>
                                    <div className="space-y-1">
                                        <InputLabel htmlFor="suffix_name" value="Suffix" className="dark:text-gray-300" />
                                        <TextInput id="suffix_name" className="block w-full dark:bg-gray-700 dark:text-white dark:border-gray-600" value={data.suffix_name} onChange={(e) => setData('suffix_name', e.target.value)} />
                                    </div>
                                    <div className="space-y-1">
                                        <InputLabel htmlFor="birth_date" value="Birth Date *" className="dark:text-gray-300" />
                                        <TextInput id="birth_date" type="date" className="block w-full dark:bg-gray-700 dark:text-white dark:border-gray-600" value={data.birth_date} onChange={(e) => setData('birth_date', e.target.value)} required />
                                        <InputError message={errors.birth_date} />
                                    </div>
                                    <div className="space-y-1">
                                        <InputLabel htmlFor="sex" value="Sex *" className="dark:text-gray-300" />
                                        <select id="sex" value={data.sex} onChange={(e) => setData('sex', e.target.value)} className="block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm" required>
                                            <option value="">Select Sex</option> <option value="Male">Male</option> <option value="Female">Female</option>
                                        </select>
                                        <InputError message={errors.sex} />
                                    </div>
                                    <div className="space-y-1">
                                        <InputLabel htmlFor="civil_status" value="Civil Status *" className="dark:text-gray-300" />
                                        <select id="civil_status" value={data.civil_status} onChange={(e) => setData('civil_status', e.target.value)} className="block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm" required>
                                            <option value="">Select Status</option> <option value="Single">Single</option> <option value="Married">Married</option> <option value="Widowed">Widowed</option> <option value="Separated">Separated</option>
                                        </select>
                                        <InputError message={errors.civil_status} />
                                    </div>
                                </div>
                            </div>

                            {/* --- SECTION 3: ADDRESS --- */}
                            <div>
                                <div className="flex items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                                    <div className="flex-shrink-0 bg-gray-700 dark:bg-gray-600 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold shadow-sm mr-3">3</div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white uppercase tracking-wide">Address & Contact</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <InputLabel htmlFor="house_no" value="House No. / Street *" className="dark:text-gray-300" />
                                        <TextInput id="house_no" className="block w-full dark:bg-gray-700 dark:text-white dark:border-gray-600" value={data.house_no} onChange={(e) => setData('house_no', e.target.value)} required />
                                        <InputError message={errors.house_no} />
                                    </div>
                                    <div className="space-y-1">
                                        <InputLabel htmlFor="barangay" value="Barangay *" className="dark:text-gray-300" />
                                        <select id="barangay" value={data.barangay} onChange={(e) => setData('barangay', e.target.value)} className="block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm" required>
                                            <option value="">Select Barangay</option> {BARANGAYS.map(brgy => <option key={brgy} value={brgy}>{brgy}</option>)}
                                        </select>
                                        <InputError message={errors.barangay} />
                                    </div>
                                    <div className="space-y-1">
                                        <InputLabel htmlFor="city" value="City" className="dark:text-gray-300" />
                                        <TextInput id="city" value="Roxas City" disabled className="block w-full bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300" />
                                    </div>
                                    <div className="space-y-1">
                                        <InputLabel htmlFor="contact_number" value="Mobile Number *" className="dark:text-gray-300" />
                                        <TextInput id="contact_number" className="block w-full dark:bg-gray-700 dark:text-white dark:border-gray-600" value={data.contact_number} onChange={(e) => setData('contact_number', e.target.value)} required />
                                        <InputError message={errors.contact_number} />
                                    </div>
                                    <div className="space-y-1">
                                        <InputLabel htmlFor="email" value="Email Address *" className="dark:text-gray-300" />
                                        <TextInput id="email" type="email" className="block w-full dark:bg-gray-700 dark:text-white dark:border-gray-600" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                                    </div>
                                    <div className="space-y-1">
                                        <InputLabel htmlFor="facebook_link" value="Facebook Link (Optional)" className="dark:text-gray-300" />
                                        <TextInput id="facebook_link" className="block w-full dark:bg-gray-700 dark:text-white dark:border-gray-600" value={data.facebook_link} onChange={(e) => setData('facebook_link', e.target.value)} placeholder="https://facebook.com/..." />
                                    </div>
                                </div>
                            </div>

                            {/* --- SECTION 4: DOCUMENTS --- */}
                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="p-6 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center">
                                    <div className="flex-shrink-0 bg-red-600 dark:bg-red-500 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold shadow-sm mr-3">4</div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white uppercase tracking-wide">Update Documents (Optional)</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Only upload if replacing existing files. Max 2MB per file.</p>
                                    </div>
                                </div>
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:border-blue-300 dark:hover:border-blue-500 transition">
                                        <InputLabel htmlFor="valid_id" value="Replace Valid ID" className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300" />
                                        <input
                                            id="valid_id"
                                            type="file"
                                            onChange={(e) => setData('valid_id', e.target.files[0])}
                                            className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/50 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/70 transition cursor-pointer"
                                        />
                                        <InputError message={errors.valid_id} className="mt-2" />
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:border-blue-300 dark:hover:border-blue-500 transition">
                                        <InputLabel htmlFor="indigency_cert" value="Replace Social Case Summary" className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300" />
                                        <input
                                            id="indigency_cert"
                                            type="file"
                                            onChange={(e) => setData('indigency_cert', e.target.files[0])}
                                            className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/50 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/70 transition cursor-pointer"
                                        />
                                        <InputError message={errors.indigency_cert} className="mt-2" />
                                    </div>

                                    {/* Dynamic Docs */}
                                    {requiredDocs.length > 0 ? (
                                        requiredDocs.map((docName, index) => (
                                            <div key={index} className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:border-blue-300 dark:hover:border-blue-500 transition">
                                                <InputLabel value={`Replace ${docName}`} className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300" />
                                                <input
                                                    type="file"
                                                    onChange={(e) => handleDynamicFileChange(e, index)}
                                                    className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 dark:file:bg-gray-700 file:text-gray-700 dark:file:text-gray-300 hover:file:bg-gray-200 dark:hover:file:bg-gray-600 transition cursor-pointer"
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-1 md:col-span-2 text-center py-8 bg-gray-100 dark:bg-gray-700/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                                            <p className="text-gray-500 dark:text-gray-400 italic">Select a "Type of Assistance" above to view specific requirements.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* --- SUBMIT --- */}
                            <div className="flex items-center justify-end pt-6 border-t border-gray-100 dark:border-gray-700">
                                <Link href={route('dashboard')} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium mr-6 transition-colors">Cancel</Link>
                                <PrimaryButton className="px-8 py-4 bg-blue-800 hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-700 text-lg shadow-xl transition-all transform hover:-translate-y-1" disabled={processing}>
                                    RESUBMIT APPLICATION
                                </PrimaryButton>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
