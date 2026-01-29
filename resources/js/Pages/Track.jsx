import { Head, useForm, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Track({ result }) {
    const params = new URLSearchParams(window.location.search);

    // Toggle State: 'id' or 'details'
    const [searchMethod, setSearchMethod] = useState('id');

    const { data, setData, post, processing, errors, reset } = useForm({
        reference_id: params.get('ref') || '',
        last_name: params.get('name') || '',
        first_name: '',
        birth_date: '',
    });

    // Auto-check for QR codes
    useEffect(() => {
        if (!result && data.reference_id && data.last_name) {
            post(route('track.check'));
        }
    }, []);

    const submit = (e) => {
        e.preventDefault();
        // Clear unrelated fields before sending to avoid validation errors?
        // Actually, Controller handles "if has birth_date" logic, so we just send everything.
        post(route('track.check'));
    };

    const toggleMethod = () => {
        setSearchMethod(searchMethod === 'id' ? 'details' : 'id');
        reset(); // Clear form when switching
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <Head title="Track Application" />

            <div className="w-full max-w-md mb-6">
                <Link href="/" className="text-blue-600 hover:text-blue-800 font-bold flex items-center transition">
                    ← Back to Home
                </Link>
            </div>

            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-blue-900 p-8 text-center relative">
                    <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white relative z-10">Track Application</h2>
                    <p className="text-blue-200 text-sm mt-1 relative z-10">Check your status instantly.</p>
                </div>

                <div className="p-8">
                    {!result ? (
                        <form onSubmit={submit} className="space-y-5">

                            {/* SEARCH METHOD TOGGLE */}
                            {searchMethod === 'id' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Application ID / Queue #</label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 25"
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3"
                                            value={data.reference_id}
                                            onChange={(e) => setData('reference_id', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Dela Cruz"
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            required
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">First Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Juan"
                                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 py-3"
                                                value={data.first_name}
                                                onChange={(e) => setData('first_name', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Dela Cruz"
                                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 py-3"
                                                value={data.last_name}
                                                onChange={(e) => setData('last_name', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Birth Date</label>
                                        <input
                                            type="date"
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 py-3"
                                            value={data.birth_date}
                                            onChange={(e) => setData('birth_date', e.target.value)}
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            {errors.error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm text-center font-bold">
                                    {errors.error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-3 rounded-xl shadow-md transition transform hover:-translate-y-0.5"
                            >
                                {processing ? 'Searching...' : 'Check Status'}
                            </button>

                            {/* TOGGLE LINK */}
                            <div className="text-center pt-2">
                                <button
                                    type="button"
                                    onClick={toggleMethod}
                                    className="text-sm text-blue-600 font-semibold hover:underline focus:outline-none"
                                >
                                    {searchMethod === 'id'
                                        ? "I forgot my Application ID"
                                        : "I have my Application ID"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        // ... (Result View - Same as before) ...
                        <div className="animate-fade-in">
                            <div className="text-center mb-6">
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                                    result.status === 'Approved' ? 'bg-green-100 text-green-600' :
                                    result.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                                    'bg-yellow-100 text-yellow-600'
                                }`}>
                                    {result.status === 'Approved' ? (
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    ) : result.status === 'Rejected' ? (
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    ) : (
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {result.first_name} {result.last_name}
                                </h3>
                                <p className="text-sm text-gray-500 font-mono mt-1">ID: #{String(result.id).padStart(6, '0')}</p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-3">
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-500 text-sm">Status</span>
                                    <span className={`font-bold ${
                                        result.status === 'Approved' ? 'text-green-600' :
                                        result.status === 'Rejected' ? 'text-red-600' :
                                        'text-yellow-600'
                                    }`}>{result.status.toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-500 text-sm">Program</span>
                                    <span className="font-medium text-gray-800 text-sm text-right">{result.program}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 text-sm">Last Update</span>
                                    <span className="font-medium text-gray-800 text-sm">{new Date(result.updated_at).toLocaleDateString()}</span>
                                </div>
                                {result.remarks && (
                                    <div className="pt-2 mt-2 border-t border-gray-200">
                                        <p className="text-xs text-gray-500 mb-1">Remarks:</p>
                                        <p className="text-sm text-red-600 italic bg-red-50 p-2 rounded border border-red-100">{result.remarks}</p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => window.location.reload()}
                                className="mt-6 w-full py-3 text-gray-500 font-bold hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
                            >
                                Check Another
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
