import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { pickBy } from 'lodash';
import Pagination from '@/Components/Pagination';

// Sorting Helper
const SortArrow = ({ direction }) => {
    if (direction === 'asc') return <span>&uarr;</span>;
    if (direction === 'desc') return <span>&darr;</span>;
    return null;
};

// Sortable Header Helper
const SortableHeader = ({ label, columnName, sortBy, sortDirection }) => {
    const isCurrentSort = sortBy === columnName;
    const newDirection = isCurrentSort && sortDirection === 'asc' ? 'desc' : 'asc';
    const currentParams = new URLSearchParams(window.location.search);

    const handleSort = (e) => {
        e.preventDefault();
        currentParams.set('sort_by', columnName);
        currentParams.set('sort_direction', newDirection);
        router.get(route('admin.applications.index'), Object.fromEntries(currentParams.entries()), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
            <a href="#" onClick={handleSort} className="flex items-center space-x-1">
                <span>{label}</span>
                {isCurrentSort && <SortArrow direction={sortDirection} />}
            </a>
        </th>
    );
};

export default function ApplicationsIndex({ applications, filters: initialFilters = {}, sort_by: initialSortBy, sort_direction: initialSortDirection }) {
    const { auth } = usePage().props;

    // We store the search term in state
    const [filters, setFilters] = useState({
        status: initialFilters.status || '',
        program: initialFilters.program || '',
        search: initialFilters.search || '', // <-- Added Search
    });

    // Use a ref to prevent the effect from running on the very first render if you like,
    // but Inertia usually handles this gracefully.
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        // Set a timeout to delay the search request (Debounce) so it doesn't reload on every letter
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
        }, 300); // 300ms delay

        return () => clearTimeout(timer); // Cleanup timeout if user types again
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manage Applications</h2>}
        >
            <Head title="Manage Applications" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            {/* --- FILTERS & SEARCH ROW --- */}
                            <div className="mb-6 flex flex-col md:flex-row md:items-end gap-4">
                                {/* Search Input */}
                                <div className="flex-grow">
                                    <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search</label>
                                    <div className="relative mt-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            name="search"
                                            id="search"
                                            value={filters.search}
                                            onChange={handleFilterChange}
                                            placeholder="Search by ID or Name..."
                                            className="block w-full pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        />
                                    </div>
                                </div>

                                {/* Status Filter */}
                                <div className="w-full md:w-1/4">
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                                    <select
                                        id="status" name="status" value={filters.status}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>

                                {/* Program Filter */}
<div className="w-full md:w-1/4">
    <label htmlFor="program" className="block text-sm font-medium text-gray-700">Program</label>
    <select
        id="program" name="program" value={filters.program}
        onChange={handleFilterChange}
        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
    >
        <option value="">All Programs</option>
        <option value="Laboratory Tests">Laboratory Tests</option>
        <option value="Anti-Rabies Vaccine Treatment">Anti-Rabies Vaccine Treatment</option>
        <option value="Funeral Assistance">Funeral Assistance</option>
        <option value="Medicine Assistance">Medicine Assistance</option>
        <option value="Hospitalization">Hospitalization</option>
        <option value="Chemotherapy">Chemotherapy</option>
        <option value="Diagnostic Blood Tests">Diagnostic Blood Tests</option>
    </select>
</div>

                                {/* Reset Button */}
                                <div>
                                     <button
                                        onClick={() => setFilters({ status: '', program: '', search: '' })}
                                        className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200 transition"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                            {/* --- END FILTERS --- */}

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <SortableHeader label="ID" columnName="id" sortBy={initialSortBy} sortDirection={initialSortDirection} />
                                            {/* Changed label to be clearer */}
                                            <SortableHeader label="Full Name" columnName="first_name" sortBy={initialSortBy} sortDirection={initialSortDirection} />
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                                            <SortableHeader label="Status" columnName="status" sortBy={initialSortBy} sortDirection={initialSortDirection} />
                                            <SortableHeader label="Date Submitted" columnName="created_at" sortBy={initialSortBy} sortDirection={initialSortDirection} />
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {applications.data.length > 0 ? (
                                            applications.data.map(application => (
                                                <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{application.id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {application.first_name} {application.last_name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.program}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            application.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                            application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {application.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(application.created_at).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link href={route('admin.applications.show', application.id)} className="text-indigo-600 hover:text-indigo-900 font-bold">
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <svg className="h-10 w-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                        </svg>
                                                        <p>No applications found matching your search.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <Pagination links={applications.links} className="mt-6" />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
