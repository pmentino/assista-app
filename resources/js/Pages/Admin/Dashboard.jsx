import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, Link } from '@inertiajs/react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, BarElement, ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useState, useEffect, useRef } from 'react';
import { pickBy } from 'lodash';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, BarElement, ArcElement);

export default function Dashboard({ auth, stats, budgetStats, chartData, barangayStats, allBarangays, filters, pendingApplications = [], programs, queueFilters = {} }) {
    const user = auth?.user || { name: 'Admin' };

    // --- STATE MANAGEMENT ---
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [isBarangayModalOpen, setIsBarangayModalOpen] = useState(false);

    // 1. Queue Filters State (Action Center)
    const [qFilters, setQFilters] = useState({
        q_search: queueFilters.q_search || '',
        q_program: queueFilters.q_program || '',
        q_sort: queueFilters.q_sort || 'oldest',
    });

    // 2. Main Filters State (For Charts/Global)
    const [filterValues, setFilterValues] = useState({
        barangay: filters.barangay || '',
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
    });

    const isFirstRun = useRef(true);

    // --- FILTER LOGIC ---
    // Combined function to apply both sets of filters
    const applyFilters = (newQFilters, newMainFilters) => {
        const query = pickBy({ ...newMainFilters, ...newQFilters }); // Merge both filter sets
        router.get(route('admin.dashboard'), query, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    // Watcher for Queue Filters (Debounced)
    useEffect(() => {
        if (isFirstRun.current) { isFirstRun.current = false; return; }
        const timer = setTimeout(() => applyFilters(qFilters, filterValues), 300);
        return () => clearTimeout(timer);
    }, [qFilters]);

    // Handle Queue Input Changes
    const handleQFilterChange = (e) => {
        setQFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Handle Main Filter Changes (Immediate)
    const handleFilterChange = (key, value) => {
        const newFilters = { ...filterValues, [key]: value };
        setFilterValues(newFilters);
        applyFilters(qFilters, newFilters);
    };

    // --- HELPERS ---
    const budgetForm = useForm({ amount: budgetStats?.total_budget || '' });
    const formatCurrency = (amount) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount || 0);
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const handleBudgetSubmit = (e) => {
        e.preventDefault();
        budgetForm.post(route('admin.dashboard.budget'), { onSuccess: () => setIsBudgetModalOpen(false) });
    };

    // --- CHART CONFIG ---

    // Line Chart Data
    const lineChartData = {
        labels: chartData.labels || [],
        datasets: [{
            label: 'Amount Released (PHP)',
            data: chartData.values || [],
            fill: true,
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgb(37, 99, 235)',
            tension: 0.4,
        }],
    };

    // Bar Chart Data (Top 5 Barangays)
    const topBarangays = barangayStats.slice(0, 5);
    const barChartData = {
        labels: topBarangays.map(b => b.barangay),
        datasets: [{
            label: 'Beneficiaries',
            data: topBarangays.map(b => b.total),
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
            ],
            borderRadius: 5,
        }]
    };

    // Doughnut Chart Data (Application Status)
    const doughnutChartData = {
        labels: ['Approved', 'Pending', 'Rejected'],
        datasets: [{
            data: [stats.approved, stats.pending, stats.rejected],
            backgroundColor: [
                'rgb(34, 197, 94)',  // Green (Approved)
                'rgb(234, 179, 8)',  // Yellow (Pending)
                'rgb(239, 68, 68)',  // Red (Rejected)
            ],
            hoverOffset: 4
        }]
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { color: '#9ca3af' } },
            tooltip: { callbacks: { label: function(context) { return formatCurrency(context.raw); } } }
        },
        scales: {
            y: { beginAtZero: true, ticks: { color: '#9ca3af' }, grid: { color: 'rgba(156, 163, 175, 0.1)' } },
            x: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(156, 163, 175, 0.1)' } }
        }
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af' } } },
        scales: { y: { display: false }, x: { display: false } }
    };


    return (
        <AuthenticatedLayout user={user} header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Executive Dashboard</h2>}>
            <Head title="Admin Dashboard" />

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

                        {/* Header & Filters */}
                        <div className="bg-amber-50 dark:bg-amber-900/20 px-6 py-4 border-b border-amber-200 dark:border-amber-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    Verification Queue
                                </h3>
                                <p className="text-xs text-amber-700 dark:text-amber-500">
                                    {stats.pending} items pending. Prioritize oldest first.
                                </p>
                            </div>

                            {/* --- NEW: QUEUE FILTERS TOOLBAR --- */}
                            <div className="flex flex-wrap gap-2 w-full md:w-auto">
                                <input
                                    type="text"
                                    name="q_search"
                                    value={qFilters.q_search}
                                    onChange={handleQFilterChange}
                                    placeholder="Search Name/ID..."
                                    className="text-xs border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md h-9 focus:ring-amber-500 focus:border-amber-500"
                                />
                                <select
                                    name="q_program"
                                    value={qFilters.q_program}
                                    onChange={handleQFilterChange}
                                    className="text-xs border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md h-9 focus:ring-amber-500 focus:border-amber-500 cursor-pointer"
                                >
                                    <option value="">All Programs</option>
                                    {programs && programs.map((p) => <option key={p} value={p}>{p}</option>)}
                                </select>
                                <select
                                    name="q_sort"
                                    value={qFilters.q_sort}
                                    onChange={handleQFilterChange}
                                    className="text-xs border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md h-9 focus:ring-amber-500 focus:border-amber-500 cursor-pointer"
                                >
                                    <option value="oldest">Sort: Oldest First (FIFO)</option>
                                    <option value="newest">Sort: Newest First</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-0">
                            {/* FIX: Check length directly on array, not .data */}
                            {pendingApplications && pendingApplications.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Queue ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Applicant Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Program</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Submitted</th>
                                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {pendingApplications.map((app, index) => (
                                            <tr key={index} className="hover:bg-amber-50 dark:hover:bg-amber-900/10 transition">
                                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400 dark:text-gray-500 font-mono">
                                                    #{String(app.id).padStart(5, '0')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-white">{app.first_name} {app.last_name}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{app.barangay}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                                        {app.program}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {formatDate(app.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link
                                                        href={route('admin.applications.show', app.id)}
                                                        className="text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-4 py-2 rounded shadow-sm text-xs font-bold transition uppercase tracking-wide"
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
                                    <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">No pending applications found matching criteria.</p>
                                </div>
                            )}
                            <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                                <Link href={route('admin.applications.index', { status: 'Pending' })} className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                                    View Full Applications List &rarr;
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
                                        <span className="block text-gray-50 dark:text-gray-400 text-xs uppercase font-bold">Allocated Budget</span>
                                        <span className="block text-xl font-extrabold text-gray-800 dark:text-white">{formatCurrency(budgetStats.total_budget)}</span>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-100 dark:border-gray-700">
                                        <span className="block text-gray-50 dark:text-gray-400 text-xs uppercase font-bold">Total Released</span>
                                        <span className="block text-xl font-extrabold text-blue-600 dark:text-blue-400">{formatCurrency(budgetStats.total_used)}</span>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-100 dark:border-gray-700">
                                        <span className="block text-gray-50 dark:text-gray-400 text-xs uppercase font-bold">Remaining Balance</span>
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

                    {/* --- NEW: CHARTS ROW (VISUAL CANDY) --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                        {/* CHART A: FINANCIAL TRENDS (LINE CHART) - 2/3 Width */}
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-300">
                            <div className="flex flex-col xl:flex-row justify-between items-center mb-6 gap-4">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Financial Trends</h3>
                                {/* Date Filters */}
                                <div className="flex flex-wrap gap-2 items-center bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md border dark:border-gray-700">
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
                            <div className="h-64 w-full relative"><Line options={commonOptions} data={lineChartData} /></div>
                        </div>

                        {/* CHART B: STATUS BREAKDOWN (DOUGHNUT CHART) - 1/3 Width */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center transition-colors duration-300">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 w-full text-left">Application Status</h3>
                            <div className="h-56 w-56 relative">
                                <Doughnut data={doughnutChartData} options={doughnutOptions} />
                                {/* Center Text Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-center mt-2">
                                        <span className="block text-3xl font-bold text-gray-800 dark:text-white">{stats.total}</span>
                                        <span className="text-xs text-gray-500 uppercase">Total</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- SECONDARY CHARTS ROW --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                        {/* CHART C: TOP BARANGAYS (BAR CHART) */}
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Top 5 Barangays (Beneficiaries)</h3>
                                <button onClick={() => setIsBarangayModalOpen(true)} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold hover:underline">
                                    View Full Data &rarr;
                                </button>
                            </div>
                            <div className="h-64 w-full relative">
                                <Bar options={commonOptions} data={barChartData} />
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Program Overview (Text) */}
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
                                <div className="p-6 bg-gray-5 dark:bg-gray-800 border-b dark:border-gray-700 flex justify-between items-center">
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
                                <div className="p-4 bg-gray-5 dark:bg-gray-800 border-t dark:border-gray-700 flex justify-end">
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
