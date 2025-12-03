import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { pickBy } from 'lodash';

export default function ReportsIndex({ applications, filters: initialFilters, stats }) {
    const { auth } = usePage().props;

    const [filters, setFilters] = useState({
        status: initialFilters.status || '',
        program: initialFilters.program || '',
        start_date: initialFilters.start_date || '',
        end_date: initialFilters.end_date || '',
    });

    useEffect(() => {
        const query = pickBy(filters);
        router.get(route('admin.reports.index'), query, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    }, [filters]);

    // Build Export URLs based on current filters
    const queryParams = new URLSearchParams(pickBy(filters)).toString();
    const exportExcelUrl = `${route('admin.reports.export')}?${queryParams}`; // Keep for future
    const exportPdfUrl = `${route('admin.reports.export-pdf')}?${queryParams}`;

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
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* --- STATS SUMMARY CARDS --- */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                            <p className="text-gray-500 text-xs font-bold uppercase">Total Applications</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                            <p className="text-gray-500 text-xs font-bold uppercase">Approved</p>
                            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                            <p className="text-gray-500 text-xs font-bold uppercase">Rejected</p>
                            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                            <p className="text-gray-500 text-xs font-bold uppercase">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            {/* --- HEADER & EXPORT BUTTONS --- */}
                            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                                <h3 className="text-lg font-bold">Filtered Report</h3>
                                <div className="flex gap-2">
                                    <a
                                        href={exportPdfUrl}
                                        target="_blank"
                                        className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 transition"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                        Download PDF
                                    </a>
                                </div>
                            </div>

                            {/* --- FILTERS ROW --- */}
                            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end bg-gray-50 p-4 rounded-lg">
                                {/* Date Range */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">From Date</label>
                                    <input type="date" name="start_date" value={filters.start_date} onChange={handleFilterChange} className="block w-full border-gray-300 rounded-md shadow-sm text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">To Date</label>
                                    <input type="date" name="end_date" value={filters.end_date} onChange={handleFilterChange} className="block w-full border-gray-300 rounded-md shadow-sm text-sm" />
                                </div>

                                {/* Status Filter */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Status</label>
                                    <select name="status" value={filters.status} onChange={handleFilterChange} className="block w-full border-gray-300 rounded-md shadow-sm text-sm">
                                        <option value="">All Statuses</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>

                                {/* Program Filter */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Program</label>
                                    <select name="program" value={filters.program} onChange={handleFilterChange} className="block w-full border-gray-300 rounded-md shadow-sm text-sm">
                                        <option value="">All Programs</option>
                                        <option value="Laboratory Tests">Laboratory Tests</option>
                                        <option value="Anti-Rabies Vaccine Treatment">Anti-Rabies Vaccine Treatment</option>
                                        <option value="Funeral Assistance">Funeral Assistance</option>
                                        <option value="Medicine Assistance">Medicine Assistance</option>
                                        <option value="Hospitalization">Hospitalization</option>
                                        <option value="Chemotherapy">Chemotherapy</option>
                                        <option value="Diagnostic Blood Tests">Diagnostic Blood Tests</option>
                                    </select>
                                </div>
                            </div>

                            {/* --- TABLE PREVIEW --- */}
                            <div className="overflow-x-auto border rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Applicant</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Program</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {applications.data.length > 0 ? (
                                            applications.data.map((app) => (
                                                <tr key={app.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                        {app.user?.name || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.program}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                            app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {app.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(app.created_at).toLocaleDateString()}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">
                                                    No records found for the selected date range and filters.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination (Optional if you have a pagination component) */}
                            {/* <Pagination links={applications.links} className="mt-6" /> */}

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
