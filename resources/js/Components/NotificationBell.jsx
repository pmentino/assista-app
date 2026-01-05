import { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';

export default function NotificationBell() {
    // 1. Get props from the page
    const { auth } = usePage().props;

    // 2. SAFETY CHECK: Use '?.' (Optional Chaining)
    // This prevents the "Undefined" crash if auth is missing for a split second
    const notifications = auth?.notifications || [];

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative ml-3">
            {/* BELL BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none hover:bg-gray-100 transition"
            >
                <span className="sr-only">View notifications</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>

                {/* RED DOT COUNTER */}
                {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-red-600 animate-pulse"></span>
                )}
            </button>

            {/* DROPDOWN MENU */}
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-xl shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                        <h3 className="text-sm font-bold text-gray-800">Notifications</h3>
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <Link
                                    key={notif.id}
                                    href={route('dashboard')}
                                    className="block px-4 py-3 hover:bg-blue-50 border-b border-gray-100 transition"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-blue-100 rounded-full p-1 mr-3 text-blue-600">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <div>
                                            {/* Safely access data properties too */}
                                            <p className="text-sm text-gray-800 font-medium">{notif.data?.message || 'New Notification'}</p>
                                            <p className="text-xs text-gray-500 mt-1">
    {notif.created_at ? (
        <>
            {new Date(notif.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            })}
            <span className="mx-1">•</span>
            {new Date(notif.created_at).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })}
        </>
    ) : 'Just now'}
</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                <p>No new notifications.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
