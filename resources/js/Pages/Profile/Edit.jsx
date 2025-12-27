import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';

export default function Edit({ auth, mustVerifyEmail, status }) {
    // FIX: Safely access user property
    const user = auth?.user || {};

    return (
        <AuthenticatedLayout
            user={user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Account</h2>}
        >
            <Head title="Profile" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* 1. BENEFICIARY PROFILE (Full Width) */}
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="w-full"
                    />

                    {/* 2. SECURITY SETTINGS (Grid Layout) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Password Update */}
                        <div className="p-4 sm:p-8 bg-white shadow-sm sm:rounded-xl ring-1 ring-gray-900/5">
                            <UpdatePasswordForm className="max-w-xl" />
                        </div>

                        {/* Delete Account */}
                        <div className="p-4 sm:p-8 bg-white shadow-sm sm:rounded-xl ring-1 ring-gray-900/5">
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
