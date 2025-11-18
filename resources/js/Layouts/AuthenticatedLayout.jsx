import { useState, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { Toaster, toast } from 'react-hot-toast';

export default function AuthenticatedLayout({ user, header, children }) {
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
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/"><img src="/images/logo.png" alt="Assista Logo" className="block h-9 w-auto" /></Link>
                            </div>
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <Link href={route('dashboard')} className={'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium focus:outline-none ' + (route().current('dashboard') ? 'border-yellow-400 text-white' : 'border-transparent text-white')}>My Dashboard</Link>
                                {isAdmin && (
                                    <>
                                        <Link href={route('admin.dashboard')} className={'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium focus:outline-none ' + (route().current('admin.dashboard') ? 'border-yellow-400 text-white' : 'border-transparent text-white')}>Admin Dashboard</Link>
                                        <Link href={route('admin.applications.index')} className={'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium focus:outline-none ' + (route().current('admin.applications.index') ? 'border-yellow-400 text-white' : 'border-transparent text-white')}>All Applications</Link>
                                        <Link href={route('admin.news.index')} className={'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium focus:outline-none ' + (route().current('admin.news.*') ? 'border-yellow-400 text-white' : 'border-transparent text-white')}>
    News / Updates
</Link>

                                        {/* THE NEW LINK FOR THE REPORTS PAGE */}
                                        <Link href={route('admin.reports.index')} className={'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium focus:outline-none ' + (route().current('admin.reports.index') ? 'border-yellow-400 text-white' : 'border-transparent text-white')}>Reports</Link>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button type="button" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-200 bg-blue-800 hover:text-white focus:outline-none">
                                                { user ? user.name : 'Account' }
                                                <svg className="ml-2 -mr-0.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            {header && (<header className="bg-white shadow"><div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div></header>)}
            <main>{children}</main>
        </div>
    );
}
