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
        // FIX: Point to STAFF route
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
    // FIX: Point to STAFF export routes
    const exportPdfUrl = `${route('staff.reports.export-pdf')}?${queryParams}`;
    const exportExcelUrl = `${route('staff.reports.export-excel')}?${queryParams}`;

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Staff Reports & Analytics</h2>}
        >
            <Head title="Staff Reports" />

            <div className="py-10 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <StatCard title="Total Applications" value={stats.total} color="blue" icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        <StatCard title="Approved" value={stats.approved} color="green" icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <StatCard title="Pending Review" value={stats.pending} color="yellow" icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <StatCard title="Rejected" value={stats.rejected} color="red" icon="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Application Status Report</h3>
                                <p className="text-sm text-gray-500">Generate reports for your assigned tasks.</p>
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

                        {/* Filters Section (Same as Admin) */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-4 bg-white border-b border-gray-100">
                            {/* ... (Copy the filter inputs exactly from your Admin code provided) ... */}
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Period</label>
                                <select value={period} onChange={handlePeriodChange} className="block w-full border-gray-300 bg-gray-50 rounded-md shadow-sm text-sm cursor-pointer">
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
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">From</label><input type="date" name="start_date" value={filters.start_date} onChange={handleFilterChange} className="block w-full border-gray-300 rounded-md shadow-sm text-sm" /></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">To</label><input type="date" name="end_date" value={filters.end_date} onChange={handleFilterChange} className="block w-full border-gray-300 rounded-md shadow-sm text-sm" /></div>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                                <select name="status" value={filters.status} onChange={handleFilterChange} className="block w-full border-gray-300 rounded-md shadow-sm text-sm cursor-pointer">
                                    <option value="">All Statuses</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Program</label>
                                <select name="program" value={filters.program} onChange={handleFilterChange} className="block w-full border-gray-300 rounded-md shadow-sm text-sm cursor-pointer">
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
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Applicant</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Program</th>
                                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Date Submitted</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {(applications?.data || []).length > 0 ? (
                                        applications.data.map((app) => (
                                            <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.first_name} {app.last_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.program}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center"><StatusBadge status={app.status} /></td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-mono font-bold">{app.amount_released ? `₱${Number(app.amount_released).toLocaleString()}` : '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{new Date(app.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic">No records found matching your filters.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50">
                            {applications?.links && <Pagination links={applications.links} />}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Sub-components
function StatCard({ title, value, color, icon }) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 border-blue-200',
        green: 'bg-green-50 text-green-600 border-green-200',
        yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
        red: 'bg-red-50 text-red-600 border-red-200',
    };
    return (
        <div className={`p-5 rounded-xl border ${colorClasses[color]} flex items-center shadow-sm`}>
            <div className={`p-3 rounded-full bg-white bg-opacity-60 mr-4`}>
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
        Approved: 'bg-green-100 text-green-800 border-green-200',
        Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        Rejected: 'bg-red-100 text-red-800 border-red-200',
    };
    return <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
}
