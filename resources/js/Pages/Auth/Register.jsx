import { useEffect, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

// A simple eye icon component
const EyeIcon = ({ closed }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
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
        last_name: '',
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
        <div className="min-h-screen bg-gray-200">
            <Head title="Register" />

            <header className="bg-blue-800 p-4 shadow-md">
                <div className="container mx-auto flex items-center">
                    <img src="/images/logo.png" alt="Assista Logo" className="h-10 w-auto mr-3" />
                    <span className="text-2xl font-bold text-white">ASSISTA</span>
                </div>
            </header>

            <main className="flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden">
                    <div className="p-8">
                        <img src="/images/dswd-logo.png" alt="DSWD Logo" className="h-16 w-auto mb-4 mx-auto" />
                        <p className="text-center text-gray-600 mb-6">Please enter your details.</p>

                        <form onSubmit={submit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="first_name" value="First Name" />
                                    <TextInput id="first_name" name="first_name" value={data.first_name} className="mt-1 block w-full" isFocused={true} onChange={(e) => setData('first_name', e.target.value)} required />
                                    <InputError message={errors.first_name} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="middle_name" value="Middle Name" />
                                    <TextInput id="middle_name" name="middle_name" className="mt-1 block w-full" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="last_name" value="Last Name" />
                                    <TextInput id="last_name" name="last_name" value={data.last_name} className="mt-1 block w-full" onChange={(e) => setData('last_name', e.target.value)} required />
                                    <InputError message={errors.last_name} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="suffix_name" value="Suffix Name" />
                                    <TextInput id="suffix_name" name="suffix_name" className="mt-1 block w-full" />
                                </div>
                                <div className="sm:col-span-2">
                                    <InputLabel htmlFor="contact_number" value="Contact Number" />
                                    <TextInput id="contact_number" name="contact_number" className="mt-1 block w-full" />
                                </div>
                                <div className="sm:col-span-2">
                                    <InputLabel htmlFor="email" value="Email" />
                                    <TextInput id="email" type="email" name="email" value={data.email} className="mt-1 block w-full" onChange={(e) => setData('email', e.target.value)} required />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div className="sm:col-span-2 relative">
                                    <InputLabel htmlFor="password" value="Password" />
                                    <TextInput id="password" type={showPassword ? 'text' : 'password'} name="password" value={data.password} className="mt-1 block w-full" onChange={(e) => setData('password', e.target.value)} required />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-5 pr-3 flex items-center">
                                        <EyeIcon closed={showPassword} />
                                    </button>
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                <div className="sm:col-span-2 relative">
                                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                    <TextInput id="password_confirmation" type={showPassword ? 'text' : 'password'} name="password_confirmation" value={data.password_confirmation} className="mt-1 block w-full" onChange={(e) => setData('password_confirmation', e.target.value)} required />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-5 pr-3 flex items-center">
                                        <EyeIcon closed={showPassword} />
                                    </button>
                                    <InputError message={errors.password_confirmation} className="mt-2" />
                                </div>
                            </div>

                            <div className="mt-6">
                                <PrimaryButton className="w-full justify-center !py-3" disabled={processing}>
                                    Sign Up
                                </PrimaryButton>
                            </div>

                            <div className="flex items-center justify-center mt-4">
                                <Link href={route('login')} className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Already have an account? Sign In
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
