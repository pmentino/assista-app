import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

// This is a small, reusable component just for our stat cards
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

// This component now receives both 'auth' (the user object) and 'stats'
export default function Dashboard({ auth, stats }) {
    return (
        <AuthenticatedLayout
            user={auth} // Pass the 'auth' object directly, as your project expects
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* The stat cards grid now adjusts for different screen sizes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <StatCard title="Total Applications" value={stats.total} colorClass="border-blue-500" />
                        <StatCard title="Pending Applications" value={stats.pending} colorClass="border-yellow-500" />
                        <StatCard title="Approved Applications" value={stats.approved} colorClass="border-green-500" />
                        <StatCard title="Rejected Applications" value={stats.rejected} colorClass="border-red-500" />
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-xl font-bold">Welcome, {auth.name}!</h3>
                            <p className="mt-2 text-gray-600">From here you can manage the system's applications and beneficiaries.</p>

                            {/* --- THIS IS THE UPDATED RESPONSIVE SECTION --- */}
                            <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link
                                    href={route('admin.applications.index')}
                                    className="inline-flex items-center justify-center px-4 py-3 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                                >
                                    Manage All Applications
                                </Link>
                                <Link
                                    href={route('admin.reports.index')}
                                    className="inline-flex items-center justify-center px-4 py-3 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                                >
                                    View Reports
                                </Link>
                            </div>
                            {/* --- END OF UPDATED SECTION --- */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
