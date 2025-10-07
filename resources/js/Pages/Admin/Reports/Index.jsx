import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const StatCard = ({ title, value }) => (
    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <div className="p-6">
            <h3 className="text-lg font-medium text-gray-500">{title}</h3>
            <p className="mt-1 text-4xl font-semibold text-gray-900">{value}</p>
        </div>
    </div>
);

export default function Index({ auth, stats }) {
    return (
        <AuthenticatedLayout
            user={auth} // <-- THIS IS THE FIX (from auth.user to auth)
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Reports</h2>}
        >
            <Head title="Reports" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <StatCard title="Total Applications" value={stats.total} />
                        <StatCard title="Pending" value={stats.pending} />
                        <StatCard title="Approved" value={stats.approved} />
                        <StatCard title="Rejected" value={stats.rejected} />
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold">Export Data</h3>
                                <p className="text-sm text-gray-600">Download a full report of all applications in CSV format.</p>
                            </div>
                            <a
                                href={route('admin.reports.export')}
                                className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Export to CSV
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
