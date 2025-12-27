import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function ProgramsIndex({ auth, programs }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    // Form for Create/Edit ONLY
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        title: '',
        description: '',
        icon_path: '',
    });

    const openCreateModal = () => {
        setIsEditing(false);
        setEditId(null);
        reset();
        clearErrors();
        setData('icon_path', 'M13 10V3L4 14h7v7l9-11h-7z');
        setIsModalOpen(true);
    };

    const openEditModal = (program) => {
        setIsEditing(true);
        setEditId(program.id);
        clearErrors();
        setData({
            title: program.title,
            description: program.description,
            icon_path: program.icon_path || '',
        });
        setIsModalOpen(true);
    };

    const openDeleteModal = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsDeleteModalOpen(false);
        reset();
        // Delay clearing IDs to prevent state jumps during close animation
        setTimeout(() => {
            setEditId(null);
            setDeleteId(null);
        }, 200);
    };

    const handleIconChange = (e) => {
        let value = e.target.value;
        if (value.includes('<svg')) {
            const match = value.match(/d="([^"]+)"/);
            if (match && match[1]) value = match[1];
        }
        setData('icon_path', value);
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEditing && editId) {
            put(route('admin.programs.update', editId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.programs.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    // --- FIX: Using router.delete explicitly with the ID ---
    const handleDelete = (e) => {
        e.preventDefault(); // Stop any form submission events

        if (!deleteId) {
            alert("Error: No program selected for deletion.");
            return;
        }

        router.delete(route('admin.programs.destroy', deleteId), {
            onSuccess: () => closeModal(),
            onError: () => alert("Failed to delete the program."),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manage Assistance Programs</h2>}
        >
            <Head title="Assistance Programs" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Header Actions */}
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-600">Add or edit the services displayed on the Welcome page.</p>
                        <PrimaryButton onClick={openCreateModal}>+ Add New Program</PrimaryButton>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Icon</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {programs && programs.length > 0 ? (
                                    programs.map((program) => (
                                        <tr key={program.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={program.icon_path} />
                                                    </svg>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{program.title}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={program.description}>{program.description}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => openEditModal(program)}
                                                    className="text-blue-600 hover:text-blue-900 mr-4 font-bold"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(program.id)}
                                                    className="text-red-600 hover:text-red-900 font-bold"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-gray-500 italic">No programs found. Add one to get started.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- CREATE / EDIT MODAL --- */}
            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {isEditing ? 'Edit Program' : 'Add New Assistance Program'}
                    </h2>

                    <div className="mb-4">
                        <InputLabel htmlFor="title" value="Program Title" />
                        <TextInput
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="e.g. Fire Victim Assistance"
                            required
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <InputLabel htmlFor="description" value="Description" />
                        <TextInput
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="Brief details about the assistance..."
                            required
                        />
                        <InputError message={errors.description} className="mt-2" />
                    </div>

                    <div className="mb-6">
                        <InputLabel htmlFor="icon_path" value="SVG Icon" />
                        <TextInput
                            id="icon_path"
                            value={data.icon_path}
                            onChange={handleIconChange}
                            className="mt-1 block w-full font-mono text-xs text-gray-600"
                            placeholder="Paste SVG code here..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Paste the SVG code from Heroicons and we'll extract the path.
                        </p>
                        <InputError message={errors.icon_path} className="mt-2" />
                    </div>

                    <div className="flex justify-end">
                        <SecondaryButton onClick={closeModal} className="mr-3">Cancel</SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            {isEditing ? 'Save Changes' : 'Create Program'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* --- DELETE CONFIRMATION MODAL --- */}
            <Modal show={isDeleteModalOpen} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900">Confirm Deletion</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Are you sure you want to delete this program? It will no longer appear on the Welcome page.
                    </p>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal} className="mr-3">Cancel</SecondaryButton>
                        {/* FIX: Using standard onClick + type="button" to prevent 405 error */}
                        <DangerButton type="button" onClick={handleDelete}>
                            Delete Program
                        </DangerButton>
                    </div>
                </div>
            </Modal>

        </AuthenticatedLayout>
    );
}
