import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { pickBy } from 'lodash';
import Pagination from '@/Components/Pagination'; // We will create this component

// Function to render sorting arrows
const SortArrow = ({ direction }) => {
    if (direction === 'asc') return <span>&uarr;</span>;
    if (direction === 'desc') return <span>&darr;</span>;
    return null;
};

// Function to create a sortable table header link
const SortableHeader = ({ label, columnName, sortBy, sortDirection }) => {
    const isCurrentSort = sortBy === columnName;
    const newDirection = isCurrentSort && sortDirection === 'asc' ? 'desc' : 'asc';
    const currentParams = new URLSearchParams(window.location.search);

    const handleSort = (e) => {
        e.preventDefault();
        currentParams.set('sort_by', columnName);
        currentParams.set('sort_direction', newDirection);
        // Use Object.fromEntries to convert URLSearchParams to an object for router.get
        router.get(route('admin.applications.index'), Object.fromEntries(currentParams.entries()), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <a href="#" onClick={handleSort} className="flex items-center space-x-1">
                <span>{label}</span>
                {isCurrentSort && <SortArrow direction={sortDirection} />}
            </a>
        </th>
    );
};


export default function ApplicationsIndex({ applications, filters: initialFilters = {}, sort_by: initialSortBy, sort_direction: initialSortDirection }) {
    const { auth } = usePage().props;

    const [filters, setFilters] = useState({
        status: initialFilters.status || '',
        program: initialFilters.program || '',
    });

    useEffect(() => {
        // Debounce or throttle this if needed, but for now, reload on every filter change
        const query = pickBy(filters);
        const currentParams = new URLSearchParams(window.location.search);
        const sortBy = currentParams.get('sort_by') || initialSortBy;
        const sortDirection = currentParams.get('sort_direction') || initialSortDirection;

        router.get(route('admin.applications.index'), { ...query, sort_by: sortBy, sort_direction: sortDirection }, {
            preserveState: true,
            preserveScroll: true, // Keep scroll position when filtering/sorting
            replace: true,
        });
    }, [filters, initialSortBy, initialSortDirection]); // Added dependencies

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    return (
        <AuthenticatedLayout
            user={auth?.user} // Safety check
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manage Applications</h2>}
        >
            <Head title="Manage Applications" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            {/* --- THIS IS THE FILTER SECTION --- */}
                            <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Filter by Status</label>
                                    <select
                                        id="status" name="status" value={filters.status}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    >
                                        <option value="">All</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="program" className="block text-sm font-medium text-gray-700">Filter by Program</label>
                                    <select
                                        id="program" name="program" value={filters.program}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    >
                                        <option value="">All</option>
                                        <option value="AICS - Medical">AICS - Medical</option>
                                        <option value="AICS - Burial">AICS - Burial</option>
                                        <option value="AICS - Food">AICS - Food</option>
                                    </select>
                                </div>
                                {/* Optional: Add a Reset button */}
                                <div className="text-right">
                                     <button
                                        onClick={() => setFilters({ status: '', program: '' })}
                                        className="text-sm text-gray-600 hover:text-gray-900 underline"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            </div>
                            {/* --- END OF FILTER SECTION --- */}

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <SortableHeader label="ID" columnName="id" sortBy={initialSortBy} sortDirection={initialSortDirection} />
                                            <SortableHeader label="Applicant Name" columnName="first_name" sortBy={initialSortBy} sortDirection={initialSortDirection} />
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                                            <SortableHeader label="Status" columnName="status" sortBy={initialSortBy} sortDirection={initialSortDirection} />
                                            <SortableHeader label="Date Submitted" columnName="created_at" sortBy={initialSortBy} sortDirection={initialSortDirection} />
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {applications.data.length > 0 ? (
                                            applications.data.map(application => (
                                                <tr key={application.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{application.user?.name || 'N/A'}</td>
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
                                                        <Link href={route('admin.applications.show', application.id)} className="text-indigo-600 hover:text-indigo-900">
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                             <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No applications found matching your criteria.
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
