import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import TextInput from '@/Components/TextInput';

export default function UsersIndex({ auth, users, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');

    // --- DEBOUNCE SEARCH ---
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                route('admin.users.index'),
                { search, role },
                { preserveState: true, replace: true }
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [search, role]);

    // --- NEW: EXPLICIT ROLE CHANGE ---
    const changeRole = (user, newRole) => {
        const action = newRole === 'admin' || (newRole === 'staff' && user.type === 'user')
            ? 'Promote'
            : 'Demote';

        if (confirm(`Are you sure you want to ${action} ${user.name} to ${newRole.toUpperCase()}?`)) {
            router.post(route('admin.users.role', user.id), { role: newRole });
        }
    };

    const toggleStatus = (user) => {
        const action = user.is_active ? 'deactivate' : 'activate';
        if (confirm(`Are you sure you want to ${action} this account?`)) {
            router.post(route('admin.users.status', user.id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-blue-900 leading-tight">User Management</h2>}
        >
            <Head title="Manage Users" />

            <div className="py-12 bg-gray-50 min-h-screen font-sans">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* --- HEADER CONTROLS --- */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="w-full md:w-1/3 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <TextInput
                                type="text"
                                placeholder="Search by name or email..."
                                className="w-full pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-auto flex gap-3">
                            <select
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm text-sm text-gray-700 bg-gray-50"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="">Filter by Role: All</option>
                                <option value="admin">Administrators</option>
                                <option value="staff">Staff Members</option>
                                <option value="user">Public Users</option>
                            </select>
                        </div>
                    </div>

                    {/* --- PROFESSIONAL TABLE --- */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-blue-900">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">User Profile</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Current Role</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Account Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Manage Authority</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">
                                                No users found matching your criteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.data.map((user) => (
                                            <tr key={user.id} className="hover:bg-blue-50/50 transition duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${
                                                            user.type === 'admin' ? 'bg-blue-800' :
                                                            user.type === 'staff' ? 'bg-yellow-500' : 'bg-gray-400'
                                                        }`}>
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-bold text-gray-900">{user.name}</div>
                                                            <div className="text-xs text-gray-500">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <RoleBadge role={user.type} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full border ${
                                                        user.is_active
                                                            ? 'bg-green-50 text-green-700 border-green-200'
                                                            : 'bg-red-50 text-red-700 border-red-200'
                                                    }`}>
                                                        {user.is_active ? 'Active' : 'Deactivated'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.barangay || <span className="text-gray-300 italic">N/A</span>}
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

                                                            <div className="h-4 w-px bg-gray-300 mx-2"></div>

                                                            {/* Status Button */}
                                                            <button
                                                                onClick={() => toggleStatus(user)}
                                                                className={`p-1.5 rounded-md transition-colors ${
                                                                    user.is_active
                                                                        ? 'text-red-500 hover:bg-red-50'
                                                                        : 'text-green-500 hover:bg-green-50'
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
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex justify-between items-center">
                                {users.links.map((link, key) => (
                                    link.url ? (
                                        <Link
                                            key={key}
                                            href={link.url}
                                            className={`px-3 py-1.5 border rounded-lg text-xs font-bold shadow-sm transition ${link.active ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span key={key} className="px-3 py-1.5 border border-transparent rounded text-xs text-gray-400" dangerouslySetInnerHTML={{ __html: link.label }}></span>
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
        admin: 'bg-blue-100 text-blue-800 border-blue-200 ring-blue-500',
        staff: 'bg-yellow-100 text-yellow-800 border-yellow-200 ring-yellow-500',
        user: 'bg-gray-100 text-gray-600 border-gray-200 ring-gray-400',
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
        green: 'text-green-600 hover:bg-green-50',
        blue: 'text-blue-600 hover:bg-blue-50',
        orange: 'text-orange-600 hover:bg-orange-50',
        gray: 'text-gray-500 hover:bg-gray-50',
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
