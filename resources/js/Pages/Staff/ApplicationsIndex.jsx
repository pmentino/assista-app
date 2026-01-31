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

        // NOTE: Ensure this route name matches your Staff route (usually staff.applications.index)
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

// --- ROW COMPONENT (STAFF VERSION - NO DELETE) ---
const Row = ({ app, getStatusColor }) => {

    return (
        <tr className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150 group">
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
                <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs font-bold border border-blue-100 dark:border-blue-800">
                    {app.program}
                </span>
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

            {/* --- STICKY ACTION COLUMN (STAFF VERSION) --- */}
            {/* Removed Delete Button Logic, Kept Sticky Styles */}
            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium sticky right-0 z-10 bg-white dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-gray-700 border-l border-gray-100 dark:border-gray-700 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] transition-colors duration-150">
                <div className="flex justify-end gap-2">
                    <Link
                        href={route('staff.applications.show', app.id)} // Ensuring this uses the STAFF route
                        className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm font-semibold text-xs transition ease-in-out duration-150 gap-1"
                        title="Review Application"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Review
                    </Link>
                </div>
            </td>
        </tr>
    );
};

// --- MAIN COMPONENT ---

export default function ApplicationsIndex({ auth, applications, filters: initialFilters = {}, sort_by: initialSortBy, sort_direction: initialSortDirection, allBarangays, programs }) {

    const { flash = {} } = usePage().props;
    const [visibleSuccess, setVisibleSuccess] = useState(null);

    useEffect(() => {
        if (flash.message) {
            setVisibleSuccess(flash.message);
            const timer = setTimeout(() => setVisibleSuccess(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const [filters, setFilters] = useState({
        status: initialFilters.status || '',
        program: initialFilters.program || '',
        search: initialFilters.search || '',
        barangay: initialFilters.barangay || '',
    });

    const isFirstRun = useRef(true);

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

            // NOTE: Ensure this route matches STAFF index
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

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-200 leading-tight">Manage Applications (Staff)</h2>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs font-bold rounded-full">
                        {applications.total} Records
                    </span>
                </div>
            }
        >
            <Head title="Manage Applications" />

            {/* Success Toast */}
            {visibleSuccess && (
                <div className="fixed top-24 right-5 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
                    <div className="bg-white dark:bg-gray-800 border-l-8 border-green-500 rounded-lg shadow-2xl p-4 flex items-start animate-fade-in-left pointer-events-auto ring-1 ring-black/5 dark:ring-white/10">
                        <div className="flex-shrink-0 text-green-500">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-3 w-0 flex-1">
                            <h3 className="text-sm font-bold text-green-900 dark:text-green-300">Success</h3>
                            <p className="text-sm text-green-700 dark:text-green-400 mt-1">{visibleSuccess}</p>
                        </div>
                        <button onClick={() => setVisibleSuccess(null)} className="ml-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>
            )}

            <div className="py-6 md:py-10 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">

                        {/* --- TOOLBAR SECTION --- */}
                        <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                            {/* Search */}
                            <div className="col-span-1 md:col-span-3 relative">
                                <input type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Search by Name or ID..." className="block w-full pl-4 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition h-10" />
                            </div>
                            {/* Status */}
                            <div className="col-span-1 md:col-span-2">
                                <select name="status" value={filters.status} onChange={handleFilterChange} className="block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm cursor-pointer h-10">
                                    <option value="">All Statuses</option>
                                    <option value="Pending">Pending Review</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                            {/* Program */}
                            <div className="col-span-1 md:col-span-3">
                                <select name="program" value={filters.program} onChange={handleFilterChange} className="block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm cursor-pointer h-10">
                                    <option value="">All Programs</option>
                                    {programs && programs.map((p) => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            {/* Barangay */}
                            <div className="col-span-1 md:col-span-3">
                                <select name="barangay" value={filters.barangay} onChange={handleFilterChange} className="block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm cursor-pointer h-10">
                                    <option value="">All Barangays</option>
                                    {allBarangays && allBarangays.map((bgy) => <option key={bgy} value={bgy}>{bgy}</option>)}
                                </select>
                            </div>
                            {/* Reset */}
                            <div className="col-span-1 text-right md:text-center">
                                {(filters.search || filters.status || filters.program || filters.barangay) && (
                                    <button onClick={() => setFilters({ search: '', status: '', program: '', barangay: '' })} className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 font-bold underline transition">Reset</button>
                                )}
                            </div>
                        </div>

                        {/* --- DATA TABLE --- */}
                        <div className="overflow-x-auto w-full relative">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <SortableHeader label="ID" columnName="id" sortBy={initialSortBy} sortDirection={initialSortDirection} />
                                        <SortableHeader label="Applicant Name" columnName="first_name" sortBy={initialSortBy} sortDirection={initialSortDirection} />
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Assistance Type</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Barangay</th>
                                        <SortableHeader label="Status" columnName="status" sortBy={initialSortBy} sortDirection={initialSortDirection} />
                                        <SortableHeader label="Submitted On" columnName="created_at" sortBy={initialSortBy} sortDirection={initialSortDirection} />

                                        {/* STICKY HEADER FOR ACTION COLUMN */}
                                        <th className="px-4 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky right-0 z-20 bg-gray-50 dark:bg-gray-700 border-l border-gray-100 dark:border-gray-600 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)]">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {applications.data.length > 0 ? (
                                        applications.data.map((app) => (
                                            <Row key={app.id} app={app} getStatusColor={getStatusColor} />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center">
                                                <p className="text-gray-500 dark:text-gray-400 text-lg">No applications match your search.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <Pagination links={applications.links} />
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
