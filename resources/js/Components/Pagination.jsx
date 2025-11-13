import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links, className = '' }) {
    // Helper function to render a single link
    function renderLink(link, index) {
        // If the link has no URL (like '...') or is the current page, render it as disabled text
        if (!link.url || link.active) {
            return (
                <span
                    key={index}
                    dangerouslySetInnerHTML={{ __html: link.label }} // Render HTML entities like &laquo;
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        link.active ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600' : 'text-gray-400 ring-1 ring-inset ring-gray-300'
                    }`}
                    aria-current={link.active ? 'page' : undefined}
                    aria-disabled={!link.url}
                />
            );
        }

        // Otherwise, render it as a clickable Inertia Link
        // CRITICAL FIX: Ensure preserveState and preserveScroll are used
        return (
            <Link
                key={index}
                href={link.url} // This URL from Laravel now includes the query parameters
                dangerouslySetInnerHTML={{ __html: link.label }}
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                preserveScroll // Keep scroll position when changing pages
                preserveState // CRITICAL: Keep filters/sorting when changing pages
            />
        );
    }

    // Only render pagination if there are links to show (more than just prev/next/current)
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <nav className={`flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 ${className}`} aria-label="Pagination">
            {/* On small screens, just show Previous/Next */}
            <div className="-mt-px flex w-0 flex-1">
                {links[0].url ? (
                    <Link
                        href={links[0].url} // URL includes query parameters
                        className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        preserveScroll
                        preserveState // CRITICAL: Keep filters/sorting
                    >
                         &laquo; Previous
                    </Link>
                ) : (
                    <span className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-400">
                         &laquo; Previous
                    </span>
                )}
            </div>
            {/* On medium screens and up, show page numbers */}
            <div className="hidden md:-mt-px md:flex">
                {links.slice(1, -1).map(renderLink)} {/* Render page numbers, excluding prev/next */}
            </div>
            <div className="-mt-px flex w-0 flex-1 justify-end">
                {links[links.length - 1].url ? (
                     <Link
                        href={links[links.length - 1].url} // URL includes query parameters
                        className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        preserveScroll
                        preserveState // CRITICAL: Keep filters/sorting
                    >
                        Next &raquo;
                    </Link>
                ) : (
                    <span className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-400">
                        Next &raquo;
                    </span>
                )}
            </div>
        </nav>
    );
}
