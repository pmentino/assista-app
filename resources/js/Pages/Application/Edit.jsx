import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Edit({ application }) {
    const { auth } = usePage().props;

    // Initialize form with existing application data
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put', // Spoof PUT method for Laravel update, though we use POST to send
        program: application.program,
        date_of_incident: application.date_of_incident,
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
        // Files are initially null because we don't re-upload them unless changed
        valid_id: null,
        indigency_cert: null,
        attachments: [],
    });

    const handleFileChange = (field, file) => {
        setData(field, file);
    };

    const handleAttachmentChange = (e, index) => {
        const newFiles = [...data.attachments];
        newFiles[index] = e.target.files[0];
        setData('attachments', newFiles);
    };

    const addFileField = () => {
        setData('attachments', [...data.attachments, null]);
    };

    const removeFileField = (index) => {
        const newFiles = [...data.attachments];
        newFiles.splice(index, 1);
        setData('attachments', newFiles);
    };

    const submit = (e) => {
        e.preventDefault();
        // We post to the update route.
        // Note: Inertia/Laravel file uploads often work best with POST and _method: put or just POST.
        // Our route is defined as POST /applications/{id}/update to handle files cleanly.
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

                            {/* Display Admin Remarks if available */}
                            {application.remarks && (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <p className="text-sm text-yellow-700">
                                                <strong>Admin Remark:</strong> {application.remarks}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Program Details Section */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">PROGRAM</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="program" value="Program *" />
                                        <select id="program" name="program" value={data.program} onChange={(e) => setData('program', e.target.value)} className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm">
                                            <option value="">Choose your option</option>
                                            <option value="AICS - Medical">AICS - Medical Assistance</option>
                                            <option value="AICS - Burial">AICS - Burial Assistance</option>
                                            <option value="AICS - Food">AICS - Food Assistance</option>
                                        </select>
                                        <InputError message={errors.program} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="date_of_incident" value="Date of Incident" />
                                        <TextInput id="date_of_incident" type="date" name="date_of_incident" value={data.date_of_incident} onChange={(e) => setData('date_of_incident', e.target.value)} className="mt-1 block w-full" />
                                        <InputError message={errors.date_of_incident} className="mt-2" />
                                    </div>
                                </div>
                            </section>

                            {/* Personal Details Section */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">PERSONAL DETAILS</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="first_name" value="First Name *" />
                                        <TextInput id="first_name" name="first_name" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} className="mt-1 block w-full" />
                                        <InputError message={errors.first_name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="middle_name" value="Middle Name (optional)" />
                                        <TextInput id="middle_name" name="middle_name" value={data.middle_name} onChange={(e) => setData('middle_name', e.target.value)} className="mt-1 block w-full" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="last_name" value="Last Name *" />
                                        <TextInput id="last_name" name="last_name" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} className="mt-1 block w-full" />
                                        <InputError message={errors.last_name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="suffix_name" value="Suffix Name (optional)" />
                                        <TextInput id="suffix_name" name="suffix_name" value={data.suffix_name} onChange={(e) => setData('suffix_name', e.target.value)} className="mt-1 block w-full" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="sex" value="Sex *" />
                                        <select id="sex" name="sex" value={data.sex} onChange={(e) => setData('sex', e.target.value)} className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm">
                                            <option value="">Choose your option</option>
                                            <option>Male</option>
                                            <option>Female</option>
                                        </select>
                                        <InputError message={errors.sex} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="civil_status" value="Civil Status *" />
                                        <select id="civil_status" name="civil_status" value={data.civil_status} onChange={(e) => setData('civil_status', e.target.value)} className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm">
                                            <option value="">Choose your option</option>
                                            <option>Single</option>
                                            <option>Married</option>
                                            <option>Widowed</option>
                                            <option>Separated</option>
                                        </select>
                                        <InputError message={errors.civil_status} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="birth_date" value="Birth Date *" />
                                        <TextInput id="birth_date" type="date" name="birth_date" value={data.birth_date} onChange={(e) => setData('birth_date', e.target.value)} className="mt-1 block w-full" />
                                        <InputError message={errors.birth_date} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="house_no" value="House No. (optional)" />
                                        <TextInput id="house_no" name="house_no" value={data.house_no} onChange={(e) => setData('house_no', e.target.value)} className="mt-1 block w-full" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="barangay" value="Barangay *" />
                                        <select id="barangay" name="barangay" value={data.barangay} onChange={(e) => setData('barangay', e.target.value)} className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm">
                                            <option value="">Choose your Barangay</option>
                                            <option>Poblacion</option>
                                            <option>Tigayon</option>
                                            <option>Mobo</option>
                                        </select>
                                        <InputError message={errors.barangay} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="city" value="City *" />
                                        <TextInput id="city" name="city" value={data.city} readOnly className="mt-1 block w-full bg-gray-100" />
                                        <InputError message={errors.city} className="mt-2" />
                                    </div>
                                </div>
                            </section>

                            {/* Contact Information Section */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">CONTACT INFORMATION</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="contact_number" value="Mobile Number *" />
                                        <TextInput id="contact_number" name="contact_number" value={data.contact_number} onChange={(e) => setData('contact_number', e.target.value)} className="mt-1 block w-full" />
                                        <InputError message={errors.contact_number} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="email" value="Email Address *" />
                                        <TextInput id="email" type="email" name="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="mt-1 block w-full" />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>
                                </div>
                            </section>

                             {/* --- REQUIRED DOCUMENTS SECTION (With "Update" Logic) --- */}
                             <section className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">REQUIRED DOCUMENTS</h3>
                                <p className="text-sm text-gray-600">Upload new files only if you want to replace the existing ones.</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Valid ID Upload */}
                                    <div>
                                        <InputLabel htmlFor="valid_id" value="Valid ID" />
                                        <input
                                            id="valid_id"
                                            type="file"
                                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            onChange={(e) => handleFileChange('valid_id', e.target.files[0])}
                                            accept=".jpg,.jpeg,.png,.pdf"
                                        />
                                        <InputError message={errors.valid_id} className="mt-2" />
                                    </div>

                                    {/* Certificate of Indigency Upload */}
                                    <div>
                                        <InputLabel htmlFor="indigency_cert" value="Certificate of Indigency" />
                                        <input
                                            id="indigency_cert"
                                            type="file"
                                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            onChange={(e) => handleFileChange('indigency_cert', e.target.files[0])}
                                            accept=".jpg,.jpeg,.png,.pdf"
                                        />
                                        <InputError message={errors.indigency_cert} className="mt-2" />
                                    </div>
                                </div>
                            </section>

                            {/* --- OPTIONAL ATTACHMENTS SECTION --- */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">ADDITIONAL ATTACHMENTS (Optional)</h3>
                                {data.attachments.map((file, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <input type="file" onChange={(e) => handleAttachmentChange(e, index)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                                        {/* ... remove button logic ... */}
                                    </div>
                                ))}
                                <div className="relative group inline-block">
                                    <button type="button" onClick={addFileField} className="bg-blue-500 text-white py-1 px-3 rounded-md">+</button>
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        Add Another File
                                    </span>
                                </div>
                            </section>

                            <div className="flex items-center justify-center mt-8">
                                <PrimaryButton className="w-full justify-center !py-3 !text-base" disabled={processing}>
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
