import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// --- BARANGAY LIST (Static is fine for locations) ---
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

export default function Create({ auth, programs = [] }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        program: '',
        date_of_incident: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix_name: '',
        sex: '',
        civil_status: '',
        birth_date: '',
        house_no: '',
        barangay: '',
        city: 'Roxas City',
        contact_number: '',
        email: auth?.user?.email || '',
        facebook_link: '',
        valid_id: null,
        indigency_cert: null,
        attachments: []
    });

    const [requiredDocs, setRequiredDocs] = useState([]);
    const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

    // --- Dynamic Requirement Logic ---
    useEffect(() => {
        const selectedProgram = programs.find(p => p.title === data.program);

        if (selectedProgram && selectedProgram.requirements) {
            setRequiredDocs(selectedProgram.requirements);
            setData('attachments', []);
        } else {
            setRequiredDocs([]);
        }
    }, [data.program]);

    const handleDynamicFileChange = (e, index) => {
        const newAttachments = [...data.attachments];
        newAttachments[index] = e.target.files[0];
        setData('attachments', newAttachments);
    };

    const handleNameChange = (field, value) => {
        const regex = /^[a-zA-Z\s]*$/;
        if (regex.test(value)) {
            setData(field, value);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        if (!agreedToPrivacy) {
            alert("Please agree to the Data Privacy Consent before submitting.");
            return;
        }

        post(route('applications.store'), {
            forceFormData: true,
            onSuccess: () => {
                console.log("Application submitted successfully.");
            },
            onError: (err) => {
                console.error("Submission Errors:", err);
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-semibold text-2xl text-gray-800 dark:text-white leading-tight">New Application</h2>}
        >
            <Head title="Apply for Assistance" />

            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans transition-colors duration-300">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    {/* --- HEADER BANNER --- */}
                    <div className="bg-blue-900 dark:bg-blue-800 rounded-t-2xl p-8 shadow-lg text-white">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-full">
                                <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight">AICS Application Form</h1>
                                <p className="text-blue-100 mt-1">Please fill out the details accurately to avoid delays in processing.</p>
                                {errors.error && (
                                    <div className="mt-4 p-3 bg-red-600/20 border border-red-500 rounded-lg">
                                        <p className="text-sm text-white font-bold text-center">
                                            {errors.error}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-b-2xl border border-t-0 border-gray-200 dark:border-gray-700 transition-colors">
                        <form onSubmit={submit} className="p-8 space-y-12" encType="multipart/form-data">

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
                                            {programs && programs.length > 0 ? (
                                                programs.map((prog) => (
                                                    <option key={prog.id} value={prog.title}>{prog.title}</option>
                                                ))
                                            ) : (
                                                <option disabled>No programs available</option>
                                            )}
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
                                        <TextInput id="first_name" className="block w-full capitalize dark:bg-gray-700 dark:text-white dark:border-gray-600" value={data.first_name} onChange={(e) => handleNameChange('first_name', e.target.value)} required placeholder="e.g. Juan" />
                                        <InputError message={errors.first_name} />
                                    </div>
                                    <div className="space-y-1">
                                        <InputLabel htmlFor="middle_name" value="Middle Name (Optional)" className="dark:text-gray-300" />
                                        <TextInput id="middle_name" className="block w-full capitalize dark:bg-gray-700 dark:text-white dark:border-gray-600" value={data.middle_name} onChange={(e) => handleNameChange('middle_name', e.target.value)} placeholder="e.g. Dela" />
                                    </div>
                                    <div className="space-y-1">
                                        <InputLabel htmlFor="last_name" value="Last Name *" className="dark:text-gray-300" />
                                        <TextInput id="last_name" className="block w-full capitalize dark:bg-gray-700 dark:text-white dark:border-gray-600" value={data.last_name} onChange={(e) => handleNameChange('last_name', e.target.value)} required placeholder="e.g. Cruz" />
                                        <InputError message={errors.last_name} />
                                    </div>
                                    <div className="space-y-1">
                                        <InputLabel htmlFor="suffix_name" value="Suffix" className="dark:text-gray-300" />
                                        <TextInput id="suffix_name" className="block w-full dark:bg-gray-700 dark:text-white dark:border-gray-600" value={data.suffix_name} onChange={(e) => setData('suffix_name', e.target.value)} placeholder="e.g. Jr., III" />
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
                                        <TextInput
                                            id="contact_number"
                                            className="block w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                            value={data.contact_number}
                                            placeholder="09123456789"
                                            maxLength={11}
                                            onChange={(e) => setData('contact_number', e.target.value.replace(/\D/g, '').slice(0, 11))}
                                            required
                                        />
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
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white uppercase tracking-wide">Required Documents</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Allowed formats: JPG, PNG, PDF. Max size: 2MB per file.</p>
                                    </div>
                                </div>
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Standard Docs */}
                                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:border-blue-300 dark:hover:border-blue-500 transition">
                                        <InputLabel htmlFor="valid_id" value="Valid ID (with signature) *" className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300" />
                                        <input
                                            id="valid_id"
                                            type="file"
                                            onChange={(e) => setData('valid_id', e.target.files[0])}
                                            required
                                            className="block w-full text-sm text-gray-500 dark:text-gray-400
                                            file:mr-4 file:py-2.5 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-blue-50 dark:file:bg-blue-900/50
                                            file:text-blue-700 dark:file:text-blue-300
                                            hover:file:bg-blue-100 dark:hover:file:bg-blue-900/70
                                            transition cursor-pointer"
                                        />
                                        <InputError message={errors.valid_id} className="mt-2" />
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:border-blue-300 dark:hover:border-blue-500 transition">
                                        <InputLabel htmlFor="indigency_cert" value="Social Case Summary / Indigency *" className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300" />
                                        <input
                                            id="indigency_cert"
                                            type="file"
                                            onChange={(e) => setData('indigency_cert', e.target.files[0])}
                                            required
                                            className="block w-full text-sm text-gray-500 dark:text-gray-400
                                            file:mr-4 file:py-2.5 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-blue-50 dark:file:bg-blue-900/50
                                            file:text-blue-700 dark:file:text-blue-300
                                            hover:file:bg-blue-100 dark:hover:file:bg-blue-900/70
                                            transition cursor-pointer"
                                        />
                                        <InputError message={errors.indigency_cert} className="mt-2" />
                                    </div>

                                    {/* Dynamic Docs */}
                                    {requiredDocs.length > 0 ? (
                                        requiredDocs.map((docName, index) => (
                                            <div key={index} className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:border-blue-300 dark:hover:border-blue-500 transition">
                                                <InputLabel value={`${docName} *`} className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300" />
                                                <input
                                                    type="file"
                                                    onChange={(e) => handleDynamicFileChange(e, index)}
                                                    required
                                                    className="block w-full text-sm text-gray-500 dark:text-gray-400
                                                    file:mr-4 file:py-2.5 file:px-4
                                                    file:rounded-full file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-gray-100 dark:file:bg-gray-700
                                                    file:text-gray-700 dark:file:text-gray-300
                                                    hover:file:bg-gray-200 dark:hover:file:bg-gray-600
                                                    transition cursor-pointer"
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

                            {/* --- DATA PRIVACY CONSENT --- */}
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-lg p-6">
                                <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-400 uppercase mb-2">Data Privacy & Consent</h4>
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="privacy_agreement"
                                            name="privacy_agreement"
                                            type="checkbox"
                                            checked={agreedToPrivacy}
                                            onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded cursor-pointer"
                                            required
                                        />
                                    </div>
                                    <div className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                                        <label htmlFor="privacy_agreement" className="font-medium">
                                            I attest that the information provided is true and correct.
                                        </label>
                                        <p className="mt-1">
                                            I consent to the collection and processing of my personal data in accordance with the <strong>Data Privacy Act of 2012</strong> for the purpose of the AICS program application.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* --- SUBMIT --- */}
                            <div className="flex items-center justify-end pt-6 border-t border-gray-100 dark:border-gray-700">
                                <Link href={route('dashboard')} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium mr-6 transition-colors">Cancel</Link>
                                <PrimaryButton className={`px-8 py-4 text-lg shadow-xl transition-all transform hover:-translate-y-1 ${!agreedToPrivacy ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-800 hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-700'}`} disabled={processing || !agreedToPrivacy}>
                                    SUBMIT APPLICATION
                                </PrimaryButton>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
