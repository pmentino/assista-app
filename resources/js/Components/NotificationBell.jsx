import { useState, useEffect, useRef } from 'react';
import { usePage, Link } from '@inertiajs/react';
import axios from 'axios';

export default function NotificationBell() {
    const { auth, translations } = usePage().props;
    const __ = (key) => (translations && translations[key]) ? translations[key] : key;

    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    const getActivityRoute = () => {
        const role = auth?.user?.role || auth?.user?.type;
        if (role === 'admin') return route('admin.audit-logs');
        if (role === 'staff') return route('staff.applications.index');
        return route('dashboard');
    };

    const fetchNotifications = async () => {
        if (!auth?.user) return;
        try {
            const response = await axios.get(route('notifications.index'));
            setNotifications(response.data.notifications || []);
            setUnreadCount(response.data.unreadCount || 0);
        } catch (error) {
            console.error("Notification fetch error", error);
        }
    };

    // Poll every 5 seconds
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id, link) => {
        try {
            await axios.post(route('notifications.read', id));
            fetchNotifications();
            setIsOpen(false);
        } catch (error) { console.error(error); }
    };

    const markAllRead = async () => {
        try {
            await axios.post(route('notifications.read-all'));
            fetchNotifications();
        } catch (error) { console.error(error); }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition"
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800 animate-pulse"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 ring-1 ring-black ring-opacity-5 origin-top-right transform transition-all">
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">{__('Notifications')}</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 font-semibold hover:underline">
                                {__('Mark all read')}
                            </button>
                        )}
                    </div>

                    <ul className="max-h-80 overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <li key={notif.id} className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition ${!notif.read_at ? 'bg-blue-50/40 dark:bg-blue-900/10' : ''}`}>
                                    <Link
                                        href={notif.data.link || '#'}
                                        onClick={() => markAsRead(notif.id, notif.data.link)}
                                        className="p-4 flex gap-3 w-full text-left"
                                    >
                                        <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                                            notif.data.status === 'Approved' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                                            notif.data.status === 'Rejected' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                            'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                        }`}>
                                            {notif.data.status === 'Approved' ? (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            ) : notif.data.status === 'Rejected' ? (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            {notif.data.program ? (
                                                <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 leading-snug">
                                                    {__('The request for')}{' '}
                                                    <span className="font-bold text-blue-600 dark:text-blue-400">
                                                        {__(notif.data.program)}
                                                    </span>
                                                    {notif.data.applicant_name && (
                                                        <span className="capitalize font-semibold text-gray-700 dark:text-gray-200">
                                                            {' '}({notif.data.applicant_name}){' '}
                                                        </span>
                                                    )}
                                                    {__('has been')} <span className={`font-bold ${notif.data.status === 'Approved' ? 'text-green-600' : 'text-red-600'}`}>{notif.data.status ? notif.data.status.toLowerCase() : 'processed'}</span>.
                                                </p>
                                            ) : (
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-snug">
                                                    {notif.data.message || 'Notification received.'}
                                                </p>
                                            )}

                                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                                                {new Date(notif.created_at).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <li className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm italic">
                                {__('No new notifications.')}
                            </li>
                        )}
                    </ul>

                    <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-2 border-t border-gray-100 dark:border-gray-700 text-center">
                        <Link href={getActivityRoute()} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 hover:underline">
                            {__('View All Activity')}
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
