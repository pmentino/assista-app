import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        program: '',
        date_of_incident: '',
        first_name: auth.name.split(' ')[0] || '',
        middle_name: '',
        last_name: auth.name.split(' ').slice(1).join(' ') || '',
        suffix_name: '',
        sex: '',
        civil_status: '',
        birth_date: '',
        house_no: '',
        barangay: '',
        city: 'Roxas City',
        contact_number: '',
        email: auth.email,
        attachments: [], // State to hold the files
    });

    // Function to handle file input changes
    const handleFileChange = (e, index) => {
        const newFiles = [...data.attachments];
        newFiles[index] = e.target.files[0];
        setData('attachments', newFiles);
    };

    // Function to add a new file input field
    const addFileField = () => {
        setData('attachments', [...data.attachments, null]);
    };

    // Function to remove a file input field
    const removeFileField = (index) => {
        const newFiles = [...data.attachments];
        newFiles.splice(index, 1);
        setData('attachments', newFiles);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('applications.store'), {
            forceFormData: true, // This is important for file uploads
        });
    };

    return (
        <AuthenticatedLayout
            user={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Applicants Form</h2>}
        >
            <Head title="File Application" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 md:p-8 space-y-8">
                            <h2 className="text-2xl font-bold text-gray-800">FILE APPLICATION</h2>

                            {/* Program Details */}
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

                            {/* Personal Details */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">PERSONAL DETAILS</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="first_name" value="First Name *" />
                                        <TextInput id="first_name" name="first_name" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} className="mt-1 block w-full" isFocused />
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
                                            {/* You can populate this list with all barangays */}
                                            <option value="">Choose your option</option>
                                            <option>Barangay 1</option>
                                            <option>Barangay 2</option>
                                        </select>
                                        <InputError message={errors.barangay} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="city" value="City *" />
                                        <TextInput id="city" name="city" value={data.city} readOnly className="mt-1 block w-full bg-gray-100" />
                                        <InputError message={errors.city} className="mt-2" />
                                    </div>
                                    {/* You have an extra Civil Status here in the design, I've omitted it */}
                                </div>
                            </section>

                            {/* Contact Information */}
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

                            {/* Attachment Files */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">ATTACHMENT FILES</h3>
                                {data.attachments.map((file, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <input type="file" onChange={(e) => handleFileChange(e, index)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                                        <button type="button" onClick={() => removeFileField(index)} className="bg-red-500 text-white p-2 rounded-md">-</button>
                                    </div>
                                ))}
                                <button type="button" onClick={addFileField} className="bg-blue-500 text-white p-2 rounded-md">+</button>
                            </section>

                            <div className="flex items-center justify-center mt-8">
                                <PrimaryButton className="w-full justify-center !py-3 !text-base" disabled={processing}>
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
