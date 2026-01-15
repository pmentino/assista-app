import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function ProgramsIndex({ auth, programs }) {
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [programToDeleteId, setProgramToDeleteId] = useState(null);

    // Client-side filtering
    const filteredPrograms = programs.filter(program =>
        program.title.toLowerCase().includes(search.toLowerCase()) ||
        program.description.toLowerCase().includes(search.toLowerCase())
    );

    const form = useForm({
        title: '',
        description: '',
        requirements: '', // <--- NEW FIELD
        default_amount: '',
        icon_path: '',
    });

    const openCreateModal = () => {
        setIsEditing(false);
        setEditId(null);
        form.reset();
        form.clearErrors();
        form.setData('icon_path', 'M13 10V3L4 14h7v7l9-11h-7z');
        setIsModalOpen(true);
    };

    const openEditModal = (program) => {
        setIsEditing(true);
        setEditId(program.id);
        form.clearErrors();

        // Convert JSON array ["A", "B"] -> String "A, B"
        const reqString = Array.isArray(program.requirements)
            ? program.requirements.join(', ')
            : '';

        form.setData({
            title: program.title,
            description: program.description,
            requirements: Array.isArray(program.requirements) ? program.requirements.join(', ') : '',
            default_amount: program.default_amount || '', // <--- LOAD AMOUNT
            icon_path: program.icon_path || '',
        });

        setIsModalOpen(true);
    };

    const openDeleteModal = (id) => {
        setProgramToDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsDeleteModalOpen(false);
        form.reset();
    };

    const handleIconChange = (e) => {
        let value = e.target.value;
        if (value.includes('<svg')) {
            const match = value.match(/d="([^"]+)"/);
            if (match && match[1]) value = match[1];
        }
        form.setData('icon_path', value);
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEditing && editId) {
            // FIX: Use router.post directly with _method: 'PUT'
            router.post(route('admin.programs.update', editId), {
                ...form.data,
                _method: 'PUT', // Manually spoof the PUT method
            }, {
                onSuccess: () => closeModal(),
                onFinish: () => form.reset(),
            });
        } else {
            form.post(route('admin.programs.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDeleteProgram = () => {
        if (!programToDeleteId) return;
        const url = `/admin/programs/${programToDeleteId}`;
        router.delete(url, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setProgramToDeleteId(null);
            },
            onError: () => alert("Failed to delete the program."),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800 dark:text-white leading-tight">Assistance Programs</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage the services displayed on the public landing page.</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center px-5 py-2.5 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-md transition-all transform hover:-translate-y-0.5"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Add Program
                    </button>
                </div>
            }
        >
            <Head title="Assistance Programs" />

            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* --- TOOLBAR --- */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-t-xl border-b border-gray-200 dark:border-gray-700 flex items-center justify-between shadow-sm transition-colors">
                        <div className="relative w-full max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition"
                                placeholder="Search programs..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                            Showing <strong>{filteredPrograms.length}</strong> services
                        </div>
                    </div>

                    {/* --- TABLE --- */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-b-xl border border-t-0 border-gray-200 dark:border-gray-700 transition-colors">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider w-20">Icon</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Program Title</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredPrograms.length > 0 ? (
                                        filteredPrograms.map((program) => (
                                            <tr key={program.id} className="hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors duration-150 group">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-800">
                                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={program.icon_path} />
                                                        </svg>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                                                        {program.title}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 max-w-lg truncate" title={program.description}>
                                                        {program.description}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-3">
                                                        <button
                                                            onClick={() => openEditModal(program)}
                                                            className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-full"
                                                            title="Edit"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteModal(program.id)}
                                                            className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-full"
                                                            title="Delete"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-4 mb-3">
                                                        <svg className="h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Programs Found</h3>
                                                    <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                                                        {search ? `No programs match "${search}".` : "Start by adding a new assistance program."}
                                                    </p>
                                                    {!search && (
                                                        <button
                                                            onClick={openCreateModal}
                                                            className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold"
                                                        >
                                                            Create Program &rarr;
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CREATE / EDIT MODAL --- */}
            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={submit} className="p-6 bg-white dark:bg-gray-800 transition-colors">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                        {isEditing ? 'Edit Program' : 'Add New Program'}
                    </h2>

                    <div className="mb-4">
                        <InputLabel htmlFor="title" value="Program Title" className="dark:text-gray-300" />
                        <TextInput
                            id="title"
                            value={form.data.title}
                            onChange={(e) => form.setData('title', e.target.value)}
                            className="mt-1 block w-full dark:bg-gray-900 dark:text-white dark:border-gray-600"
                            placeholder="e.g. Fire Victim Assistance"
                            required
                        />
                        <InputError message={form.errors.title} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <InputLabel htmlFor="description" value="Description" className="dark:text-gray-300" />
                        <TextInput
                            id="description"
                            value={form.data.description}
                            onChange={(e) => form.setData('description', e.target.value)}
                            className="mt-1 block w-full dark:bg-gray-900 dark:text-white dark:border-gray-600"
                            placeholder="Brief details about the assistance..."
                            required
                        />
                        <InputError message={form.errors.description} className="mt-2" />
                    </div>

                    {/* --- NEW REQUIREMENTS FIELD --- */}
                    <div className="mb-4">
                        <InputLabel htmlFor="requirements" value="Requirements (comma-separated)" className="dark:text-gray-300" />
                        <textarea
                            id="requirements"
                            value={form.data.requirements}
                            onChange={(e) => form.setData('requirements', e.target.value)}
                            className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm text-sm"
                            rows="3"
                            placeholder="e.g. Valid ID, Barangay Certificate, Medical Abstract"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Separate each requirement with a comma. These will be shown to the applicant.
                        </p>
                        <InputError message={form.errors.requirements} className="mt-2" />
                    </div>

                    {/* --- NEW DEFAULT AMOUNT FIELD --- */}
                    <div className="mb-4">
                        <InputLabel htmlFor="default_amount" value="Default Assistance Amount (₱)" className="dark:text-gray-300" />
                        <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-500 dark:text-gray-400 sm:text-sm">₱</span>
                            </div>
                            <TextInput
                                id="default_amount"
                                type="number"
                                value={form.data.default_amount}
                                onChange={(e) => form.setData('default_amount', e.target.value)}
                                className="block w-full pl-7 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                                placeholder="0.00"
                            />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            This amount will be auto-suggested when approving applications for this program.
                        </p>
                        <InputError message={form.errors.default_amount} className="mt-2" />
                    </div>

                    <div className="mb-6">
                        <InputLabel htmlFor="icon_path" value="SVG Icon Path" className="dark:text-gray-300" />
                        <div className="flex gap-4 items-start">
                            <div className="flex-1">
                                <TextInput
                                    id="icon_path"
                                    value={form.data.icon_path}
                                    onChange={handleIconChange}
                                    className="mt-1 block w-full font-mono text-xs text-gray-600 dark:text-gray-400 dark:bg-gray-900 dark:border-gray-600"
                                    placeholder="Paste SVG path data..."
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Paste the `d="..."` content from a Heroicons SVG.
                                </p>
                            </div>
                            <div className="mt-1 h-10 w-10 rounded bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={form.data.icon_path || 'M13 10V3L4 14h7v7l9-11h-7z'} />
                                </svg>
                            </div>
                        </div>
                        <InputError message={form.errors.icon_path} className="mt-2" />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <SecondaryButton onClick={closeModal} className="dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:border-gray-600">Cancel</SecondaryButton>
                        <PrimaryButton disabled={form.processing} className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700">
                            {isEditing ? 'Save Changes' : 'Create Program'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* --- DELETE CONFIRMATION MODAL --- */}
            <Modal show={isDeleteModalOpen} onClose={closeModal}>
                <div className="p-6 text-center bg-white dark:bg-gray-800 transition-colors">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10 mb-4">
                        <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Program?</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Are you sure you want to delete this program? This action cannot be undone and will remove it from the public landing page.
                    </p>
                    <div className="flex justify-center gap-3">
                        <SecondaryButton onClick={closeModal} className="dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:border-gray-600">Cancel</SecondaryButton>
                        <DangerButton onClick={handleDeleteProgram}>
                            Yes, Delete It
                        </DangerButton>
                    </div>
                </div>
            </Modal>

        </AuthenticatedLayout>
    );
}
