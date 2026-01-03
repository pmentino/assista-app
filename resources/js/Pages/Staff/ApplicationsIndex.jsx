import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { pickBy } from 'lodash';
import Pagination from '@/Components/Pagination';

// --- HELPER COMPONENTS ---

const SortArrow = ({ direction }) => {
    if (direction === 'asc') return <span className="ml-1 text-blue-600">↑</span>;
    if (direction === 'desc') return <span className="ml-1 text-blue-600">↓</span>;
    return <span className="ml-1 text-gray-300">↕</span>;
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
        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none group whitespace-nowrap" onClick={handleSort}>
            <div className="flex items-center">
                <span className={`group-hover:text-blue-600 ${isCurrentSort ? 'text-blue-600' : ''}`}>{label}</span>
                <SortArrow direction={isCurrentSort ? sortDirection : null} />
            </div>
        </th>
    );
};

// --- MAIN COMPONENT ---

export default function ApplicationsIndex({ auth, applications, filters: initialFilters = {}, sort_by: initialSortBy, sort_direction: initialSortDirection }) {

    const [filters, setFilters] = useState({
        status: initialFilters.status || '',
        program: initialFilters.program || '',
        search: initialFilters.search || '',
        barangay: initialFilters.barangay || '',
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
            case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    // Ensure we handle both paginated (.data) and flat arrays gracefully
    const appList = applications?.data || applications || [];

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="font-bold text-2xl text-gray-800 leading-tight">All Applications</h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                        {applications?.total || appList.length} Records
                    </span>
                </div>
            }
        >
            <Head title="Applications List" />

            <div className="py-6 md:py-10 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* --- MAIN CARD --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                        {/* --- DRILL-DOWN BANNER --- */}
                        {filters.barangay && (
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 flex justify-between items-center">
                                <div className="flex items-center">
                                    <p className="text-sm text-blue-700">
                                        Showing applicants from <strong>{filters.barangay}</strong>
                                    </p>
                                </div>
                                <button
                                    onClick={() => setFilters(prev => ({ ...prev, barangay: '' }))}
                                    className="text-sm text-blue-700 font-bold hover:underline hover:text-blue-900"
                                >
                                    Clear Filter
                                </button>
                            </div>
                        )}

                        {/* --- TOOLBAR SECTION --- */}
                        <div className="p-5 border-b border-gray-100 bg-white grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

                            {/* Search Bar */}
                            <div className="col-span-1 md:col-span-5 relative">
                                <input
                                    type="text"
                                    name="search"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    placeholder="Search by Name or ID..."
                                    className="block w-full pl-4 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition h-10"
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="col-span-1 md:col-span-3">
                                <select
                                    name="status"
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                    className="block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm cursor-pointer h-10"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="Pending">Pending Review</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>

                            {/* Program Filter */}
                            <div className="col-span-1 md:col-span-3">
                                <select
                                    name="program"
                                    value={filters.program}
                                    onChange={handleFilterChange}
                                    className="block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm cursor-pointer h-10"
                                >
                                    <option value="">All Programs</option>
                                    <option value="Hospitalization">Hospitalization</option>
                                    <option value="Laboratory Tests">Laboratory Tests</option>
                                    <option value="Anti-Rabies Vaccine Treatment">Anti-Rabies Vaccine</option>
                                    <option value="Medicine Assistance">Medicine Assistance</option>
                                    <option value="Funeral Assistance">Funeral Assistance</option>
                                    <option value="Chemotherapy">Chemotherapy</option>
                                    <option value="Diagnostic Blood Tests">Diagnostic Blood Tests</option>
                                </select>
                            </div>

                            {/* Reset Button */}
                            <div className="col-span-1 text-right md:text-center">
                                {(filters.search || filters.status || filters.program || filters.barangay) && (
                                    <button
                                        onClick={() => setFilters({ search: '', status: '', program: '', barangay: '' })}
                                        className="text-sm text-red-600 hover:text-red-800 font-bold underline transition"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* --- DATA TABLE --- */}
                        <div className="overflow-x-auto w-full">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <SortableHeader label="ID" columnName="id" sortBy={initialSortBy} sortDirection={initialSortDirection} />
                                        <SortableHeader label="Applicant Name" columnName="first_name" sortBy={initialSortBy} sortDirection={initialSortDirection} />
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Assistance Type</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Barangay</th>
                                        <SortableHeader label="Status" columnName="status" sortBy={initialSortBy} sortDirection={initialSortDirection} />
                                        <SortableHeader label="Submitted On" columnName="created_at" sortBy={initialSortBy} sortDirection={initialSortDirection} />
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {/* FIX: Use appList here, which is safe */}
                                    {appList.length > 0 ? (
                                        appList.map((app) => (
                                            <tr key={app.id} className="hover:bg-blue-50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                                    #{String(app.id).padStart(5, '0')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs mr-3 shrink-0">
                                                            {app.first_name?.[0]}{app.last_name?.[0]}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-gray-900">{app.first_name} {app.last_name}</div>
                                                            <div className="text-xs text-gray-500">{app.email || 'No email'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {app.program}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {app.barangay}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${getStatusColor(app.status)}`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(app.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link
                                                        href={route('staff.applications.show', app.id)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 hover:text-blue-600 focus:outline-none transition ease-in-out duration-150"
                                                    >
                                                        Review
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center">
                                                <p className="text-gray-500 text-lg">No applications match your search.</p>
                                                <button
                                                    onClick={() => setFilters({ search: '', status: '', program: '', barangay: '' })}
                                                    className="mt-2 text-blue-600 hover:underline font-bold text-sm"
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
                        <div className="p-4 border-t border-gray-100 bg-gray-50">
                            {/* Only show pagination if links exist */}
                            {applications?.links && <Pagination links={applications.links} />}
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
