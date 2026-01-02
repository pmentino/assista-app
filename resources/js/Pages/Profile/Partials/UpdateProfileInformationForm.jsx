import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';

// --- ROXAS CITY BARANGAY LIST ---
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

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth?.user || {};

    const photoInput = useRef(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        _method: 'PATCH',
        name: user.name || '',
        email: user.email || '',
        contact_number: user.contact_number || '',
        civil_status: user.civil_status || '',
        sex: user.sex || '',
        birth_date: user.birth_date || '',
        barangay: user.barangay || '',
        house_no: user.house_no || '',
        photo: null,
    });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('photo', file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            preserveScroll: true,
        });
    };

    const currentPhotoUrl = user.profile_photo_path
        ? `/storage/${user.profile_photo_path}`
        : `https://ui-avatars.com/api/?name=${user.name || 'User'}&color=7F9CF5&background=EBF4FF`;

    return (
        <section className={`${className} bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl`}>
            <div className="px-4 py-6 sm:p-8">
                <header className="border-b border-gray-100 pb-5 mb-8">
                    <h2 className="text-lg font-bold text-blue-900">Beneficiary Profile</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your personal information. Keeping this updated ensures faster processing of your assistance applications.
                    </p>
                </header>

                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                        {/* --- LEFT: PHOTO SECTION --- */}
                        <div className="md:col-span-4 flex flex-col items-center space-y-4">
                            <div className="relative group">
                                <img
                                    src={photoPreview || currentPhotoUrl}
                                    alt="Profile"
                                    className="h-40 w-40 rounded-full object-cover border-4 border-gray-100 shadow-lg group-hover:border-blue-200 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => photoInput.current.click()}
                                    className="absolute bottom-2 right-2 p-2.5 bg-blue-800 text-white rounded-full shadow-md hover:bg-blue-700 transition transform hover:scale-110"
                                    title="Upload New Photo"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>
                            <input
                                type="file"
                                ref={photoInput}
                                className="hidden"
                                onChange={handlePhotoChange}
                                accept="image/*"
                            />
                            <div className="text-center">
                                <p className="text-sm font-bold text-gray-700">Profile Photo</p>
                                <p className="text-xs text-gray-500 mt-1">Allowed: JPG, PNG (Max 5MB)</p>
                                <InputError className="mt-2" message={errors.photo} />
                            </div>
                        </div>

                        {/* --- RIGHT: DETAILS FORM --- */}
                        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">

                            <div className="sm:col-span-2">
                                <InputLabel htmlFor="name" value="Full Name" />
                                <TextInput id="name" className="mt-1 block w-full bg-gray-50" value={data.name} onChange={(e) => setData('name', e.target.value)} required autoComplete="name" />
                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            <div className="sm:col-span-2">
                                <InputLabel htmlFor="email" value="Email Address" />
                                <TextInput id="email" type="email" className="mt-1 block w-full bg-gray-50" value={data.email} onChange={(e) => setData('email', e.target.value)} required autoComplete="username" />
                                <InputError className="mt-2" message={errors.email} />
                            </div>

                            <div>
                                <InputLabel htmlFor="contact_number" value="Mobile Number" />
                                <TextInput id="contact_number" className="mt-1 block w-full" value={data.contact_number} onChange={(e) => setData('contact_number', e.target.value)} placeholder="09XX XXX XXXX" />
                                <InputError className="mt-2" message={errors.contact_number} />
                            </div>

                            <div>
                                <InputLabel htmlFor="birth_date" value="Birth Date" />
                                <TextInput id="birth_date" type="date" className="mt-1 block w-full" value={data.birth_date} onChange={(e) => setData('birth_date', e.target.value)} />
                                <InputError className="mt-2" message={errors.birth_date} />
                            </div>

                            <div>
                                <InputLabel htmlFor="sex" value="Sex" />
                                <select
                                    id="sex"
                                    className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                    value={data.sex}
                                    onChange={(e) => setData('sex', e.target.value)}
                                >
                                    <option value="">Select Sex</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                <InputError className="mt-2" message={errors.sex} />
                            </div>

                            <div>
                                <InputLabel htmlFor="civil_status" value="Civil Status" />
                                <select
                                    id="civil_status"
                                    className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                    value={data.civil_status}
                                    onChange={(e) => setData('civil_status', e.target.value)}
                                >
                                    <option value="">Select Status</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Widowed">Widowed</option>
                                    <option value="Separated">Separated</option>
                                </select>
                                <InputError className="mt-2" message={errors.civil_status} />
                            </div>

                            <div className="sm:col-span-2 mt-2">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-200 pb-2 mb-4">Current Address</h3>
                            </div>

                            <div>
                                <InputLabel htmlFor="barangay" value="Barangay" />
                                {/* REPLACED TEXTINPUT WITH DROPDOWN */}
                                <select
                                    id="barangay"
                                    className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                    value={data.barangay}
                                    onChange={(e) => setData('barangay', e.target.value)}
                                >
                                    <option value="">Select Barangay</option>
                                    {BARANGAYS.map((brgy) => (
                                        <option key={brgy} value={brgy}>{brgy}</option>
                                    ))}
                                </select>
                                <InputError className="mt-2" message={errors.barangay} />
                            </div>

                            <div>
                                <InputLabel htmlFor="house_no" value="House No. / Street" />
                                <TextInput id="house_no" className="mt-1 block w-full" value={data.house_no} onChange={(e) => setData('house_no', e.target.value)} placeholder="e.g. Blk 5 Lot 2" />
                                <InputError className="mt-2" message={errors.house_no} />
                            </div>

                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100 justify-end">
                        <Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0">
                            <p className="text-sm text-green-600 font-bold flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Saved Successfully.
                            </p>
                        </Transition>
                        <PrimaryButton disabled={processing} className="bg-blue-800 hover:bg-blue-900 px-6 py-2">
                            Save Changes
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </section>
    );
}
