import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

const StatCard = ({ title, value, colorClass }) => {
    return (
        <div className={`bg-white overflow-hidden shadow-sm sm:rounded-lg border-l-4 ${colorClass}`}>
            <div className="p-6">
                <div className="text-sm font-medium text-gray-500 truncate">{title}</div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">{value}</div>
            </div>
        </div>
    );
};

export default function Dashboard({ stats }) {
    // 1. Use the usePage hook to get the global auth prop
    const { auth } = usePage().props;

    // 2. Safely check if user exists
    const userName = auth?.user?.name || 'Staff Member';

    return (
        <AuthenticatedLayout
            // 3. Pass user safely to the layout
            user={auth?.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Staff Dashboard</h2>}
        >
            <Head title="Staff Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <StatCard title="Total Applications" value={stats.total} colorClass="border-blue-500" />
                        <StatCard title="Pending Applications" value={stats.pending} colorClass="border-yellow-500" />
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-xl font-bold">Welcome, {userName}!</h3>
                            <p className="mt-2 text-gray-600">You have access to view and manage applications.</p>
                            <div className="mt-6">
                                <Link
                                    href={route('staff.applications.index')}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                                >
                                    View Applications
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
