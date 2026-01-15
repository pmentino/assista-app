import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Dashboard({ auth, stats, queue, filters, programs }) {

    // --- CRASH PROOFING ---
    const resolveFilter = (val, defaultVal) => {
        return (typeof val === 'string') ? val : defaultVal;
    };

    const safeFilters = (filters && typeof filters === 'object' && !Array.isArray(filters))
        ? filters
        : {};

    // --- STATE ---
    const [search, setSearch] = useState(resolveFilter(safeFilters.search, ''));
    const [program, setProgram] = useState(resolveFilter(safeFilters.program, ''));
    const [sort, setSort] = useState(resolveFilter(safeFilters.sort, 'oldest'));

    // --- AUTOMATIC REFRESH ---
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                route('staff.dashboard'),
                { search, program, sort },
                { preserveState: true, replace: true, preserveScroll: true }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [search, program, sort]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Staff Dashboard</h2>}
        >
            <Head title="Staff Dashboard" />

            {/* MAIN BACKGROUND: Light vs Dark */}
            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans transition-colors duration-300">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* --- WELCOME BANNER --- */}
                    {/* Gradient stays the same as it works in both modes */}
                    <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
                        <div className="absolute right-0 top-0 h-full w-1/2 bg-white/5 skew-x-12"></div>
                        <h3 className="text-3xl font-bold relative z-10">Welcome back, {auth.user.name}!</h3>
                        <p className="mt-2 text-blue-100 relative z-10">
                            You have <strong className="text-yellow-300 text-lg">{stats?.pending || 0} pending applications</strong> in the queue.
                        </p>
                    </div>

                    {/* --- STATS GRID --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Stat 1 */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between transition-colors">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Total Received</p>
                                <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats?.total || 0}</p>
                            </div>
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                        </div>

                        {/* Stat 2 */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-l-4 border-yellow-400 dark:border-yellow-500 dark:border-t-gray-700 dark:border-r-gray-700 dark:border-b-gray-700 flex items-center justify-between transition-colors">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Pending Review</p>
                                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats?.pending || 0}</p>
                            </div>
                            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400 animate-pulse">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                        </div>

                        {/* Stat 3 */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between transition-colors">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Received Today</p>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats?.today || 0}</p>
                            </div>
                            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* --- VERIFICATION QUEUE --- */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">

                        {/* Toolbar */}
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                    Verification Queue
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Prioritize applications based on date submitted (FIFO).</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                                <input
                                    type="text"
                                    placeholder="Search name or ID..."
                                    className="text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />

                                <select
                                    className="text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                                    value={program}
                                    onChange={(e) => setProgram(e.target.value)}
                                >
                                    <option value="">All Programs</option>
                                    {programs && programs.length > 0 ? (
                                        programs.map((progTitle, index) => (
                                            <option key={index} value={progTitle}>{progTitle}</option>
                                        ))
                                    ) : (
                                        <option value="" disabled>No programs found</option>
                                    )}
                                </select>

                                <select
                                    className="text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-lg focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                >
                                    <option value="oldest">Sort: Oldest First (FIFO)</option>
                                    <option value="newest">Sort: Newest First</option>
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
                                        <th className="px-6 py-3">Queue ID</th>
                                        <th className="px-6 py-3">Applicant Name</th>
                                        <th className="px-6 py-3">Program</th>
                                        <th className="px-6 py-3">Submitted</th>
                                        <th className="px-6 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {queue && queue.length > 0 ? (
                                        queue.map((app) => (
                                            <tr key={app.id} className="hover:bg-yellow-50/50 dark:hover:bg-yellow-900/10 transition duration-150 bg-white dark:bg-gray-800">
                                                <td className="px-6 py-4">
                                                    <span className="font-mono text-xs font-bold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                                                        #{String(app.id).padStart(5, '0')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-800 dark:text-white">{app.first_name} {app.last_name}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{app.barangay}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-blue-900 dark:text-blue-300 font-medium px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-md border border-blue-100 dark:border-blue-800">
                                                        {app.program}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                    {new Date(app.created_at).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link
                                                        href={route('staff.applications.show', app.id)}
                                                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest shadow-sm transition"
                                                    >
                                                        Review Now
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center bg-white dark:bg-gray-800">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-3">
                                                        <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                                    </div>
                                                    <h4 className="text-lg font-bold text-gray-800 dark:text-white">No applications found</h4>
                                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Try adjusting your search or filters.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 text-right">
                            <Link href={route('staff.applications.index')} className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                View Full Application History &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
