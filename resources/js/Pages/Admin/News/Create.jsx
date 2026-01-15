import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.news.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-white leading-tight">Create News Post</h2>}
        >
            <Head title="Create News" />

            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={submit} className="space-y-6">

                                {/* Title Input */}
                                <div>
                                    <InputLabel htmlFor="title" value="Title" className="dark:text-gray-300" />
                                    <TextInput
                                        id="title"
                                        className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                        isFocused
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                {/* Content Textarea */}
                                <div>
                                    <InputLabel htmlFor="content" value="Content" className="dark:text-gray-300" />
                                    <textarea
                                        id="content"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 rounded-md shadow-sm"
                                        rows="6"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.content} className="mt-2" />
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <InputLabel htmlFor="image" value="Image (Optional)" className="dark:text-gray-300" />
                                    <input
                                        id="image"
                                        type="file"
                                        className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-md file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-indigo-50 file:text-indigo-700
                                            hover:file:bg-indigo-100
                                            dark:file:bg-indigo-900/50 dark:file:text-indigo-300
                                            dark:hover:file:bg-indigo-900/70
                                            transition-colors"
                                        onChange={(e) => setData('image', e.target.files[0])}
                                        accept="image/*"
                                    />
                                    <InputError message={errors.image} className="mt-2" />
                                </div>

                                <div className="flex items-center gap-4 pt-2">
                                    <PrimaryButton disabled={processing} className="dark:bg-indigo-600 dark:hover:bg-indigo-500">
                                        Publish News
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
