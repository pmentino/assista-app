import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { pickBy } from 'lodash';
import Pagination from '@/Components/Pagination';

// --- HELPER COMPONENTS ---

const SortArrow = ({ direction }) => {
    if (direction === 'asc') return <span className="ml-1 text-blue-600 dark:text-blue-400">↑</span>;
    if (direction === 'desc') return <span className="ml-1 text-blue-600 dark:text-blue-400">↓</span>;
    return <span className="ml-1 text-gray-300 dark:text-gray-600">↕</span>;
};

const SortableHeader = ({ label, columnName, sortBy, sortDirection }) => {
    const isCurrentSort = sortBy === columnName;
    const newDirection = isCurrentSort && sortDirection === 'asc' ? 'desc' : 'asc';

    const handleSort = (e) => {
        e.preventDefault();
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('sort_by', columnName);
        currentParams.set('sort_direction', newDirection);

        router.get(route('staff.applications.index'), Object.fromEntries(currentParams.entries()), {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    };

    return (
        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors select-none group whitespace-nowrap" onClick={handleSort}>
            <div className="flex items-center">
                <span className={`group-hover:text-blue-600 dark:group-hover:text-blue-400 ${isCurrentSort ? 'text-blue-600 dark:text-blue-400' : ''}`}>{label}</span>
                <SortArrow direction={isCurrentSort ? sortDirection : null} />
            </div>
        </th>
    );
};

// --- MAIN COMPONENT ---
// FIX: Added 'allBarangays' and 'programs' to props
export default function ApplicationsIndex({ auth, applications, filters: initialFilters = {}, sort_by: initialSortBy, sort_direction: initialSortDirection, allBarangays, programs }) {

    const [filters, setFilters] = useState({
        status: initialFilters.status || '',
        program: initialFilters.program || '',
        search: initialFilters.search || '',
        barangay: initialFilters.barangay || '', // <--- Added Barangay State
    });

    const isFirstRun = useRef(true);

    // Debounced Search Logic
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        const timer = setTimeout(() => {
            const query = pickBy(filters);
            const currentParams = new URLSearchParams(window.location.search);
            const sortBy = currentParams.get('sort_by') || initialSortBy;
            const sortDirection = currentParams.get('sort_direction') || initialSortDirection;

            router.get(route('staff.applications.index'), { ...query, sort_by: sortBy, sort_direction: sortDirection }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
            case 'Rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
            default: return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
        }
    };

    // Ensure we handle both paginated (.data) and flat arrays gracefully
    const appList = applications?.data || applications || [];

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="font-bold text-2xl text-gray-800 dark:text-white leading-tight">All Applications</h2>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs font-bold rounded-full">
                        {applications?.total || appList.length} Records
                    </span>
                </div>
            }
        >
            <Head title="Applications List" />

            <div className="py-6 md:py-10 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* --- MAIN CARD --- */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">

                        {/* --- DRILL-DOWN BANNER --- */}
                        {filters.barangay && (
                            <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 flex justify-between items-center">
                                <div className="flex items-center">
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        Showing applicants from <strong>{filters.barangay}</strong>
                                    </p>
                                </div>
                                <button
                                    onClick={() => setFilters(prev => ({ ...prev, barangay: '' }))}
                                    className="text-sm text-blue-700 dark:text-blue-400 font-bold hover:underline hover:text-blue-900 dark:hover:text-blue-200"
                                >
                                    Clear Filter
                                </button>
                            </div>
                        )}

                        {/* --- TOOLBAR SECTION (UPDATED LAYOUT) --- */}
                        <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

                            {/* 1. Search (3 cols) */}
                            <div className="col-span-1 md:col-span-3 relative">
                                <input
                                    type="text"
                                    name="search"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    placeholder="Search by Name or ID..."
                                    className="block w-full pl-4 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition h-10"
                                />
                            </div>

                            {/* 2. Status (2 cols) */}
                            <div className="col-span-1 md:col-span-2">
                                <select
                                    name="status"
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                    className="block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm cursor-pointer h-10"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="Pending">Pending Review</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>

                            {/* 3. Program (3 cols) */}
                            <div className="col-span-1 md:col-span-3">
                                <select
                                    name="program"
                                    value={filters.program}
                                    onChange={handleFilterChange}
                                    className="block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm cursor-pointer h-10"
                                >
                                    <option value="">All Programs</option>
                                    {programs && programs.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>

                            {/* 4. NEW: Barangay Filter (3 Cols) */}
                            <div className="col-span-1 md:col-span-3">
                                <select
                                    name="barangay"
                                    value={filters.barangay}
                                    onChange={handleFilterChange}
                                    className="block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm cursor-pointer h-10"
                                >
                                    <option value="">All Barangays</option>
                                    {allBarangays && allBarangays.map((bgy) => (
                                        <option key={bgy} value={bgy}>{bgy}</option>
                                    ))}
                                </select>
                            </div>

                            {/* 5. Reset Button (1 col) */}
                            <div className="col-span-1 text-right md:text-center">
                                {(filters.search || filters.status || filters.program || filters.barangay) && (
                                    <button
                                        onClick={() => setFilters({ search: '', status: '', program: '', barangay: '' })}
                                        className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 font-bold underline transition"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* --- DATA TABLE --- */}
                        <div className="overflow-x-auto w-full">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <SortableHeader label="ID" columnName="id" sortBy={initialSortBy} sortDirection={initialSortDirection} />
                                        <SortableHeader label="Applicant Name" columnName="first_name" sortBy={initialSortBy} sortDirection={initialSortDirection} />
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Assistance Type</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Barangay</th>
                                        <SortableHeader label="Status" columnName="status" sortBy={initialSortBy} sortDirection={initialSortDirection} />
                                        <SortableHeader label="Submitted On" columnName="created_at" sortBy={initialSortBy} sortDirection={initialSortDirection} />
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {/* FIX: Use appList here, which is safe */}
                                    {appList.length > 0 ? (
                                        appList.map((app) => (
                                            <tr key={app.id} className="hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                                                    #{String(app.id).padStart(5, '0')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-200 font-bold text-xs mr-3 shrink-0">
                                                            {app.first_name?.[0]}{app.last_name?.[0]}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-gray-900 dark:text-white">{app.first_name} {app.last_name}</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">{app.email || 'No email'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                    {app.program}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                    {app.barangay}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${getStatusColor(app.status)}`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(app.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link
                                                        href={route('staff.applications.show', app.id)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-200 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none transition ease-in-out duration-150"
                                                    >
                                                        Review
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center">
                                                <p className="text-gray-500 dark:text-gray-400 text-lg">No applications match your search.</p>
                                                <button
                                                    onClick={() => setFilters({ search: '', status: '', program: '', barangay: '' })}
                                                    className="mt-2 text-blue-600 dark:text-blue-400 hover:underline font-bold text-sm"
                                                >
                                                    Clear Filters
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* --- PAGINATION --- */}
                        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            {/* Only show pagination if links exist */}
                            {applications?.links && <Pagination links={applications.links} />}
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
