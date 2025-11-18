import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm, Link, usePage } from '@inertiajs/react'; // <-- Import usePage

export default function CreateNews() {
    // 1. Get 'auth' from the global props using the hook
    const { auth } = usePage().props;

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
            // 2. Use optional chaining to safely pass the user
            user={auth?.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create News</h2>}
        >
            <Head title="Create News" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="space-y-6 max-w-xl">
                                <div>
                                    <InputLabel htmlFor="title" value="Title" />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                        isFocused
                                    />
                                    <InputError className="mt-2" message={errors.title} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="content" value="Content" />
                                    <textarea
                                        id="content"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows="6"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        required
                                    ></textarea>
                                    <InputError className="mt-2" message={errors.content} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="image" value="Image (Optional)" />
                                    <input
                                        id="image"
                                        type="file"
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        onChange={(e) => setData('image', e.target.files[0])}
                                    />
                                    <InputError className="mt-2" message={errors.image} />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>Publish News</PrimaryButton>
                                    <Link href={route('admin.news.index')} className="text-gray-600 hover:text-gray-900">Cancel</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
