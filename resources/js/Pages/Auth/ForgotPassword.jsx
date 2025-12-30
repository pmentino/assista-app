import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm, Link } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-gray-900">
            <Head title="Forgot Password" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center items-center gap-3 mb-6">
                    <img src="/images/logo.png" alt="Assista Logo" className="h-14 w-auto drop-shadow-sm" />
                    <span className="text-3xl font-extrabold text-blue-900 tracking-tight">ASSISTA</span>
                </Link>
                <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-gray-900">
                    Reset your password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter your email address and we will send you a link to reset your password.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 rounded-2xl sm:px-10 border border-gray-100">

                    {status && (
                        <div className="mb-4 font-medium text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="email" value="Email Address" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="name@example.com"
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end mt-6">
                            <PrimaryButton className="w-full justify-center py-3 bg-blue-800 hover:bg-blue-900 shadow-lg" disabled={processing}>
                                Email Password Reset Link
                            </PrimaryButton>
                        </div>

                        <div className="mt-6 text-center">
                            <Link href={route('login')} className="text-sm text-gray-500 hover:text-blue-700 font-medium">
                                &larr; Back to Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
