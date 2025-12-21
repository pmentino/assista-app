import { useEffect, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

// A simple eye icon component
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

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-gray-900">
            <Head title="Register" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center items-center gap-3 mb-6">
                    <img src="/images/logo.png" alt="Assista Logo" className="h-14 w-auto drop-shadow-sm" />
                    <span className="text-3xl font-extrabold text-blue-900 tracking-tight">ASSISTA</span>
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
                                    <TextInput id="first_name" name="first_name" value={data.first_name} className="mt-1 block w-full" isFocused={true} onChange={(e) => setData('first_name', e.target.value)} required />
                                    <InputError message={errors.first_name} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="middle_name" value="Middle Name (Optional)" />
                                    <TextInput id="middle_name" name="middle_name" value={data.middle_name} className="mt-1 block w-full" onChange={(e) => setData('middle_name', e.target.value)} />
                                </div>
                                <div>
                                    <InputLabel htmlFor="last_name" value="Last Name *" />
                                    <TextInput id="last_name" name="last_name" value={data.last_name} className="mt-1 block w-full" onChange={(e) => setData('last_name', e.target.value)} required />
                                    <InputError message={errors.last_name} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="suffix_name" value="Suffix (e.g. Jr., III)" />
                                    <TextInput id="suffix_name" name="suffix_name" value={data.suffix_name} className="mt-1 block w-full" onChange={(e) => setData('suffix_name', e.target.value)} />
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
                                    <TextInput id="contact_number" name="contact_number" value={data.contact_number} className="mt-1 block w-full" placeholder="0912 345 6789" onChange={(e) => setData('contact_number', e.target.value)} required />
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

                        <div className="pt-4">
                            <PrimaryButton className="w-full justify-center py-3 bg-blue-800 hover:bg-blue-900 shadow-lg hover:shadow-xl transition-all text-base font-bold tracking-wide" disabled={processing}>
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
        </div>
    );
}
