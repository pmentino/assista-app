import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Dashboard({ auth, stats, budgetStats, chartData, barangayStats, allBarangays, filters }) {
    const user = auth?.user || { name: 'Admin' };

    // --- STATE MANAGEMENT ---
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [isBarangayModalOpen, setIsBarangayModalOpen] = useState(false); // <--- NEW MODAL STATE

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
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgb(37, 99, 235)',
            tension: 0.4,
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            tooltip: { callbacks: { label: function(context) { return formatCurrency(context.raw); } } }
        },
        scales: { y: { beginAtZero: true, ticks: { callback: function(value) { return '₱' + value; } } } }
    };

    return (
        <AuthenticatedLayout user={user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Executive Dashboard</h2>}>
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

                    {/* --- BUDGET MONITORING SECTION --- */}
                    {budgetStats && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-8 border-l-8 border-indigo-600">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-indigo-900 uppercase tracking-wide">
                                            Monthly Budget Utilization ({new Date().toLocaleString('default', { month: 'long' })})
                                        </h3>
                                        <p className="text-sm text-gray-500">Monitor fund usage to ensure sustainable assistance distribution.</p>
                                    </div>
                                    <button
                                        onClick={() => setIsBudgetModalOpen(true)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-2 px-4 rounded shadow transition"
                                    >
                                        Set / Update Budget
                                    </button>
                                </div>

                                <div className="relative pt-1">
                                    <div className="flex mb-2 items-center justify-between">
                                        <div>
                                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                                                {budgetStats.percentage.toFixed(1)}% Used
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-semibold inline-block text-gray-600">
                                                {formatCurrency(budgetStats.total_used)} / {formatCurrency(budgetStats.total_budget)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-indigo-200">
                                        <div
                                            style={{ width: `${Math.min(budgetStats.percentage, 100)}%` }}
                                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${budgetStats.percentage > 90 ? 'bg-red-500' : 'bg-indigo-500'}`}
                                        ></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                    <div className="p-4 bg-gray-50 rounded border border-gray-100">
                                        <span className="block text-gray-500 text-xs uppercase font-bold">Allocated Budget</span>
                                        <span className="block text-xl font-extrabold text-gray-800">{formatCurrency(budgetStats.total_budget)}</span>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded border border-gray-100">
                                        <span className="block text-gray-500 text-xs uppercase font-bold">Total Released</span>
                                        <span className="block text-xl font-extrabold text-blue-600">{formatCurrency(budgetStats.total_used)}</span>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded border border-gray-100">
                                        <span className="block text-gray-500 text-xs uppercase font-bold">Remaining Balance</span>
                                        <span className={`block text-xl font-extrabold ${budgetStats.remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {formatCurrency(budgetStats.remaining)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- STATS CARDS --- */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-gray-500">
                            <h4 className="text-xs font-bold text-gray-500 uppercase">Total Applications</h4>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
                            <h4 className="text-xs font-bold text-gray-500 uppercase">Pending Review</h4>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.pending}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                            <h4 className="text-xs font-bold text-gray-500 uppercase">Approved</h4>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.approved}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
                            <h4 className="text-xs font-bold text-gray-500 uppercase">Rejected</h4>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.rejected}</p>
                        </div>
                    </div>

                    {/* --- CHART SECTION --- */}
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                        <div className="flex flex-col xl:flex-row justify-between items-center mb-6 gap-4">
                            <h3 className="text-lg font-bold text-gray-800">Financial Release Trends</h3>
                            <div className="flex flex-wrap gap-2 items-center bg-gray-50 p-2 rounded-md border">
                                {/* Filters (Date/Barangay) */}
                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-bold text-gray-500 uppercase">From:</span>
                                    <input type="date" value={filterValues.start_date} onChange={(e) => handleFilterChange('start_date', e.target.value)} className="border-gray-300 rounded text-sm py-1 px-2" />
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-bold text-gray-500 uppercase">To:</span>
                                    <input type="date" value={filterValues.end_date} onChange={(e) => handleFilterChange('end_date', e.target.value)} className="border-gray-300 rounded text-sm py-1 px-2" />
                                </div>
                                <div className="flex items-center gap-1 border-l pl-2 ml-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Loc:</span>
                                    <select value={filterValues.barangay} onChange={(e) => handleFilterChange('barangay', e.target.value)} className="border-gray-300 rounded text-sm py-1 px-2">
                                        <option value="">All Roxas City</option>
                                        {allBarangays.map((brgy, index) => (<option key={index} value={brgy}>{brgy}</option>))}
                                    </select>
                                </div>
                                {(filterValues.start_date || filterValues.end_date || filterValues.barangay) && (
                                    <button onClick={() => { setFilterValues({ barangay: '', start_date: '', end_date: '' }); router.get(route('admin.dashboard')); }} className="text-xs text-red-600 font-bold hover:underline ml-2">Clear</button>
                                )}
                            </div>
                        </div>
                        <div className="h-80 w-full relative"><Line options={options} data={data} /></div>
                    </div>

                    {/* --- BARANGAY STATS SECTION --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT COLUMN: Top Barangays Table */}
                        <div className="lg:col-span-2 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800">Top Barangays by Allocation</h3>
                                {/* NEW VIEW ALL BUTTON */}
                                <button
                                    onClick={() => setIsBarangayModalOpen(true)}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-bold hover:underline"
                                >
                                    View All Barangays &rarr;
                                </button>
                            </div>
                            <div className="p-6">
                                {barangayStats.length > 0 ? (
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Barangay</th>
                                                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Beneficiaries</th>
                                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Total Released</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {/* ONLY SHOW TOP 5 IN DASHBOARD WIDGET */}
                                            {barangayStats.slice(0, 5).map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.barangay}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{item.total}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-bold">{formatCurrency(item.amount)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : <p className="text-gray-500 italic">No financial data available yet.</p>}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Program Overview */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-bold text-gray-800">Program Overview</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-gray-500 mb-4">Financial monitoring ensures allocated budgets reach the correct beneficiaries efficiently.</p>
                                <div className="border-t pt-4">
                                    <h4 className="text-sm font-bold text-gray-700 mb-2">Quick Stats</h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex justify-between"><span>Active Year:</span><span className="font-medium">{new Date().getFullYear()}</span></li>
                                        <li className="flex justify-between"><span>Avg. Assistance:</span><span className="font-medium">{stats.approved > 0 ? formatCurrency(stats.total_released / stats.approved) : '₱0.00'}</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- MODAL 1: SET BUDGET --- */}
                    {isBudgetModalOpen && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                                <h3 className="text-lg font-bold mb-4 text-indigo-900">Set Monthly Budget</h3>
                                <form onSubmit={handleBudgetSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Amount (PHP)</label>
                                        <input type="number" className="w-full border-gray-300 rounded-md" value={budgetForm.data.amount} onChange={(e) => budgetForm.setData('amount', e.target.value)} required min="0" />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button type="button" onClick={() => setIsBudgetModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                                        <button type="submit" disabled={budgetForm.processing} className="px-4 py-2 bg-indigo-600 text-white rounded font-bold">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* --- MODAL 2: VIEW ALL BARANGAYS (NEW) --- */}
                    {isBarangayModalOpen && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 px-4">
                            <div className="bg-white p-0 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                                {/* Modal Header */}
                                <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-extrabold text-gray-900">Barangay Allocation Report</h3>
                                        <p className="text-sm text-gray-500">Complete breakdown of assistance released by location.</p>
                                    </div>
                                    <button onClick={() => setIsBarangayModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>

                                {/* Modal Body (Scrollable Table) */}
                                {/* FIX: Removed 'p-6' here so header sticks to the very top edge */}
                                <div className="flex-1 overflow-y-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="sticky top-0 z-20 bg-gray-100 px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider shadow-sm border-b border-gray-200">
                                                    Rank
                                                </th>
                                                <th className="sticky top-0 z-20 bg-gray-100 px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider shadow-sm border-b border-gray-200">
                                                    Barangay
                                                </th>
                                                <th className="sticky top-0 z-20 bg-gray-100 px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider shadow-sm border-b border-gray-200">
                                                    Beneficiaries
                                                </th>
                                                <th className="sticky top-0 z-20 bg-gray-100 px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider shadow-sm border-b border-gray-200">
                                                    Total Released
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {barangayStats.map((item, index) => (
                                                <tr key={index} className="hover:bg-gray-50 transition">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">#{index + 1}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.barangay}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-bold">{item.total}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-bold">{formatCurrency(item.amount)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Modal Footer */}
                                <div className="p-4 bg-gray-50 border-t flex justify-end">
                                    <button
                                        onClick={() => setIsBarangayModalOpen(false)}
                                        className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition shadow-sm"
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
