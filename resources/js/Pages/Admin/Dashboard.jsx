import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useState } from 'react'; // Added useState

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard({ auth, stats, chartData, barangayStats, allBarangays, filters }) {
    const user = auth?.user || { name: 'Admin' };

    // Local state for filters to avoid constant reloading while typing
    const [filterValues, setFilterValues] = useState({
        barangay: filters.barangay || '',
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount || 0);
    };

    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Amount Released (PHP)',
                data: chartData.values,
                fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: 'rgb(37, 99, 235)',
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Allows height adjustment
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return formatCurrency(context.raw);
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '₱' + value;
                    }
                }
            }
        }
    };

    // Generic handler to update filter and reload page
    const handleFilterChange = (key, value) => {
        const newFilters = { ...filterValues, [key]: value };
        setFilterValues(newFilters); // Update UI immediately

        // Trigger reload
        router.get(route('admin.dashboard'), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    return (
        <AuthenticatedLayout
            user={user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Executive Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Welcome */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-8">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-2xl font-bold text-blue-900">Welcome back, {user.name}!</h3>
                            <p className="text-gray-600">Financial and operational overview.</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
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

                    {/* Financial Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white p-6 rounded-lg shadow-lg">
                            <h4 className="text-xs font-bold uppercase opacity-75">Total Released (All Time)</h4>
                            <p className="text-2xl font-extrabold mt-2">{formatCurrency(stats.total_released)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex justify-between"><h4 className="text-xs font-bold text-gray-500 uppercase">This Month</h4><span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">Current</span></div>
                            <p className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(stats.released_month)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h4 className="text-xs font-bold text-gray-500 uppercase">This Week</h4>
                            <p className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(stats.released_week)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h4 className="text-xs font-bold text-gray-500 uppercase">Released Today</h4>
                            <p className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(stats.released_today)}</p>
                        </div>
                    </div>

                    {/* --- CHART SECTION (UPDATED) --- */}
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                        <div className="flex flex-col xl:flex-row justify-between items-center mb-6 gap-4">
                            <h3 className="text-lg font-bold text-gray-800">Financial Release Trends</h3>

                            {/* Filters Bar */}
                            <div className="flex flex-wrap gap-2 items-center bg-gray-50 p-2 rounded-md border">
                                {/* Start Date */}
                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-bold text-gray-500 uppercase">From:</span>
                                    <input
                                        type="date"
                                        value={filterValues.start_date}
                                        onChange={(e) => handleFilterChange('start_date', e.target.value)}
                                        className="border-gray-300 rounded text-sm py-1 px-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* End Date */}
                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-bold text-gray-500 uppercase">To:</span>
                                    <input
                                        type="date"
                                        value={filterValues.end_date}
                                        onChange={(e) => handleFilterChange('end_date', e.target.value)}
                                        className="border-gray-300 rounded text-sm py-1 px-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Barangay Filter */}
                                <div className="flex items-center gap-1 border-l pl-2 ml-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Loc:</span>
                                    <select
                                        value={filterValues.barangay}
                                        onChange={(e) => handleFilterChange('barangay', e.target.value)}
                                        className="border-gray-300 rounded text-sm py-1 px-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">All Roxas City</option>
                                        {allBarangays.map((brgy, index) => (
                                            <option key={index} value={brgy}>{brgy}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Clear Button */}
                                {(filterValues.start_date || filterValues.end_date || filterValues.barangay) && (
                                    <button
                                        onClick={() => {
                                            setFilterValues({ barangay: '', start_date: '', end_date: '' });
                                            router.get(route('admin.dashboard'));
                                        }}
                                        className="text-xs text-red-600 font-bold hover:underline ml-2"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="h-80 w-full relative">
                            <Line options={options} data={data} />
                        </div>
                    </div>

                    {/* Barangay Stats (Same as before) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-bold text-gray-800">Top Barangays by Allocation</h3>
                            </div>
                            <div className="p-6">
                                {barangayStats.length > 0 ? (
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Barangay</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Beneficiaries</th>
                                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Total Released</th>
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
                                    <p className="text-gray-500 italic">No financial data available yet.</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-bold text-gray-800">Program Overview</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-gray-500 mb-4">
                                    Financial monitoring ensures allocated budgets reach the correct beneficiaries efficiently.
                                </p>
                                <div className="border-t pt-4">
                                    <h4 className="text-sm font-bold text-gray-700 mb-2">Quick Stats</h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex justify-between">
                                            <span>Active Year:</span>
                                            <span className="font-medium">{new Date().getFullYear()}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Avg. Assistance:</span>
                                            <span className="font-medium">
                                                {stats.approved > 0
                                                    ? formatCurrency(stats.total_released / stats.approved)
                                                    : '₱0.00'}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
