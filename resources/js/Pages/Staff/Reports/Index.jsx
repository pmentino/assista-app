import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { pickBy } from 'lodash';
import Pagination from '@/Components/Pagination';

export default function StaffReportsIndex({ applications, filters: initialFilters, stats }) {
    const { auth } = usePage().props;

    const [filters, setFilters] = useState({
        status: initialFilters.status || '',
        program: initialFilters.program || '',
        start_date: initialFilters.start_date || '',
        end_date: initialFilters.end_date || '',
    });

    const [period, setPeriod] = useState('');

    const formatDateLocal = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handlePeriodChange = (e) => {
        const selectedPeriod = e.target.value;
        setPeriod(selectedPeriod);
        const now = new Date();
        let start = '', end = '';

        switch (selectedPeriod) {
            case 'today':
                start = end = formatDateLocal(now); break;
            case 'this_week':
                const dayOfWeek = now.getDay();
                const sunday = new Date(now); sunday.setDate(now.getDate() - dayOfWeek);
                const saturday = new Date(sunday); saturday.setDate(sunday.getDate() + 6);
                start = formatDateLocal(sunday); end = formatDateLocal(saturday); break;
            case 'this_month':
                start = formatDateLocal(new Date(now.getFullYear(), now.getMonth(), 1));
                end = formatDateLocal(new Date(now.getFullYear(), now.getMonth() + 1, 0)); break;
            case 'last_month':
                start = formatDateLocal(new Date(now.getFullYear(), now.getMonth() - 1, 1));
                end = formatDateLocal(new Date(now.getFullYear(), now.getMonth(), 0)); break;
            case 'this_year':
                start = `${now.getFullYear()}-01-01`; end = `${now.getFullYear()}-12-31`; break;
            case 'custom': return;
            default: setFilters(prev => ({ ...prev, start_date: '', end_date: '' })); return;
        }
        setFilters(prev => ({ ...prev, start_date: start, end_date: end }));
    };

    useEffect(() => {
        router.get(route('staff.reports.index'), pickBy(filters), {
            preserveState: true, replace: true, preserveScroll: true,
        });
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        if (name === 'start_date' || name === 'end_date') setPeriod('custom');
    };

    const queryParams = new URLSearchParams(pickBy(filters)).toString();
    const exportPdfUrl = `${route('staff.reports.export-pdf')}?${queryParams}`;
    const exportExcelUrl = `${route('staff.reports.export-excel')}?${queryParams}`;

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-white leading-tight">Staff Reports & Analytics</h2>}
        >
            <Head title="Staff Reports" />

            <div className="py-10 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <StatCard title="Total Applications" value={stats.total} color="blue" icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        <StatCard title="Approved" value={stats.approved} color="green" icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <StatCard title="Pending Review" value={stats.pending} color="yellow" icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <StatCard title="Rejected" value={stats.rejected} color="red" icon="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Application Status Report</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Generate reports for your assigned tasks.</p>
                            </div>
                            <div className="flex gap-3">
                                <a href={exportExcelUrl} target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium text-sm rounded-lg shadow transition-colors">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    Export Excel
                                </a>
                                <a href={exportPdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-lg shadow transition-colors">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                    Export PDF
                                </a>
                            </div>
                        </div>

                        {/* Filters Section */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Period</label>
                                <select value={period} onChange={handlePeriodChange} className="block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm text-sm cursor-pointer focus:border-blue-500 focus:ring-blue-500">
                                    <option value="">Select Period...</option>
                                    <option value="today">Today</option>
                                    <option value="this_week">This Week</option>
                                    <option value="this_month">This Month</option>
                                    <option value="last_month">Last Month</option>
                                    <option value="this_year">This Year</option>
                                    <option value="custom">Custom Range</option>
                                </select>
                            </div>
                            <div className="col-span-2 grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">From</label>
                                    <input type="date" name="start_date" value={filters.start_date} onChange={handleFilterChange} className="block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">To</label>
                                    <input type="date" name="end_date" value={filters.end_date} onChange={handleFilterChange} className="block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Status</label>
                                <select name="status" value={filters.status} onChange={handleFilterChange} className="block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm text-sm cursor-pointer focus:border-blue-500 focus:ring-blue-500">
                                    <option value="">All Statuses</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Program</label>
                                <select name="program" value={filters.program} onChange={handleFilterChange} className="block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm text-sm cursor-pointer focus:border-blue-500 focus:ring-blue-500">
                                    <option value="">All Programs</option>
                                    <option value="Hospitalization">Hospitalization</option>
                                    <option value="Laboratory Tests">Laboratory Tests</option>
                                    <option value="Anti-Rabies Vaccine Treatment">Anti-Rabies Vaccine Treatment</option>
                                    <option value="Medicine Assistance">Medicine Assistance</option>
                                    <option value="Funeral Assistance">Funeral Assistance</option>
                                    <option value="Chemotherapy">Chemotherapy</option>
                                    <option value="Diagnostic Blood Tests">Diagnostic Blood Tests</option>
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Applicant</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Program</th>
                                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date Submitted</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {(applications?.data || []).length > 0 ? (
                                        applications.data.map((app) => (
                                            <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    {app.first_name} {app.last_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{app.program}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center"><StatusBadge status={app.status} /></td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right font-mono font-bold">
                                                    {app.amount_released ? `₱${Number(app.amount_released).toLocaleString()}` : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                                                    {new Date(app.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-400 dark:text-gray-500 italic">
                                                No records found matching your filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            {applications?.links && <Pagination links={applications.links} />}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Sub-components with Dark Mode
function StatCard({ title, value, color, icon }) {
    const colorClasses = {
        blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        green: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
        yellow: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
        red: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
    };
    return (
        <div className={`p-5 rounded-xl border ${colorClasses[color]} flex items-center shadow-sm transition-colors duration-300`}>
            <div className={`p-3 rounded-full bg-white dark:bg-gray-800 bg-opacity-60 mr-4`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} /></svg>
            </div>
            <div>
                <p className="text-xs font-bold uppercase opacity-80">{title}</p>
                <p className="text-2xl font-extrabold">{value}</p>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        Approved: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
        Pending: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
        Rejected: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
    };
    return <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${styles[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}>{status}</span>;
}
