import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, Link } from '@inertiajs/react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Added 'pendingApplications' to props
export default function Dashboard({ auth, stats, budgetStats, chartData, barangayStats, allBarangays, filters, pendingApplications = [] }) {
    const user = auth?.user || { name: 'Admin' };

    // --- STATE MANAGEMENT ---
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [isBarangayModalOpen, setIsBarangayModalOpen] = useState(false);

    const budgetForm = useForm({
        amount: budgetStats?.total_budget || '',
    });

    const [filterValues, setFilterValues] = useState({
        barangay: filters.barangay || '',
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
    });

    // --- HELPERS ---
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    // --- HANDLERS ---
    const handleBudgetSubmit = (e) => {
        e.preventDefault();
        budgetForm.post(route('admin.dashboard.budget'), {
            onSuccess: () => setIsBudgetModalOpen(false),
        });
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filterValues, [key]: value };
        setFilterValues(newFilters);
        router.get(route('admin.dashboard'), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    // --- CHART CONFIG ---
    const data = {
        labels: chartData.labels,
        datasets: [{
            label: 'Amount Released (PHP)',
            data: chartData.values,
            fill: true,
            backgroundColor: 'rgba(59, 130, 246, 0.2)', // Blue-500 with opacity
            borderColor: 'rgb(37, 99, 235)', // Blue-600
            tension: 0.4,
        }],
    };

    // Chart Options (Tweaked to look okay on both modes, though specialized dark config would require more JS)
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#9ca3af' } // gray-400 for neutral visibility
            },
            tooltip: { callbacks: { label: function(context) { return formatCurrency(context.raw); } } }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: '#9ca3af', callback: function(value) { return '₱' + value; } },
                grid: { color: 'rgba(156, 163, 175, 0.1)' }
            },
            x: {
                ticks: { color: '#9ca3af' },
                grid: { color: 'rgba(156, 163, 175, 0.1)' }
            }
        }
    };

    return (
        <AuthenticatedLayout user={user} header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Executive Dashboard</h2>}>
            <Head title="Admin Dashboard" />

            {/* DARK MODE: Main Background */}
            <div className="py-12 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Welcome Section */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-8 border-l-4 border-blue-900 dark:border-blue-500 transition-colors duration-300">
                        <div className="p-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-300">Welcome back, {user.name}!</h3>
                                <p className="text-gray-600 dark:text-gray-400">Here is the latest financial and operational data for the AICS Program.</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase">Current Date</p>
                                <p className="text-lg font-mono text-gray-800 dark:text-gray-200">{new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </div>
                    </div>

                    {/* --- ACTION CENTER (PENDING APPLICATIONS) --- */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-8 border border-amber-200 dark:border-amber-900/50 transition-colors duration-300">
                        <div className="bg-amber-50 dark:bg-amber-900/20 px-6 py-4 border-b border-amber-200 dark:border-amber-800/50 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    Action Required: Pending Applications
                                </h3>
                                <p className="text-sm text-amber-700 dark:text-amber-500">These citizens are waiting for validation. Review them promptly.</p>
                            </div>
                            {stats.pending > 0 && (
                                <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-sm">
                                    {stats.pending} Pending
                                </span>
                            )}
                        </div>

                        <div className="p-0">
                            {pendingApplications && pendingApplications.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Applicant Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type / Purpose</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date Submitted</th>
                                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {pendingApplications.map((app, index) => (
                                            <tr key={index} className="hover:bg-amber-50 dark:hover:bg-amber-900/10 transition">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-amber-200 dark:bg-amber-700 flex items-center justify-center text-amber-800 dark:text-amber-100 font-bold text-xs">
                                                            {app.first_name ? app.first_name.charAt(0) : 'U'}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{app.first_name} {app.last_name}</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">{app.barangay}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                                        {app.assistance_type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {formatDate(app.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link
                                                        href={route('admin.applications.show', app.id)}
                                                        className="text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 px-4 py-2 rounded shadow-sm text-xs font-bold transition"
                                                    >
                                                        Review Now
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-8 text-center bg-gray-50 dark:bg-gray-800/50">
                                    <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">No pending applications found. Good job!</p>
                                </div>
                            )}
                            <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                                <Link href={route('admin.applications.index', { status: 'Pending' })} className="text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                                    View All Pending Applications &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* --- BUDGET MONITORING SECTION --- */}
                    {budgetStats && (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-8 border-l-8 border-indigo-600 dark:border-indigo-500 transition-colors duration-300">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wide">
                                            Monthly Budget Utilization ({new Date().toLocaleString('default', { month: 'long' })})
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Monitor fund usage to ensure sustainable assistance distribution.</p>
                                    </div>
                                    <button
                                        onClick={() => setIsBudgetModalOpen(true)}
                                        className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-bold py-2 px-4 rounded shadow transition"
                                    >
                                        Set / Update Budget
                                    </button>
                                </div>

                                <div className="relative pt-1">
                                    <div className="flex mb-2 items-center justify-between">
                                        <div>
                                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200 dark:text-indigo-200 dark:bg-indigo-900">
                                                {budgetStats.percentage.toFixed(1)}% Used
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-semibold inline-block text-gray-600 dark:text-gray-400">
                                                {formatCurrency(budgetStats.total_used)} / {formatCurrency(budgetStats.total_budget)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-indigo-200 dark:bg-indigo-900/50">
                                        <div
                                            style={{ width: `${Math.min(budgetStats.percentage, 100)}%` }}
                                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${budgetStats.percentage > 90 ? 'bg-red-500' : 'bg-indigo-500'}`}
                                        ></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-100 dark:border-gray-700">
                                        <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">Allocated Budget</span>
                                        <span className="block text-xl font-extrabold text-gray-800 dark:text-white">{formatCurrency(budgetStats.total_budget)}</span>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-100 dark:border-gray-700">
                                        <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">Total Released</span>
                                        <span className="block text-xl font-extrabold text-blue-600 dark:text-blue-400">{formatCurrency(budgetStats.total_used)}</span>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-100 dark:border-gray-700">
                                        <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">Remaining Balance</span>
                                        <span className={`block text-xl font-extrabold ${budgetStats.remaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                            {formatCurrency(budgetStats.remaining)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- STATS CARDS --- */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-gray-500 dark:border-gray-400 transition-colors duration-300">
                            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Total Applications</h4>
                            <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{stats.total}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-yellow-500 dark:border-yellow-600 transition-colors duration-300">
                            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Pending Review</h4>
                            <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{stats.pending}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-green-500 dark:border-green-600 transition-colors duration-300">
                            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Approved</h4>
                            <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{stats.approved}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-red-500 dark:border-red-600 transition-colors duration-300">
                            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Rejected</h4>
                            <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{stats.rejected}</p>
                        </div>
                    </div>

                    {/* --- CHART SECTION --- */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8 transition-colors duration-300">
                        <div className="flex flex-col xl:flex-row justify-between items-center mb-6 gap-4">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Financial Release Trends</h3>
                            <div className="flex flex-wrap gap-2 items-center bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md border dark:border-gray-700">
                                {/* Filters */}
                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">From:</span>
                                    <input type="date" value={filterValues.start_date} onChange={(e) => handleFilterChange('start_date', e.target.value)} className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm py-1 px-2" />
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">To:</span>
                                    <input type="date" value={filterValues.end_date} onChange={(e) => handleFilterChange('end_date', e.target.value)} className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm py-1 px-2" />
                                </div>
                                <div className="flex items-center gap-1 border-l dark:border-gray-600 pl-2 ml-2">
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Loc:</span>
                                    <select value={filterValues.barangay} onChange={(e) => handleFilterChange('barangay', e.target.value)} className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm py-1 px-2 cursor-pointer">
                                        <option value="">All Roxas City</option>
                                        {allBarangays.map((brgy, index) => (<option key={index} value={brgy}>{brgy}</option>))}
                                    </select>
                                </div>
                                {(filterValues.start_date || filterValues.end_date || filterValues.barangay) && (
                                    <button onClick={() => { setFilterValues({ barangay: '', start_date: '', end_date: '' }); router.get(route('admin.dashboard')); }} className="text-xs text-red-600 dark:text-red-400 font-bold hover:underline ml-2">Clear</button>
                                )}
                            </div>
                        </div>
                        <div className="h-80 w-full relative"><Line options={options} data={data} /></div>
                    </div>

                    {/* --- BARANGAY STATS SECTION --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT COLUMN: Top Barangays Table */}
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg transition-colors duration-300">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Top Barangays by Allocation</h3>
                                <button
                                    onClick={() => setIsBarangayModalOpen(true)}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold hover:underline"
                                >
                                    View All Barangays &rarr;
                                </button>
                            </div>
                            <div className="p-6">
                                {barangayStats.length > 0 ? (
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Barangay</th>
                                                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Beneficiaries</th>
                                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Released</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {/* ONLY SHOW TOP 5 IN DASHBOARD WIDGET */}
                                            {barangayStats.slice(0, 5).map((item, index) => (
                                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.barangay}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">{item.total}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right font-bold">{formatCurrency(item.amount)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : <p className="text-gray-500 dark:text-gray-400 italic">No financial data available yet.</p>}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Program Overview */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg transition-colors duration-300">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Program Overview</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Financial monitoring ensures allocated budgets reach the correct beneficiaries efficiently.</p>
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Quick Stats</h4>
                                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                        <li className="flex justify-between"><span>Active Year:</span><span className="font-medium text-gray-900 dark:text-gray-200">{new Date().getFullYear()}</span></li>
                                        <li className="flex justify-between"><span>Avg. Assistance:</span><span className="font-medium text-gray-900 dark:text-gray-200">{stats.approved > 0 ? formatCurrency(stats.total_released / stats.approved) : '₱0.00'}</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- MODAL 1: SET BUDGET --- */}
                    {isBudgetModalOpen && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96 border dark:border-gray-700">
                                <h3 className="text-lg font-bold mb-4 text-indigo-900 dark:text-indigo-300">Set Monthly Budget</h3>
                                <form onSubmit={handleBudgetSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Amount (PHP)</label>
                                        <input
                                            type="number"
                                            className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
                                            value={budgetForm.data.amount}
                                            onChange={(e) => budgetForm.setData('amount', e.target.value)}
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button type="button" onClick={() => setIsBudgetModalOpen(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
                                        <button type="submit" disabled={budgetForm.processing} className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* --- MODAL 2: VIEW ALL BARANGAYS (DRILL-DOWN) --- */}
                    {isBarangayModalOpen && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center z-50 px-4">
                            <div className="bg-white dark:bg-gray-800 p-0 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                                {/* Modal Header */}
                                <div className="p-6 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Barangay Allocation Report</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Complete breakdown of assistance released by location.</p>
                                    </div>
                                    <button onClick={() => setIsBarangayModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>

                                {/* Modal Body (Scrollable Table) */}
                                <div className="flex-1 overflow-y-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-100 dark:bg-gray-900/50">
                                            <tr>
                                                <th className="sticky top-0 z-20 bg-gray-100 dark:bg-gray-800 px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider shadow-sm border-b border-gray-200 dark:border-gray-700">
                                                    Rank
                                                </th>
                                                <th className="sticky top-0 z-20 bg-gray-100 dark:bg-gray-800 px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider shadow-sm border-b border-gray-200 dark:border-gray-700">
                                                    Barangay
                                                </th>
                                                <th className="sticky top-0 z-20 bg-gray-100 dark:bg-gray-800 px-6 py-4 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider shadow-sm border-b border-gray-200 dark:border-gray-700">
                                                    Beneficiaries
                                                </th>
                                                <th className="sticky top-0 z-20 bg-gray-100 dark:bg-gray-800 px-6 py-4 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider shadow-sm border-b border-gray-200 dark:border-gray-700">
                                                    Total Released
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {barangayStats.map((item, index) => (
                                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">#{index + 1}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.barangay}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <Link
                                                            href={route('admin.applications.index', { barangay: item.barangay })}
                                                            className="inline-flex items-center justify-center px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-bold rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition cursor-pointer"
                                                            title={`View all applicants from ${item.barangay}`}
                                                        >
                                                            {item.total}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right font-bold">{formatCurrency(item.amount)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Modal Footer */}
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 flex justify-end">
                                    <button
                                        onClick={() => setIsBarangayModalOpen(false)}
                                        className="px-6 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition shadow-sm"
                                    >
                                        Close Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
