import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// --- CONFIGURATION: Requirements per Program ---
const REQUIREMENTS_MAP = {
    'Hospitalization': [
        'Personal Letter to Mayor',
        'Final Hospital Bill',
        'Medical Abstract / Medical Certificate',
        'Promissory Note (if discharged)'
    ],
    'Laboratory Tests': [
        'Personal Letter to Mayor',
        'Laboratory Request',
        'Medical Certificate'
    ],
    'Anti-Rabies Vaccine Treatment': [
        'Personal Letter to Mayor',
        'Rabies Vaccination Card',
        'Medical Certificate'
    ],
    'Medicine Assistance': [
        'Personal Letter to Mayor',
        'Prescription (with price & doctor license)',
        'Medical Certificate'
    ],
    'Funeral Assistance': [
        'Personal Letter to Mayor',
        'Death Certificate (Certified True Copy)',
        'Burial Contract'
    ],
    'Chemotherapy': [
        'Personal Letter to Mayor',
        'Chemotherapy Protocol / Doctor\'s Order',
        'Medical Certificate',
        'Quotation of Medicine'
    ],
    'Diagnostic Blood Tests': [
        'Personal Letter to Mayor',
        'Laboratory/Diagnostic Request',
        'Medical Certificate'
    ]
};

export default function Create() {
    // 1. Get auth from global props safely
    const { auth } = usePage().props;

    // 2. Initialize Form with SAFE default values
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
        // FIX: Safety check here prevents the crash!
        email: auth?.user?.email || '',
        facebook_link: '',

        // File States
        valid_id: null,
        indigency_cert: null,
        attachments: []
    });

    const [requiredDocs, setRequiredDocs] = useState([]);

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
        post(route('applications.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth?.user} // Pass user safely to layout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Apply for Assistance</h2>}
        >
            <Head title="Apply" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 md:p-8 space-y-8" encType="multipart/form-data">

                            <div className="border-b pb-4">
                                <h2 className="text-2xl font-bold text-blue-900">APPLICATION FORM</h2>
                                <p className="text-gray-500 text-sm">Please fill out the form accurately.</p>
                            </div>

                            {/* --- PROGRAM SELECTION --- */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-l-4 border-blue-500 pl-3">1. Select Assistance Type</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="program" value="Type of Assistance *" />
                                        <select
                                            id="program"
                                            name="program"
                                            value={data.program}
                                            onChange={(e) => setData('program', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                            required
                                        >
                                            <option value="">-- Select Program --</option>
                                            <option value="Hospitalization">Hospitalization</option>
                                            <option value="Laboratory Tests">Laboratory Tests</option>
                                            <option value="Anti-Rabies Vaccine Treatment">Anti-Rabies Vaccine Treatment</option>
                                            <option value="Medicine Assistance">Medicine Assistance</option>
                                            <option value="Funeral Assistance">Funeral Assistance</option>
                                            <option value="Chemotherapy">Chemotherapy</option>
                                            <option value="Diagnostic Blood Tests">Diagnostic Blood Tests</option>
                                        </select>
                                        <InputError message={errors.program} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="date_of_incident" value="Date of Incident / Admission" />
                                        <TextInput
                                            id="date_of_incident"
                                            type="date"
                                            className="mt-1 block w-full"
                                            value={data.date_of_incident}
                                            onChange={(e) => setData('date_of_incident', e.target.value)}
                                        />
                                        <InputError message={errors.date_of_incident} className="mt-2" />
                                    </div>
                                </div>
                            </section>

                            {/* --- PERSONAL INFORMATION --- */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-l-4 border-blue-500 pl-3">2. Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="first_name" value="First Name *" />
                                        <TextInput
                                            id="first_name"
                                            className="mt-1 block w-full"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.first_name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="last_name" value="Last Name *" />
                                        <TextInput
                                            id="last_name"
                                            className="mt-1 block w-full"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.last_name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="middle_name" value="Middle Name (Optional)" />
                                        <TextInput
                                            id="middle_name"
                                            className="mt-1 block w-full"
                                            value={data.middle_name}
                                            onChange={(e) => setData('middle_name', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="birth_date" value="Birth Date *" />
                                        <TextInput
                                            id="birth_date"
                                            type="date"
                                            className="mt-1 block w-full"
                                            value={data.birth_date}
                                            onChange={(e) => setData('birth_date', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.birth_date} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="sex" value="Sex *" />
                                        <select
                                            id="sex"
                                            value={data.sex}
                                            onChange={(e) => setData('sex', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            required
                                        >
                                            <option value="">Select Sex</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                        <InputError message={errors.sex} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="civil_status" value="Civil Status *" />
                                        <select
                                            id="civil_status"
                                            value={data.civil_status}
                                            onChange={(e) => setData('civil_status', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            required
                                        >
                                            <option value="">Select Status</option>
                                            <option value="Single">Single</option>
                                            <option value="Married">Married</option>
                                            <option value="Widowed">Widowed</option>
                                            <option value="Separated">Separated</option>
                                        </select>
                                        <InputError message={errors.civil_status} className="mt-2" />
                                    </div>
                                </div>
                            </section>

                            {/* --- ADDRESS --- */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-l-4 border-blue-500 pl-3">3. Address</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="barangay" value="Barangay (Roxas City) *" />
                                        <select
                                            id="barangay"
                                            value={data.barangay}
                                            onChange={(e) => setData('barangay', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            required
                                        >
                                            <option value="">Select Barangay</option>
                                            {/* List of Barangays in Roxas City */}
                                            <option value="Adlawan">Adlawan</option>
                                            <option value="Bago">Bago</option>
                                            <option value="Balijuagan">Balijuagan</option>
                                            <option value="Banica">Banica</option>
                                            <option value="Barra">Barra</option>
                                            <option value="Bato">Bato</option>
                                            <option value="Baybay">Baybay</option>
                                            <option value="Bolo">Bolo</option>
                                            <option value="Cabugao">Cabugao</option>
                                            <option value="Cagay">Cagay</option>
                                            <option value="Cogon">Cogon</option>
                                            <option value="Culajao">Culajao</option>
                                            <option value="Culasi">Culasi</option>
                                            <option value="Dayao">Dayao</option>
                                            <option value="Dinginan">Dinginan</option>
                                            <option value="Dumolog">Dumolog</option>
                                            <option value="Gabuan">Gabuan</option>
                                            <option value="Inzo Arnaldo Village">Inzo Arnaldo Village</option>
                                            <option value="Jumaguicjic">Jumaguicjic</option>
                                            <option value="Lanot">Lanot</option>
                                            <option value="Lawaan">Lawaan</option>
                                            <option value="Libas">Libas</option>
                                            <option value="Liongs">Liongs</option>
                                            <option value="Li-ong">Li-ong</option>
                                            <option value="Loctugan">Loctugan</option>
                                            <option value="Lonoy">Lonoy</option>
                                            <option value="Milibili">Milibili</option>
                                            <option value="Molo">Molo</option>
                                            <option value="Mongpong">Mongpong</option>
                                            <option value="Oloyan">Oloyan</option>
                                            <option value="Punta Cogon">Punta Cogon</option>
                                            <option value="Punta Tabuc">Punta Tabuc</option>
                                            <option value="Rizal">Rizal</option>
                                            <option value="Saloque">Saloque</option>
                                            <option value="San Jose">San Jose</option>
                                            <option value="Sibaguan">Sibaguan</option>
                                            <option value="Talon">Talon</option>
                                            <option value="Tanque">Tanque</option>
                                            <option value="Tanza">Tanza</option>
                                            <option value="Tiza">Tiza</option>
                                            <option value="Poblacion I">Poblacion I</option>
                                            <option value="Poblacion II">Poblacion II</option>
                                            <option value="Poblacion III">Poblacion III</option>
                                            <option value="Poblacion IV">Poblacion IV</option>
                                            <option value="Poblacion V">Poblacion V</option>
                                            <option value="Poblacion VI">Poblacion VI</option>
                                            <option value="Poblacion VII">Poblacion VII</option>
                                            <option value="Poblacion VIII">Poblacion VIII</option>
                                            <option value="Poblacion IX">Poblacion IX</option>
                                            <option value="Poblacion X">Poblacion X</option>
                                            <option value="Poblacion XI">Poblacion XI</option>
                                        </select>
                                        <InputError message={errors.barangay} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="city" value="City" />
                                        <TextInput id="city" value="Roxas City" disabled className="mt-1 block w-full bg-gray-100" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <div>
                                        <InputLabel htmlFor="contact_number" value="Mobile Number *" />
                                        <TextInput
                                            id="contact_number"
                                            value={data.contact_number}
                                            onChange={(e) => setData('contact_number', e.target.value)}
                                            required
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors.contact_number} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="email" value="Email Address *" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                            className="mt-1 block w-full"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* --- DYNAMIC REQUIREMENTS SECTION --- */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-l-4 border-blue-500 pl-3">4. Required Documents</h3>
                                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                                    Please upload clear copies of the following documents. Allowed formats: JPG, PNG, PDF.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg border border-gray-200">

                                    {/* 1. Valid ID (Always Required) */}
                                    <div>
                                        <InputLabel htmlFor="valid_id" value="Valid ID (with signature) *" />
                                        <input
                                            id="valid_id"
                                            type="file"
                                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                            onChange={(e) => setData('valid_id', e.target.files[0])}
                                            required
                                        />
                                        <InputError message={errors.valid_id} className="mt-2" />
                                    </div>

                                    {/* 2. Social Case Summary (Mapped to indigency_cert) */}
                                    <div>
                                        <InputLabel htmlFor="indigency_cert" value="Social Case Summary / Indigency *" />
                                        <input
                                            id="indigency_cert"
                                            type="file"
                                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                            onChange={(e) => setData('indigency_cert', e.target.files[0])}
                                            required
                                        />
                                        <InputError message={errors.indigency_cert} className="mt-2" />
                                    </div>

                                    {/* 3. DYNAMIC REQUIREMENTS (Based on Selection) */}
                                    {requiredDocs.length > 0 ? (
                                        requiredDocs.map((docName, index) => (
                                            <div key={index}>
                                                <InputLabel value={`${docName} *`} />
                                                <input
                                                    type="file"
                                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-white hover:file:bg-gray-700"
                                                    onChange={(e) => handleDynamicFileChange(e, index)}
                                                    required
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-2 text-center text-gray-500 italic py-4">
                                            Select a "Type of Assistance" above to see the required documents.
                                        </div>
                                    )}

                                </div>
                            </section>

                            <div className="flex items-center justify-end mt-4">
                                <PrimaryButton className="ml-4 py-3 px-6 text-lg" disabled={processing}>
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
