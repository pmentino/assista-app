import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth, stats, barangayStats }) {
    const user = auth?.user || { name: 'Admin' };

    // Helper to format currency to PHP (e.g., ₱5,000.00)
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount || 0);
    };

    return (
        <AuthenticatedLayout
            user={user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Executive Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Welcome Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-8">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-2xl font-bold text-blue-900">Welcome back, {user.name}!</h3>
                            <p className="text-gray-600">Here is the latest financial and operational data for the AICS Program.</p>
                        </div>
                    </div>

                    {/* --- MAIN STATS GRID --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                        {/* Financial Card (NEW) */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg shadow-lg col-span-1 md:col-span-2 lg:col-span-1">
                            <h4 className="text-xs font-bold uppercase tracking-wider opacity-75">Total Assistance Released</h4>
                            <p className="text-3xl font-extrabold mt-2">{formatCurrency(stats.total_released)}</p>
                            <p className="text-xs mt-2 opacity-75">Cumulative approved amount</p>
                        </div>

                        {/* Status Cards */}
                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Review</h4>
                            <p className="text-4xl font-bold text-gray-800 mt-2">{stats.pending}</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Approved / Released</h4>
                            <p className="text-4xl font-bold text-gray-800 mt-2">{stats.approved}</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rejected</h4>
                            <p className="text-4xl font-bold text-gray-800 mt-2">{stats.rejected}</p>
                        </div>
                    </div>

                    {/* --- DETAILED ANALYTICS --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Barangay Distribution Table (NEW) */}
                        <div className="lg:col-span-2 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-bold text-gray-800">Top Barangays by Assistance</h3>
                            </div>
                            <div className="p-6">
                                {barangayStats.length > 0 ? (
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Barangay</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Beneficiaries</th>
                                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Total Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {barangayStats.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.barangay}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.total}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-bold">
                                                        {formatCurrency(item.amount)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-gray-500 italic">No approved applications yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions / Summary */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-bold text-gray-800">Overview</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-600">Total Applications Received</span>
                                    <span className="font-bold text-gray-900">{stats.total}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                                </div>
                                <p className="text-sm text-gray-500">
                                    This dashboard provides a real-time overview of the AICS program distribution across Roxas City.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
