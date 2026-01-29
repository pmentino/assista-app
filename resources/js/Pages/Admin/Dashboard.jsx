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

    // 1. Queue Filters State
    const [qFilters, setQFilters] = useState({
        q_search: queueFilters.q_search || '',
        q_program: queueFilters.q_program || '',
        q_sort: queueFilters.q_sort || 'oldest',
    });

    // 2. Main Filters State
    const [filterValues, setFilterValues] = useState({
        barangay: filters.barangay || '',
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
    });

    const isFirstRun = useRef(true);

    // --- FILTER LOGIC ---
    const applyFilters = (newQFilters, newMainFilters) => {
        const query = pickBy({ ...newMainFilters, ...newQFilters });
        router.get(route('admin.dashboard'), query, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    useEffect(() => {
        if (isFirstRun.current) { isFirstRun.current = false; return; }
        const timer = setTimeout(() => applyFilters(qFilters, filterValues), 300);
        return () => clearTimeout(timer);
    }, [qFilters]);

    const handleQFilterChange = (e) => setQFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
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

    // 1. LINE CHART (Currency Data)
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

    const currencyOptions = {
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

    // 2. BAR CHART (Count Data - FIX APPLIED)
    const topBarangays = barangayStats.slice(0, 5);
    const barChartData = {
        labels: topBarangays.map(b => b.barangay),
        datasets: [{
            label: 'Beneficiaries',
            data: topBarangays.map(b => b.total),
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)',
            ],
            borderRadius: 5,
        }]
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { color: '#9ca3af' } },
            tooltip: {
                callbacks: {
                    label: function(context) { return `${context.raw} Beneficiaries`; }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1, color: '#9ca3af' },
                grid: { color: 'rgba(156, 163, 175, 0.1)' }
            },
            x: { ticks: { color: '#9ca3af' }, grid: { display: false } }
        }
    };

    // 3. DOUGHNUT CHART
    const doughnutChartData = {
        labels: ['Approved', 'Pending', 'Rejected'],
        datasets: [{
            data: [stats.approved, stats.pending, stats.rejected],
            backgroundColor: ['rgb(34, 197, 94)', 'rgb(234, 179, 8)', 'rgb(239, 68, 68)'],
            hoverOffset: 4
        }]
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

                    {/* --- ACTION CENTER (MOVED TO TOP) --- */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-8 border border-amber-200 dark:border-amber-900/50 transition-colors duration-300">
                        <div className="bg-amber-50 dark:bg-amber-900/20 px-6 py-4 border-b border-amber-200 dark:border-amber-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    Verification Queue (Pending Works)
                                </h3>
                                <p className="text-xs text-amber-700 dark:text-amber-500">
                                    {stats.pending} items requiring your attention.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 w-full md:w-auto">
                                <input type="text" name="q_search" value={qFilters.q_search} onChange={handleQFilterChange} placeholder="Search Name/ID..." className="text-xs border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md h-9 focus:ring-amber-500 focus:border-amber-500" />
                                <select name="q_program" value={qFilters.q_program} onChange={handleQFilterChange} className="text-xs border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md h-9 focus:ring-amber-500 focus:border-amber-500 cursor-pointer">
                                    <option value="">All Programs</option>
                                    {programs && programs.map((p) => <option key={p} value={p}>{p}</option>)}
                                </select>
                                <select name="q_sort" value={qFilters.q_sort} onChange={handleQFilterChange} className="text-xs border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md h-9 focus:ring-amber-500 focus:border-amber-500 cursor-pointer">
                                    <option value="oldest">Sort: Oldest First</option>
                                    <option value="newest">Sort: Newest First</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-0">
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

                    {/* STATS CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-gray-500 dark:border-gray-400">
                            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Total Applications</h4>
                            <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{stats.total}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-yellow-500 dark:border-yellow-600">
                            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Pending Review</h4>
                            <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{stats.pending}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-green-500 dark:border-green-600">
                            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Approved</h4>
                            <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{stats.approved}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-red-500 dark:border-red-600">
                            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Rejected</h4>
                            <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{stats.rejected}</p>
                        </div>
                    </div>

                    {/* CHARTS ROW */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* LINE CHART */}
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                            <div className="flex flex-col xl:flex-row justify-between items-center mb-6 gap-4">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Financial Trends</h3>
                                {/* Date Filters */}
                                <div className="flex flex-wrap gap-2 items-center bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md border dark:border-gray-700">
                                    <input type="date" value={filterValues.start_date} onChange={(e) => handleFilterChange('start_date', e.target.value)} className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm py-1 px-2" />
                                    <input type="date" value={filterValues.end_date} onChange={(e) => handleFilterChange('end_date', e.target.value)} className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm py-1 px-2" />
                                </div>
                            </div>
                            <div className="h-64 w-full relative"><Line options={currencyOptions} data={lineChartData} /></div>
                        </div>

                        {/* DOUGHNUT CHART */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 w-full text-left">Application Status</h3>
                            <div className="h-56 w-56 relative">
                                <Doughnut data={doughnutChartData} options={doughnutOptions} />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-center mt-2">
                                        <span className="block text-3xl font-bold text-gray-800 dark:text-white">{stats.total}</span>
                                        <span className="text-xs text-gray-500 uppercase">Total</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECONDARY CHARTS ROW */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* BAR CHART */}
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Top 5 Barangays (Beneficiaries)</h3>
                                <button onClick={() => setIsBarangayModalOpen(true)} className="text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline">
                                    View Full Data &rarr;
                                </button>
                            </div>
                            <div className="h-64 w-full relative">
                                <Bar options={barOptions} data={barChartData} />
                            </div>
                        </div>

                        {/* BUDGET OVERVIEW */}
                        {budgetStats && (
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border-l-8 border-indigo-600 dark:border-indigo-500">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300">Budget Utilization</h3>
                                        <button onClick={() => setIsBudgetModalOpen(true)} className="bg-indigo-600 text-white text-xs font-bold py-1 px-3 rounded">Set Budget</button>
                                    </div>
                                    <div className="mb-4">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span>{budgetStats.percentage.toFixed(1)}% Used</span>
                                            <span>{formatCurrency(budgetStats.total_used)} / {formatCurrency(budgetStats.total_budget)}</span>
                                        </div>
                                        <div className="overflow-hidden h-3 text-xs flex rounded bg-indigo-200 dark:bg-indigo-900">
                                            <div style={{ width: `${Math.min(budgetStats.percentage, 100)}%` }} className="bg-indigo-500"></div>
                                        </div>
                                    </div>
                                    <div className="border-t pt-4 mt-4">
                                        <p className="text-xs text-gray-500">Remaining Balance</p>
                                        <p className={`text-2xl font-extrabold ${budgetStats.remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                            {formatCurrency(budgetStats.remaining)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* MODALS */}
                    {isBudgetModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded shadow-lg w-96">
                                <h3 className="font-bold mb-4">Set Monthly Budget</h3>
                                <form onSubmit={handleBudgetSubmit}>
                                    <input type="number" value={budgetForm.data.amount} onChange={e => budgetForm.setData('amount', e.target.value)} className="w-full border p-2 mb-4 rounded" />
                                    <div className="flex justify-end gap-2">
                                        <button type="button" onClick={() => setIsBudgetModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {isBarangayModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white dark:bg-gray-800 p-0 rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[80vh]">
                                <div className="p-4 border-b flex justify-between">
                                    <h3 className="font-bold text-lg dark:text-white">Barangay Allocation Report</h3>
                                    <button onClick={() => setIsBarangayModalOpen(false)} className="text-gray-500">✕</button>
                                </div>
                                <div className="overflow-y-auto p-0">
                                    <table className="min-w-full divide-y">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500">Rank</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500">Barangay</th>
                                                <th className="px-6 py-3 text-center text-xs font-bold uppercase text-gray-500">Beneficiaries</th>
                                                <th className="px-6 py-3 text-right text-xs font-bold uppercase text-gray-500">Total Released</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y">
                                            {barangayStats.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 text-sm text-gray-500">#{index + 1}</td>
                                                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{item.barangay}</td>
                                                    <td className="px-6 py-4 text-center text-sm">
                                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">{item.total}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(item.amount)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
