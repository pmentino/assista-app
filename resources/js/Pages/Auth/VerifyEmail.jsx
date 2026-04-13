import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verify Email - Assista" />

            <div className="flex flex-col items-center justify-center py-6 px-4 sm:px-6">

                {/* Envelope Icon (Nag-a-add ng modern feel) */}
                <div className="bg-blue-100 p-4 rounded-full mb-6 shadow-sm border border-blue-200">
                    <svg
                        className="w-10 h-10 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                    I-verify ang iyong Email
                </h2>

                <div className="mb-6 text-sm text-gray-600 text-center leading-relaxed">
                    Salamat sa pag-register sa <strong>Assista</strong>! Bago ka makapasok sa system, kailangan mo munang i-verify ang iyong email address. May ipinadala kaming link sa iyong inbox. <br/><br/>
                    Kung sakaling wala kang natanggap, i-click lang ang button sa ibaba para mag-request ng panibago.
                </div>

                {/* Success Message kapag na-click ang Resend */}
                {status === 'verification-link-sent' && (
                    <div className="mb-6 text-sm font-medium text-green-700 bg-green-50 border border-green-200 p-4 rounded-lg w-full text-center shadow-sm">
                        ✅ Isang bagong verification link ang naipadala sa iyong email address!
                    </div>
                )}

                <form onSubmit={submit} className="w-full mt-2">
                    <div className="flex flex-col items-center justify-center space-y-4">

                        {/* Mas malaking button para madaling i-click */}
                        <PrimaryButton
                            className="w-full justify-center py-3 text-sm shadow-md hover:shadow-lg transition-all duration-200"
                            disabled={processing}
                        >
                            I-send Ulit ang Verification Email
                        </PrimaryButton>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="text-sm font-medium text-gray-500 underline hover:text-gray-900 focus:outline-none transition-colors"
                        >
                            Log Out o Gumamit ng Ibang Account
                        </Link>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
