import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import TextInput from '@/Components/TextInput';

export default function UsersIndex({ auth, users, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');

    // Track if this is the initial render to prevent double-fetching
    const isFirstRender = useRef(true);

    // --- DEBOUNCE SEARCH ---
    useEffect(() => {
        // Skip the first run so we don't reload page on mount
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            router.get(
                route('admin.users.index'),
                { search, role },
                // CRITICAL: preserveState prevents losing scroll position
                // replace: true prevents cluttering browser history
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [search, role]);

    // --- ROLE CHANGE HANDLER ---
    const changeRole = (user, newRole) => {
        const action = newRole === 'admin' || (newRole === 'staff' && user.type === 'user')
            ? 'Promote'
            : 'Demote';

        if (confirm(`Are you sure you want to ${action} ${user.name} to ${newRole.toUpperCase()}?`)) {
            router.post(route('admin.users.role', user.id), { role: newRole }, { preserveScroll: true });
        }
    };

    const toggleStatus = (user) => {
        const action = user.is_active ? 'deactivate' : 'activate';
        if (confirm(`Are you sure you want to ${action} this account?`)) {
            router.post(route('admin.users.status', user.id), {}, { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-blue-900 dark:text-blue-300 leading-tight">User Management</h2>
                    {/* Optional: Add a subtle badge showing total users */}
                    <span className="text-xs font-mono bg-blue-100 text-blue-800 py-1 px-2 rounded-full dark:bg-blue-900 dark:text-blue-200">
                        {users.total} Total Users
                    </span>
                </div>
            }
        >
            <Head title="Manage Users" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* --- HEADER CONTROLS --- */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors">
                        <div className="w-full md:w-1/3 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <TextInput
                                type="text"
                                placeholder="Search by name or email..."
                                className="w-full pl-10 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-auto flex gap-3">
                            <select
                                className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 cursor-pointer"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="">Filter by Role: All</option>
                                <option value="admin">Administrators</option>
                                <option value="staff">Staff Members</option>
                                <option value="user">Constituents</option>
                            </select>
                        </div>
                    </div>

                    {/* --- PROFESSIONAL TABLE --- */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 transition-colors">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-blue-900 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">User Profile</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Current Role</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Account Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Manage Authority</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {users.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 italic">
                                                No users found matching your criteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.data.map((user) => (
                                            <tr key={user.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${
                                                            user.type === 'admin' ? 'bg-blue-800 dark:bg-blue-600' :
                                                            user.type === 'staff' ? 'bg-yellow-500 dark:bg-yellow-600' : 'bg-gray-400 dark:bg-gray-600'
                                                        }`}>
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <RoleBadge role={user.type} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full border ${
                                                        user.is_active
                                                            ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
                                                            : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                                                    }`}>
                                                        {user.is_active ? 'Active' : 'Deactivated'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {user.barangay || <span className="text-gray-300 dark:text-gray-600 italic">N/A</span>}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    {user.id !== auth.user.id && (
                                                        <div className="flex items-center justify-center space-x-2">
                                                            {/* LOGIC: Promote/Demote Arrows */}
                                                            {user.type === 'user' && (
                                                                <ActionButton
                                                                    onClick={() => changeRole(user, 'staff')}
                                                                    color="green"
                                                                    icon={<UpArrow />}
                                                                    label="Promote to Staff"
                                                                />
                                                            )}

                                                            {user.type === 'staff' && (
                                                                <>
                                                                    <ActionButton
                                                                        onClick={() => changeRole(user, 'user')}
                                                                        color="gray"
                                                                        icon={<DownArrow />}
                                                                        label="Demote to User"
                                                                    />
                                                                    <ActionButton
                                                                        onClick={() => changeRole(user, 'admin')}
                                                                        color="blue"
                                                                        icon={<UpArrow />}
                                                                        label="Promote to Admin"
                                                                    />
                                                                </>
                                                            )}

                                                            {user.type === 'admin' && (
                                                                <ActionButton
                                                                    onClick={() => changeRole(user, 'staff')}
                                                                    color="orange"
                                                                    icon={<DownArrow />}
                                                                    label="Demote to Staff"
                                                                />
                                                            )}

                                                            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>

                                                            {/* Status Button */}
                                                            <button
                                                                onClick={() => toggleStatus(user)}
                                                                className={`p-1.5 rounded-md transition-colors ${
                                                                    user.is_active
                                                                        ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30'
                                                                        : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30'
                                                                }`}
                                                                title={user.is_active ? "Deactivate Account" : "Activate Account"}
                                                            >
                                                                {user.is_active ? (
                                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                                                ) : (
                                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                )}
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* --- PAGINATION --- */}
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <div className="flex justify-between items-center">
                                {users.links.map((link, key) => (
                                    link.url ? (
                                        <Link
                                            key={key}
                                            href={link.url}
                                            preserveScroll
                                            preserveState
                                            className={`px-3 py-1.5 border rounded-lg text-xs font-bold shadow-sm transition ${
                                                link.active
                                                    ? 'bg-blue-800 text-white border-blue-800 dark:bg-blue-600 dark:border-blue-600'
                                                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span key={key} className="px-3 py-1.5 border border-transparent rounded text-xs text-gray-400 dark:text-gray-500" dangerouslySetInnerHTML={{ __html: link.label }}></span>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// --- SUB-COMPONENTS ---

function RoleBadge({ role }) {
    const styles = {
        admin: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800 ring-blue-500 dark:ring-blue-400',
        staff: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 ring-yellow-500 dark:ring-yellow-400',
        user: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 ring-gray-400',
    };

    const label = {
        admin: 'Administrator',
        staff: 'Staff Member',
        user: 'Constituent',
    };

    return (
        <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ring-1 ring-opacity-20 ${styles[role] || styles.user}`}>
            {label[role] || role}
        </span>
    );
}

function ActionButton({ onClick, color, icon, label }) {
    const colors = {
        green: 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20',
        blue: 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20',
        orange: 'text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20',
        gray: 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700',
    };

    return (
        <button
            onClick={onClick}
            className={`p-1.5 rounded-md transition-colors ${colors[color]}`}
            title={label}
        >
            {icon}
        </button>
    );
}

function UpArrow() {
    return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>;
}

function DownArrow() {
    return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>;
}
