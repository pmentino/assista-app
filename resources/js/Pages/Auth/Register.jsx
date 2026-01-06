import { useEffect, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

const EyeIcon = ({ closed }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 hover:text-blue-600 transition-colors">
        {closed ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        )}
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix_name: '',
        contact_number: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConsentModal, setShowConsentModal] = useState(false);
    const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    // Helper to allow only letters and spaces
    const handleNameChange = (field, value) => {
        const regex = /^[a-zA-Z\s]*$/;
        if (regex.test(value)) {
            setData(field, value);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (!agreedToPrivacy) {
            alert("You must agree to the Data Privacy Statement to register.");
            return;
        }
        post(route('register'));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-gray-900">
            <Head title="Register" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center items-center gap-3 mb-6 group">
                    <div className="bg-white p-2 rounded-full shadow-sm group-hover:scale-105 transition-transform">
                        <img src="/images/logo.png" alt="Assista Logo" className="h-12 w-auto" />
                    </div>
                    <span className="text-3xl font-extrabold text-blue-900 tracking-tight group-hover:text-blue-800 transition-colors">ASSISTA</span>
                </Link>
                <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-gray-900">
                    Create your beneficiary account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already registered?{' '}
                    <Link href={route('login')} className="font-medium text-blue-700 hover:text-blue-600 transition underline">
                        Sign in here
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 rounded-2xl sm:px-10 border border-gray-100">

                    <div className="mb-8 flex flex-col items-center border-b border-gray-100 pb-6">
                         {/* Ensure dswd-logo.png exists or remove this line */}
                         <img src="/images/dswd-logo.png" alt="DSWD Logo" className="h-12 w-auto mb-2 opacity-90" />
                         <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Official Registration Form</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">

                        {/* --- PERSONAL INFO --- */}
                        <div>
                            <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-4 flex items-center">
                                <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">1</span>
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <InputLabel htmlFor="first_name" value="First Name *" />
                                    <TextInput
                                        id="first_name"
                                        value={data.first_name}
                                        className="mt-1 block w-full capitalize"
                                        onChange={(e) => handleNameChange('first_name', e.target.value)}
                                        required
                                        placeholder="e.g. Juan"
                                    />
                                    <InputError message={errors.first_name} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="middle_name" value="Middle Name (Optional)" />
                                    <TextInput
                                        id="middle_name"
                                        value={data.middle_name}
                                        className="mt-1 block w-full capitalize"
                                        onChange={(e) => handleNameChange('middle_name', e.target.value)}
                                        placeholder="e.g. Dela"
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="last_name" value="Last Name *" />
                                    <TextInput
                                        id="last_name"
                                        value={data.last_name}
                                        className="mt-1 block w-full capitalize"
                                        onChange={(e) => handleNameChange('last_name', e.target.value)}
                                        required
                                        placeholder="e.g. Cruz"
                                    />
                                    <InputError message={errors.last_name} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="suffix_name" value="Suffix (e.g. Jr., III)" />
                                    <TextInput
                                        id="suffix_name"
                                        value={data.suffix_name}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('suffix_name', e.target.value)}
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* --- CONTACT INFO --- */}
                        <div className="pt-2">
                            <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-4 flex items-center">
                                <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">2</span>
                                Contact Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="sm:col-span-1">
                                    <InputLabel htmlFor="contact_number" value="Mobile Number *" />
                                    <TextInput
                                        id="contact_number"
                                        name="contact_number"
                                        value={data.contact_number}
                                        className="mt-1 block w-full"
                                        placeholder="09123456789"
                                        maxLength={11}
                                        onChange={(e) => setData('contact_number', e.target.value.replace(/\D/g, '').slice(0, 11))}
                                        required
                                    />
                                    <InputError message={errors.contact_number} className="mt-2" />
                                </div>
                                <div className="sm:col-span-1">
                                    <InputLabel htmlFor="email" value="Email Address *" />
                                    <TextInput id="email" type="email" name="email" value={data.email} className="mt-1 block w-full" placeholder="name@example.com" onChange={(e) => setData('email', e.target.value)} required />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* --- SECURITY --- */}
                        <div className="pt-2">
                            <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-4 flex items-center">
                                <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">3</span>
                                Account Security
                            </h3>
                            <div className="space-y-4">
                                <div className="relative">
                                    <InputLabel htmlFor="password" value="Password *" />
                                    <div className="relative mt-1">
                                        <TextInput
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={data.password}
                                            className="block w-full pr-10"
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 z-10 focus:outline-none"
                                        >
                                            <EyeIcon closed={!showPassword} />
                                        </button>
                                    </div>
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                <div className="relative">
                                    <InputLabel htmlFor="password_confirmation" value="Confirm Password *" />
                                    <div className="relative mt-1">
                                        <TextInput
                                            id="password_confirmation"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            className="block w-full pr-10"
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.password_confirmation} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* --- DATA PRIVACY CONSENT --- */}
                        <div className="pt-2">
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
                                <div className="ml-3 text-sm">
                                    <label htmlFor="privacy_agreement" className="font-medium text-gray-700">
                                        I agree to the <button type="button" onClick={() => setShowConsentModal(true)} className="text-blue-600 hover:underline font-bold">Data Privacy Consent</button> statement.
                                    </label>
                                    <p className="text-gray-500 text-xs">By checking this, you consent to the collection and processing of your personal data.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <PrimaryButton className="w-full justify-center py-3 bg-blue-800 hover:bg-blue-900 shadow-lg hover:shadow-xl transition-all text-base font-bold tracking-wide" disabled={processing || !agreedToPrivacy}>
                                REGISTER ACCOUNT
                            </PrimaryButton>
                        </div>
                    </form>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-6 text-center">
                    <p className="text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} City Social Welfare and Development Office. All rights reserved.
                    </p>
                </div>
            </div>

            {/* --- DATA PRIVACY MODAL --- */}
            <Modal show={showConsentModal} onClose={() => setShowConsentModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                        Data Privacy Consent
                    </h2>
                    <div className="text-sm text-gray-600 space-y-3 h-64 overflow-y-auto pr-2">
                        <p>
                            In compliance with the <strong>Data Privacy Act of 2012 (R.A. 10173)</strong>, the City Social Welfare and Development Office (CSWDO) of Roxas City is committed to protecting your personal information.
                        </p>
                        <p>
                            <strong>Collection of Data:</strong> We collect your personal data (Name, Age, Address, Contact Info) and sensitive personal data (Health records, Indigency status) solely for the purpose of processing your application for the Assistance to Individuals in Crisis Situation (AICS) program.
                        </p>
                        <p>
                            <strong>Use of Data:</strong> Your data will be used to verify eligibility, process financial assistance, and generate reports for government auditing. It will not be shared with third parties without your consent, except as required by law.
                        </p>
                        <p>
                            <strong>Retention:</strong> Your records will be securely stored in the Assista System database and physical archives in accordance with the National Archives of the Philippines Act.
                        </p>
                        <p>
                            By clicking "I Agree", you certify that the information provided is true and correct, and you consent to the collection and processing of your data.
                        </p>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setShowConsentModal(false)} className="mr-3">
                            Close
                        </SecondaryButton>
                        <PrimaryButton onClick={() => { setAgreedToPrivacy(true); setShowConsentModal(false); }}>
                            I Agree
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>

        </div>
    );
}
