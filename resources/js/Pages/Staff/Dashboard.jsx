import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard({ stats, recentApplications }) {
    const { auth } = usePage().props;
    const userName = auth?.user?.name || 'Staff Member';

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Staff Dashboard</h2>}
        >
            <Head title="Staff Dashboard" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* --- WELCOME CARD --- */}
                    <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl shadow-xl mb-8 overflow-hidden relative">
                        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform origin-bottom-left"></div>
                        <div className="p-8 md:p-10 text-white relative z-10">
                            <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}!</h1>
                            <p className="text-blue-100 text-lg">
                                Ready to assist citizens? You have <span className="font-bold text-white underline">{stats.pending} pending</span> applications to review.
                            </p>
                        </div>
                    </div>

                    {/* --- STATS GRID --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Total */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Applications</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                        </div>

                        {/* Pending */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Review</p>
                                <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
                            </div>
                            <div className="p-3 bg-yellow-50 rounded-full text-yellow-600">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                        </div>

                        {/* New Today */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Received Today</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">{stats.today}</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-full text-green-600">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* --- RECENT ACTIVITY TABLE --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-800">Recent Applications</h3>
                            <Link href={route('staff.applications.index')} className="text-sm text-blue-600 hover:text-blue-800 font-bold hover:underline">
                                View All &rarr;
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Applicant</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Program</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Time</th>
                                        <th className="px-6 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentApplications && recentApplications.length > 0 ? (
                                        recentApplications.map((app) => (
                                            <tr key={app.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-900">{app.name}</div>
                                                    <div className="text-xs text-gray-500 font-mono">#{String(app.id).padStart(5, '0')}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {app.program}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-bold rounded-full border ${
                                                        app.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
                                                        app.status === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                                                        'bg-yellow-100 text-yellow-800 border-yellow-200'
                                                    }`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                                    {app.date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link href={route('staff.applications.show', app.id)} className="text-blue-600 hover:text-blue-900 font-bold hover:underline">
                                                        Review
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No recent applications found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
