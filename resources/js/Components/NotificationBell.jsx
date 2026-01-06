import { useState, useEffect, useRef } from 'react';
import { usePage, Link } from '@inertiajs/react'; // Ensure Link is imported
import axios from 'axios';

export default function NotificationBell() {
    const { auth } = usePage().props; // Get the current user
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    // --- SMART ROUTING FUNCTION ---
    const getActivityRoute = () => {
        const role = auth?.user?.role || auth?.user?.type;

        if (role === 'admin') {
            return route('admin.audit-logs');
        }
        if (role === 'staff') {
            return route('staff.applications.index');
        }

        // FIX: For Applicants, force the URL to open the "history" tab
        // (Note: We will need to update your Dashboard.jsx to read this!)
        return route('dashboard') + '?tab=history';
    };

    // Fetch notifications on mount
    const fetchNotifications = async () => {
        try {
            const response = await axios.get(route('notifications.index'));
            setNotifications(response.data.notifications || []);
            setUnreadCount(response.data.unreadCount || 0);
        } catch (error) {
            console.log("Notification fetch error (ignore if using props)");
        }
    };

    // Polling every 10 seconds
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, []);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id) => {
        try {
            await axios.post(route('notifications.read', id));
            fetchNotifications();
        } catch (error) {
            console.error(error);
        }
    };

    const markAllRead = async () => {
        try {
            await axios.post(route('notifications.readAll'));
            fetchNotifications();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full text-gray-200 hover:text-white hover:bg-blue-700 focus:outline-none transition"
            >
                {/* Bell Icon */}
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>

                {/* Red Dot Badge */}
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-blue-800 animate-pulse"></span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl overflow-hidden z-50 ring-1 ring-black ring-opacity-5 origin-top-right transform transition-all">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-gray-700">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline">
                                Mark all read
                            </button>
                        )}
                    </div>

                    <ul className="max-h-80 overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <li
                                    key={notif.id}
                                    onClick={() => markAsRead(notif.id)}
                                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer flex gap-3 ${!notif.read_at ? 'bg-blue-50/40' : ''}`}
                                >
                                    {/* STATUS ICON */}
                                    <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                                        notif.data.status === 'Approved' ? 'bg-green-100 text-green-600' :
                                        notif.data.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                                        'bg-blue-100 text-blue-600'
                                    }`}>
                                        {notif.data.status === 'Approved' ? (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                        ) : notif.data.status === 'Rejected' ? (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        )}
                                    </div>

                                    {/* TEXT CONTENT */}
                                    <div>
                                        {/* HEADER */}
                                        <p className="text-sm font-bold text-gray-800">
                                            {notif.data.message}
                                        </p>
                                        {/* DESCRIPTION */}
                                        <p className="text-xs text-gray-600 mt-0.5 leading-snug">
                                            {notif.data.description}
                                        </p>
                                        {/* TIMESTAMP */}
                                        <p className="text-[10px] text-gray-400 mt-1">
                                            {new Date(notif.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="p-8 text-center text-gray-500 text-sm italic">
                                No new notifications.
                            </li>
                        )}
                    </ul>

                    <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 text-center">
                        {/* --- UPDATED LINK WITH SMART ROUTING --- */}
                        <Link href={getActivityRoute()} className="text-xs font-bold text-blue-600 hover:text-blue-800">
                            View All Activity
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
