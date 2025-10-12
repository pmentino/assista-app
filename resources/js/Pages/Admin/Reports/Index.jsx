import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { pickBy } from 'lodash';

export default function ReportsIndex({ applications, filters: initialFilters }) {
    const { auth } = usePage().props;

    const [filters, setFilters] = useState({
        status: initialFilters.status || '',
        program: initialFilters.program || '',
    });

    useEffect(() => {
        const query = pickBy(filters);
        router.get(route('admin.reports.index'), query, {
            preserveState: true,
            replace: true,
        });
    }, [filters]);

    // This creates a URL query string from the current filters (e.g., "?status=Approved")
    const exportUrl = `${route('admin.reports.export')}?${new URLSearchParams(pickBy(filters)).toString()}`;

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Generate Reports</h2>}
        >
            <Head title="Reports" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm-px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">All Applications Report</h3>

                                {/* The button's link now dynamically includes the filters */}
                                <a
                                    href={exportUrl}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                                >
                                    Export to Excel
                                </a>
                            </div>

                            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Filter Controls Here */}
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Filter by Status</label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={filters.status}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    >
                                        <option value="">All</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="program" className="block text-sm font-medium text-gray-700">Filter by Program</label>
                                    <select
                                        id="program"
                                        name="program"
                                        value={filters.program}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    >
                                        <option value="">All</option>
                                        <option value="AICS - Medical">AICS - Medical</option>
                                        <option value="AICS - Burial">AICS - Burial</option>
                                        <option value="AICS - Food">AICS - Food</option>
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                {/* Table Here */}
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {applications.length > 0 ? (
                                            applications.map((application) => (
                                                <tr key={application.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {application.user ? application.user.name : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.program}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            application.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                            application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {application.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(application.created_at).toLocaleDateString()}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No applications found matching your criteria.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
