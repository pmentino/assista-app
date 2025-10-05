import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    // We only need the fields that will be sent to the backend
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        // The other fields like middle_name are for display only, which is fine
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        // THIS IS THE FIX: A simple post request with no transform
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
                <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden md:flex">
                    <div className="hidden md:block md:w-1/2 bg-white">
                       {/* Left side is plain white to avoid image errors */}
                    </div>

                    <div className="w-full md:w-1/2 p-8">
                        <img src="/images/dswd-logo.png" alt="DSWD Logo" className="h-16 w-auto mb-4" />
                        <p className="text-gray-600 mb-6">Please enter your details.</p>

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
                                <div className="sm:col-span-2">
                                    <InputLabel htmlFor="password" value="Password" />
                                    <TextInput id="password" type="password" name="password" value={data.password} className="mt-1 block w-full" onChange={(e) => setData('password', e.target.value)} required />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>
                                <div className="sm:col-span-2">
                                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                    <TextInput id="password_confirmation" name="password_confirmation" value={data.password_confirmation} className="mt-1 block w-full" onChange={(e) => setData('password_confirmation', e.target.value)} required />
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
