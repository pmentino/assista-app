import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Faqs() {
    const { auth, translations = {} } = usePage().props;

    // Helper function
    const __ = (key) => (translations[key] || key);
    const user = auth?.user || { name: 'Guest' };

    // --- DYNAMIC FAQ DATA ---
    // We now use the __() helper so these strings update instantly when language changes.
    const allFaqs = [
        {
            question: __('faq_q1'),
            answer: __('faq_a1')
        },
        {
            question: __('faq_q2'),
            answer: __('faq_a2')
        },
        {
            question: __('faq_q3'),
            answer: __('faq_a3')
        },
        {
            question: __('faq_q4'),
            answer: __('faq_a4')
        },
        {
            question: __('faq_q5'),
            answer: __('faq_a5')
        },
        {
            question: __('faq_q6'),
            answer: __('faq_a6')
        }
    ];

    const [searchQuery, setSearchQuery] = useState('');

    // --- "SMART SEARCH" LOGIC ---
    // This filter works on the TRANSLATED text.
    // Example: If user types "Bulong" in Hiligaynon mode, it will find the relevant answer.
    const filteredFaqs = allFaqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            user={user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__('FAQs')}</h2>}
        >
            <Head title="Frequently Asked Questions" />

            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans transition-colors duration-300">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">

                    {/* HEADER SECTION */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-extrabold text-blue-900 dark:text-white mb-2">
                            {__('faq_title')}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            {__('faq_subtitle')}
                        </p>
                    </div>

                    {/* SEARCH BAR */}
                    <div className="mb-8 relative max-w-xl mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder={__('faq_search_placeholder')}
                            className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* FAQ LIST */}
                    <div className="space-y-4">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                                    <details className="group">
                                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-5">
                                            <span className="text-lg text-blue-900 dark:text-blue-300 font-bold">
                                                {faq.question}
                                            </span>
                                            <span className="transition group-open:rotate-180 text-gray-500 dark:text-gray-400">
                                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                                                    <path d="M6 9l6 6 6-6"></path>
                                                </svg>
                                            </span>
                                        </summary>
                                        <div className="text-gray-600 dark:text-gray-300 mt-0 px-5 pb-5 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-3">
                                            {faq.answer}
                                        </div>
                                    </details>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-gray-500 dark:text-gray-400">
                                    {/* Optional: Add a translation key for 'No questions found' if you want perfection */}
                                    No questions found matching "{searchQuery}".
                                </p>
                            </div>
                        )}
                    </div>

                    {/* BACK BUTTON */}
                    <div className="mt-8 text-center">
                        <Link href={route('dashboard')} className="text-blue-600 dark:text-blue-400 hover:underline font-bold transition">
                            ← {__('back_to_dashboard')}
                        </Link>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
