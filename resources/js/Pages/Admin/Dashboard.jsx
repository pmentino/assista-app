import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const StatCard = ({ title, value, bgColorClass }) => (
    <div className={`bg-white overflow-hidden shadow-sm sm:rounded-lg ${bgColorClass}`}>
        <div className="p-6 text-gray-900">
            <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
    </div>
);

export default function AdminDashboard({ auth }) {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
    });

    useEffect(() => {
        axios.get('/api/admin/stats').then(response => {
            setStats(response.data);
        });
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard title="Total Applications" value={stats.total} />
                        <StatCard title="Pending" value={stats.pending} bgColorClass="bg-yellow-100" />
                        <StatCard title="Approved" value={stats.approved} bgColorClass="bg-green-100" />
                        <StatCard title="Rejected" value={stats.rejected} bgColorClass="bg-red-100" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
