import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        // We create a full-page container with the background image
        <div
            className="min-h-screen bg-gray-100"
            style={{
                backgroundImage: `url('/images/login-bg.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <Head title="Log in" />

            {/* Header Section */}
            <header className="bg-blue-800 p-4 shadow-md">
                <div className="container mx-auto flex items-center">
                    <img src="/images/logo.png" alt="Assista Logo" className="h-10 w-auto mr-3" />
                    <span className="text-2xl font-bold text-white">ASSISTA</span>
                </div>
            </header>

            {/* Main Content: Centered Login Form */}
            <main className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-lg">

                    {/* DSWD Logo and Title */}
                    <div className="text-center">
                        <img className="mx-auto h-20 w-auto" src="/images/dswd-logo.png" alt="DSWD Logo" />
                        <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
                            Sign in to your Account
                        </h2>
                    </div>

                    {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                    <form className="mt-8 space-y-6" onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="text-sm text-right">
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Forgot Password?
                                </Link>
                            )}
                        </div>

                        <div>
                            <PrimaryButton className="w-full justify-center !py-3" disabled={processing}>
                                Sign In
                            </PrimaryButton>
                        </div>

                        <div className="text-sm text-center">
                            <span className="text-gray-600">Don't have an Account? </span>
                             <Link
                                href={route('register')}
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Sign up
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
