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

export default function Create() {
    const { auth } = usePage().props;

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
    const [agreedToPrivacy, setAgreedToPrivacy] = useState(false); // <--- NEW STATE

    useEffect(() => {
        if (data.program && REQUIREMENTS_MAP[data.program]) {
            setRequiredDocs(REQUIREMENTS_MAP[data.program]);
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

    const submit = (e) => {
        e.preventDefault();

        if (!agreedToPrivacy) {
            alert("Please agree to the Data Privacy Consent before submitting.");
            return;
        }

        post(route('applications.store'), {
            forceFormData: true,
            onSuccess: () => {
                window.location.href = route('dashboard');
            },
            onError: (err) => {
                console.error("Submission Errors:", err);
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-semibold text-2xl text-gray-800 leading-tight">New Application</h2>}
        >
            <Head title="Apply for Assistance" />

            <div className="py-12 bg-gray-50 min-h-screen font-sans">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">

                    {/* --- HEADER BANNER --- */}
                    <div className="bg-blue-900 rounded-t-2xl p-8 shadow-lg text-white">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-full">
                                <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight">AICS Application Form</h1>
                                <p className="text-blue-100 mt-1">Please fill out the details accurately to avoid delays in processing.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-xl rounded-b-2xl border border-t-0 border-gray-200">
                        <form onSubmit={submit} className="p-8 space-y-12" encType="multipart/form-data">

                            {/* ... (SECTIONS 1, 2, 3, 4 ARE IDENTICAL TO BEFORE - HIDDEN FOR BREVITY) ... */}
                            {/* NOTE: Keep your existing sections 1-4 here exactly as they were. I am adding the consent block below Section 4. */}

                            {/* RE-INSERTING SECTIONS 1-4 FOR CLARITY SO YOU CAN COPY PASTE FULL FILE */}
                            {/* --- SECTION 1: ASSISTANCE TYPE --- */}
                            <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                                <div className="flex items-center mb-6">
                                    <div className="flex-shrink-0 bg-blue-600 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold shadow-sm mr-3">1</div>
                                    <h3 className="text-xl font-bold text-gray-800 uppercase tracking-wide">Assistance Selection</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <InputLabel htmlFor="program" value="Type of Assistance *" className="text-gray-700 font-bold" />
                                        <select id="program" value={data.program} onChange={(e) => setData('program', e.target.value)} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 text-base" required>
                                            <option value="">-- Select Program --</option>
                                            {Object.keys(REQUIREMENTS_MAP).map((prog) => <option key={prog} value={prog}>{prog}</option>)}
                                        </select>
                                        <InputError message={errors.program} />
                                    </div>
                                    <div className="space-y-2">
                                        <InputLabel htmlFor="date_of_incident" value="Date of Incident / Admission *" className="text-gray-700 font-bold" />
                                        <TextInput id="date_of_incident" type="date" className="block w-full py-2.5" value={data.date_of_incident} onChange={(e) => setData('date_of_incident', e.target.value)} />
                                        <InputError message={errors.date_of_incident} />
                                    </div>
                                </div>
                            </div>

                            {/* --- SECTION 2: PERSONAL INFO --- */}
                            <div>
                                <div className="flex items-center mb-6 border-b pb-4">
                                    <div className="flex-shrink-0 bg-gray-700 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold shadow-sm mr-3">2</div>
                                    <h3 className="text-xl font-bold text-gray-800 uppercase tracking-wide">Personal Information</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-1"> <InputLabel htmlFor="first_name" value="First Name *" /> <TextInput id="first_name" className="block w-full" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} required /> <InputError message={errors.first_name} /> </div>
                                    <div className="space-y-1"> <InputLabel htmlFor="middle_name" value="Middle Name (Optional)" /> <TextInput id="middle_name" className="block w-full" value={data.middle_name} onChange={(e) => setData('middle_name', e.target.value)} /> </div>
                                    <div className="space-y-1"> <InputLabel htmlFor="last_name" value="Last Name *" /> <TextInput id="last_name" className="block w-full" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} required /> <InputError message={errors.last_name} /> </div>
                                    <div className="space-y-1"> <InputLabel htmlFor="suffix_name" value="Suffix" /> <TextInput id="suffix_name" className="block w-full" value={data.suffix_name} onChange={(e) => setData('suffix_name', e.target.value)} /> </div>
                                    <div className="space-y-1"> <InputLabel htmlFor="birth_date" value="Birth Date *" /> <TextInput id="birth_date" type="date" className="block w-full" value={data.birth_date} onChange={(e) => setData('birth_date', e.target.value)} required /> <InputError message={errors.birth_date} /> </div>
                                    <div className="space-y-1"> <InputLabel htmlFor="sex" value="Sex *" /> <select id="sex" value={data.sex} onChange={(e) => setData('sex', e.target.value)} className="block w-full border-gray-300 rounded-md shadow-sm" required> <option value="">Select Sex</option> <option value="Male">Male</option> <option value="Female">Female</option> </select> <InputError message={errors.sex} /> </div>
                                    <div className="space-y-1"> <InputLabel htmlFor="civil_status" value="Civil Status *" /> <select id="civil_status" value={data.civil_status} onChange={(e) => setData('civil_status', e.target.value)} className="block w-full border-gray-300 rounded-md shadow-sm" required> <option value="">Select Status</option> <option value="Single">Single</option> <option value="Married">Married</option> <option value="Widowed">Widowed</option> <option value="Separated">Separated</option> </select> <InputError message={errors.civil_status} /> </div>
                                </div>
                            </div>

                            {/* --- SECTION 3: ADDRESS --- */}
                            <div>
                                <div className="flex items-center mb-6 border-b pb-4">
                                    <div className="flex-shrink-0 bg-gray-700 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold shadow-sm mr-3">3</div>
                                    <h3 className="text-xl font-bold text-gray-800 uppercase tracking-wide">Address & Contact</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-1"> <InputLabel htmlFor="house_no" value="House No. / Street *" /> <TextInput id="house_no" className="block w-full" value={data.house_no} onChange={(e) => setData('house_no', e.target.value)} required /> <InputError message={errors.house_no} /> </div>
                                    <div className="space-y-1"> <InputLabel htmlFor="barangay" value="Barangay *" /> <select id="barangay" value={data.barangay} onChange={(e) => setData('barangay', e.target.value)} className="block w-full border-gray-300 rounded-md shadow-sm" required> <option value="">Select Barangay</option> {BARANGAYS.map(brgy => <option key={brgy} value={brgy}>{brgy}</option>)} </select> <InputError message={errors.barangay} /> </div>
                                    <div className="space-y-1"> <InputLabel htmlFor="city" value="City" /> <TextInput id="city" value="Roxas City" disabled className="block w-full bg-gray-100 text-gray-600" /> </div>
                                    <div className="space-y-1"> <InputLabel htmlFor="contact_number" value="Mobile Number *" /> <TextInput id="contact_number" className="block w-full" value={data.contact_number} onChange={(e) => setData('contact_number', e.target.value)} required /> <InputError message={errors.contact_number} /> </div>
                                    <div className="space-y-1"> <InputLabel htmlFor="email" value="Email Address *" /> <TextInput id="email" type="email" className="block w-full" value={data.email} onChange={(e) => setData('email', e.target.value)} required /> </div>
                                    <div className="space-y-1"> <InputLabel htmlFor="facebook_link" value="Facebook Link (Optional)" /> <TextInput id="facebook_link" className="block w-full" value={data.facebook_link} onChange={(e) => setData('facebook_link', e.target.value)} placeholder="https://facebook.com/..." /> </div>
                                </div>
                            </div>

                            {/* --- SECTION 4: DOCUMENTS --- */}
                            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                                <div className="p-6 bg-gray-100 border-b border-gray-200 flex items-center">
                                    <div className="flex-shrink-0 bg-red-600 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold shadow-sm mr-3">4</div>
                                    <div> <h3 className="text-xl font-bold text-gray-800 uppercase tracking-wide">Required Documents</h3> <p className="text-xs text-gray-500 mt-1">Allowed formats: JPG, PNG, PDF. Max size: 2MB per file.</p> </div>
                                </div>
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:border-blue-300 transition">
                                        <InputLabel htmlFor="valid_id" value="Valid ID (with signature) *" className="mb-2 block text-sm font-bold text-gray-700" />
                                        <input id="valid_id" type="file" onChange={(e) => setData('valid_id', e.target.files[0])} required className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition cursor-pointer" />
                                        <InputError message={errors.valid_id} className="mt-2" />
                                    </div>
                                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:border-blue-300 transition">
                                        <InputLabel htmlFor="indigency_cert" value="Social Case Summary / Indigency *" className="mb-2 block text-sm font-bold text-gray-700" />
                                        <input id="indigency_cert" type="file" onChange={(e) => setData('indigency_cert', e.target.files[0])} required className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition cursor-pointer" />
                                        <InputError message={errors.indigency_cert} className="mt-2" />
                                    </div>
                                    {requiredDocs.length > 0 ? (
                                        requiredDocs.map((docName, index) => (
                                            <div key={index} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:border-blue-300 transition">
                                                <InputLabel value={`${docName} *`} className="mb-2 block text-sm font-bold text-gray-700" />
                                                <input type="file" onChange={(e) => handleDynamicFileChange(e, index)} required className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition cursor-pointer" />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-1 md:col-span-2 text-center py-8 bg-gray-100 rounded-lg border border-dashed border-gray-300"> <p className="text-gray-500 italic">Select a "Type of Assistance" above to view specific requirements.</p> </div>
                                    )}
                                </div>
                            </div>

                            {/* --- DATA PRIVACY CONSENT (NEW) --- */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                <h4 className="text-sm font-bold text-yellow-800 uppercase mb-2">Data Privacy & Consent</h4>
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
                                    <div className="ml-3 text-sm text-gray-700">
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
                            <div className="flex items-center justify-end pt-6 border-t border-gray-100">
                                <Link href={route('dashboard')} className="text-gray-600 hover:text-gray-900 font-medium mr-6">Cancel</Link>
                                <PrimaryButton className={`px-8 py-4 text-lg shadow-xl transition-all transform hover:-translate-y-1 ${!agreedToPrivacy ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-800 hover:bg-blue-900'}`} disabled={processing || !agreedToPrivacy}>
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
