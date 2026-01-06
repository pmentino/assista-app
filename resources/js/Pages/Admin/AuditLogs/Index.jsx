import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

// Reusable Pagination Component (You can also extract this to a separate file later)
const Pagination = ({ links }) => {
    return (
        <div className="flex justify-center mt-6">
            <div className="flex flex-wrap gap-1">
                {links.map((link, key) => (
                    link.url === null ? (
                        <div key={key} className="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded">
                            <span dangerouslySetInnerHTML={{ __html: link.label }}></span>
                        </div>
                    ) : (
                        <Link
                            key={key}
                            className={`mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-indigo-500 focus:text-indigo-500 ${link.active ? 'bg-blue-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                            href={link.url}
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }}></span>
                        </Link>
                    )
                ))}
            </div>
        </div>
    );
};

export default function AuditLogsIndex({ auth, logs }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">System Audit Logs</h2>}
        >
            <Head title="Audit Logs" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Activity History</h3>
                                <p className="text-sm text-gray-500">Track all administrative actions for accountability.</p>
                            </div>
                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                                {logs.total} Records Found
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User / Admin</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Details</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {logs.data.length > 0 ? (
                                        logs.data.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 uppercase">
                                                            {log.user?.name?.[0] || '?'}
                                                        </div>
                                                        <div className="ml-3">
                                                            <div className="text-sm font-medium text-gray-900">{log.user?.name || 'Unknown'}</div>
                                                            <div className="text-xs text-gray-500">ID: {log.user_id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        log.action.includes('Approved') ? 'bg-green-100 text-green-800' :
                                                        log.action.includes('Rejected') ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {log.details || '-'}
                                                    <div className="text-xs text-gray-400 mt-1">IP: {log.ip_address}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-10 text-center text-gray-500 italic">
                                                No activity logs found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* --- PAGINATION CONTROLS (ADDED) --- */}
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <Pagination links={logs.links} />
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
