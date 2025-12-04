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

export default function Edit({ application }) {
    // FIX: Grab auth from usePage().props to avoid "undefined reading user" error
    const { auth } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        // Note: NO _method: 'put' here because route is POST
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

        // File States
        valid_id: null,
        indigency_cert: null,
        attachments: []
    });

    const [requiredDocs, setRequiredDocs] = useState([]);

    // Watch for Program Changes to update requirements
    useEffect(() => {
        if (data.program && REQUIREMENTS_MAP[data.program]) {
            setRequiredDocs(REQUIREMENTS_MAP[data.program]);
            // Only reset attachments if the program actually changed from original
            if (data.program !== application.program) {
                 setData('attachments', []);
            }
        } else {
            setRequiredDocs([]);
        }
    }, [data.program]);

    const handleFileChange = (field, file) => {
        setData(field, file);
    };

    // Handle Dynamic File Uploads
    const handleDynamicFileChange = (e, index) => {
        const newAttachments = [...data.attachments];
        newAttachments[index] = e.target.files[0];
        setData('attachments', newAttachments);
    };

    // Handle Optional Extra Attachments
    const addFileField = () => {
        setData('attachments', [...data.attachments, null]);
    };

    const removeFileField = (index) => {
        const newFiles = [...data.attachments];
        newFiles.splice(index, 1);
        setData('attachments', newFiles);
    };

    // Use regular handleAttachmentChange for the extra optional files
    const handleOptionalAttachmentChange = (e, index) => {
         // Logic needs to distinguish between "Required Dynamic" attachments and "Extra Optional" ones.
         // For simplicity in this edit form, we will just treat extra uploads as appending to the array.
         // But since we are using a specific index for required docs, let's keep them separate in UI but merged in data if needed.
         // A cleaner way for Edit is:
         // 1. Required Docs (Fixed Slots)
         // 2. Extra Docs (Dynamic Array)

         // For now, let's stick to the required docs logic since that is the priority.
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('applications.update', application.id), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Application</h2>}
        >
            <Head title="Edit Application" />
            <div className="py-12 bg-gray-100">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 md:p-8 space-y-8" encType="multipart/form-data">

                            <h2 className="text-2xl font-bold text-gray-800">EDIT APPLICATION #{application.id}</h2>

                            {/* Rejection Reason */}
                            {application.remarks && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                                    <p className="text-sm text-red-700"><strong>Return Reason:</strong> {application.remarks}</p>
                                </div>
                            )}

                            {/* --- PROGRAM SELECTION --- */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">1. Select Assistance Type</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="program" value="Type of Assistance *" />
                                        <select
                                            id="program"
                                            value={data.program}
                                            onChange={(e) => setData('program', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        >
                                            <option value="">Select Program</option>
                                            {Object.keys(REQUIREMENTS_MAP).map(key => (
                                                <option key={key} value={key}>{key}</option>
                                            ))}
                                        </select>
                                        <InputError message={errors.program} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="date_of_incident" value="Date of Incident" />
                                        <TextInput
                                            id="date_of_incident"
                                            type="date"
                                            className="mt-1 block w-full"
                                            value={data.date_of_incident}
                                            onChange={(e) => setData('date_of_incident', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* --- PERSONAL DETAILS --- */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">2. Personal Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="first_name" value="First Name *" />
                                        <TextInput
                                            id="first_name"
                                            className="mt-1 block w-full"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="last_name" value="Last Name *" />
                                        <TextInput
                                            id="last_name"
                                            className="mt-1 block w-full"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                        />
                                    </div>
                                    {/* Add other fields (Middle Name, Sex, etc.) as needed based on your previous code */}
                                </div>
                            </section>

                            {/* --- ADDRESS --- */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">3. Address</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="barangay" value="Barangay *" />
                                        <select
                                            id="barangay"
                                            value={data.barangay}
                                            onChange={(e) => setData('barangay', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        >
                                            <option value="">Select Barangay</option>
                                            <option value="Adlawan">Adlawan</option>
                                            <option value="Bago">Bago</option>
                                            <option value="Balijuagan">Balijuagan</option>
                                            <option value="Banica">Banica</option>
                                            <option value="Barra">Barra</option>
                                            {/* ... Add other barangays ... */}
                                            <option value="Poblacion I">Poblacion I</option>
                                        </select>
                                    </div>
                                    <div>
                                        <InputLabel value="City" />
                                        <TextInput value="Roxas City" disabled className="mt-1 block w-full bg-gray-100" />
                                    </div>
                                </div>
                            </section>

                            {/* --- DOCUMENTS (Dynamic) --- */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">4. Update Documents (Optional)</h3>
                                <p className="text-sm text-gray-500">Only upload files if you need to replace the existing ones.</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded">
                                    <div>
                                        <InputLabel value="Replace Valid ID" />
                                        <input type="file" onChange={(e) => setData('valid_id', e.target.files[0])} className="mt-1 block w-full text-sm" />
                                    </div>
                                    <div>
                                        <InputLabel value="Replace Social Case Summary" />
                                        <input type="file" onChange={(e) => setData('indigency_cert', e.target.files[0])} className="mt-1 block w-full text-sm" />
                                    </div>

                                    {/* Dynamic Requirements */}
                                    {requiredDocs.map((docName, index) => (
                                        <div key={index}>
                                            <InputLabel value={`Replace ${docName}`} />
                                            <input type="file" onChange={(e) => handleDynamicFileChange(e, index)} className="mt-1 block w-full text-sm" />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="flex items-center justify-center mt-8">
                                <PrimaryButton className="w-full justify-center py-3" disabled={processing}>
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
