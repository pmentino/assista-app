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

        router.get(route('admin.applications.index'), Object.fromEntries(currentParams.entries()), {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    };

    return (
        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none group" onClick={handleSort}>
            <div className="flex items-center">
                <span className={`group-hover:text-blue-600 ${isCurrentSort ? 'text-blue-600' : ''}`}>{label}</span>
                <SortArrow direction={isCurrentSort ? sortDirection : null} />
            </div>
        </th>
    );
};

// --- MAIN COMPONENT ---

export default function ApplicationsIndex({ applications, filters: initialFilters = {}, sort_by: initialSortBy, sort_direction: initialSortDirection }) {
    const { auth } = usePage().props;

    const [filters, setFilters] = useState({
        status: initialFilters.status || '',
        program: initialFilters.program || '',
        search: initialFilters.search || '',
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

            router.get(route('admin.applications.index'), { ...query, sort_by: sortBy, sort_direction: sortDirection }, {
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

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-2xl text-gray-800 leading-tight">Manage Applications</h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                        {applications.total} Records
                    </span>
                </div>
            }
        >
            <Head title="Manage Applications" />

            <div className="py-10 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* --- MAIN CARD --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                        {/* --- TOOLBAR SECTION --- */}
                        <div className="p-5 border-b border-gray-100 bg-white grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

                            {/* Search Bar (Spans 5 columns) */}
                            <div className="md:col-span-5 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    name="search"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    placeholder="Search by Applicant Name or ID..."
                                    className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition"
                                />
                            </div>

                            {/* Status Filter (Spans 3 columns) */}
                            <div className="md:col-span-3">
                                <select
                                    name="status"
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                    className="block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm cursor-pointer"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="Pending">Pending Review</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>

                            {/* Program Filter (Spans 3 columns) */}
                            <div className="md:col-span-3">
                                <select
                                    name="program"
                                    value={filters.program}
                                    onChange={handleFilterChange}
                                    className="block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm cursor-pointer"
                                >
                                    <option value="">All Programs</option>
                                    <option value="Medical Assistance">Medical Assistance</option>
                                    <option value="Financial Assistance">Financial Assistance</option>
                                    <option value="Burial Assistance">Burial Assistance</option>
                                    <option value="Educational Assistance">Educational Assistance</option>
                                    <option value="Food Assistance">Food Assistance</option>
                                </select>
                            </div>

                            {/* Reset Button (Spans 1 column) */}
                            <div className="md:col-span-1 text-right">
                                {(filters.search || filters.status || filters.program) && (
                                    <button
                                        onClick={() => setFilters({ search: '', status: '', program: '' })}
                                        className="text-sm text-red-600 hover:text-red-800 font-bold underline transition"
                                        title="Clear all filters"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* --- DATA TABLE --- */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <SortableHeader label="ID" columnName="id" sortBy={initialSortBy} sortDirection={initialSortDirection} />
                                        <SortableHeader label="Applicant Name" columnName="first_name" sortBy={initialSortBy} sortDirection={initialSortDirection} />
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Assistance Type</th>
                                        <SortableHeader label="Status" columnName="status" sortBy={initialSortBy} sortDirection={initialSortDirection} />
                                        <SortableHeader label="Submitted On" columnName="created_at" sortBy={initialSortBy} sortDirection={initialSortDirection} />
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {applications.data.length > 0 ? (
                                        applications.data.map((app) => (
                                            <tr key={app.id} className="hover:bg-blue-50 transition-colors duration-150">

                                                {/* ID */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                                    #{String(app.id).padStart(5, '0')}
                                                </td>

                                                {/* Name + Email */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs mr-3">
                                                            {app.first_name[0]}{app.last_name[0]}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-gray-900">{app.first_name} {app.last_name}</div>
                                                            <div className="text-xs text-gray-500">{app.email || 'No email provided'}</div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Program */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {app.program}
                                                </td>

                                                {/* Status Badge */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${
                                                        app.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
                                                        app.status === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                                                        'bg-yellow-100 text-yellow-800 border-yellow-200'
                                                    }`}>
                                                        {app.status}
                                                    </span>
                                                </td>

                                                {/* Date */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(app.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    <span className="block text-xs text-gray-400">
                                                        {new Date(app.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </td>

                                                {/* Action Button */}
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link
                                                        href={route('admin.applications.show', app.id)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                                    >
                                                        Review
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <svg className="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <p className="text-gray-500 text-lg">No applications match your search.</p>
                                                    <button
                                                        onClick={() => setFilters({ search: '', status: '', program: '' })}
                                                        className="mt-2 text-blue-600 hover:underline font-bold text-sm"
                                                    >
                                                        Clear Filters
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* --- PAGINATION --- */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50">
                            <Pagination links={applications.links} />
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
