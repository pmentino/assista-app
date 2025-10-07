import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-xl font-bold">Welcome, {auth.name}!</h3>
                            <p className="mt-4">From here you can manage the system's applications and beneficiaries.</p>

                            <div className="mt-6 flex space-x-4">
                                <Link
                                    href={route('admin.aid-requests.index')}
                                    className="inline-block bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
                                >
                                    Manage All Aid Requests
                                </Link>

                                {/* --- ADD THIS NEW LINK --- */}
                                <Link
                                    href={route('admin.reports.index')}
                                    className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    View Reports
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
