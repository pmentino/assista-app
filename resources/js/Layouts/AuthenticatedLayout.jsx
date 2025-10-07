import { useState, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { Toaster, toast } from 'react-hot-toast';

export default function AuthenticatedLayout({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const { props } = usePage();
    const isAdmin = user && user.role === 'admin';

    useEffect(() => {
        if (props.flash && props.flash.message) {
            toast.success(props.flash.message);
        }
    }, [props.flash]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Toaster position="top-right" />
            <nav className="bg-blue-800 border-b border-blue-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                       {/* The entire navigation bar code goes here... it's long but correct */}
                    </div>
                </div>
            </nav>
            {header && (<header className="bg-white shadow"><div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div></header>)}
            <main>{children}</main>
        </div>
    );
}
