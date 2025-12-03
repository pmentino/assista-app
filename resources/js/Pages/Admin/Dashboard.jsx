import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth, stats }) {
    // Safety check: Ensure user object exists
    const user = auth?.user || { name: 'Admin' };

    return (
        <AuthenticatedLayout
            user={user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-2xl font-bold">Welcome back, {user.name}!</h3>
                            <p className="text-gray-600">Here is the summary of the Assistance Applications.</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
                            <h4 className="text-lg font-bold">Total Applications</h4>
                            <p className="text-4xl mt-2">{stats.total}</p>
                        </div>
                        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md">
                            <h4 className="text-lg font-bold">Pending</h4>
                            <p className="text-4xl mt-2">{stats.pending}</p>
                        </div>
                        <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
                            <h4 className="text-lg font-bold">Approved</h4>
                            <p className="text-4xl mt-2">{stats.approved}</p>
                        </div>
                        <div className="bg-red-500 text-white p-6 rounded-lg shadow-md">
                            <h4 className="text-lg font-bold">Rejected</h4>
                            <p className="text-4xl mt-2">{stats.rejected}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
