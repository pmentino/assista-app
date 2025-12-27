import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';

export default function SettingsIndex({ auth, settings }) {
    // Initialize form with data from database (No Mayor)
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        accepting_applications: settings.accepting_applications === '1',
        system_announcement: settings.system_announcement || '',
        signatory_cswdo_head: settings.signatory_cswdo_head || 'PERSEUS L. CORDOVA',
        signatory_social_worker: settings.signatory_social_worker || 'BIVIEN B. DELA CRUZ, RSW',
    });

    const submit = (e) => {
        e.preventDefault();
        const formData = {
            ...data,
            accepting_applications: data.accepting_applications ? '1' : '0'
        };
        post(route('admin.settings.update'), formData);
    };

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">System Configuration</h2>}
        >
            <Head title="System Settings" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">

                    <form onSubmit={submit} className="space-y-6">

                        {/* --- CARD 1: SYSTEM CONTROLS --- */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-800">Application Controls</h3>
                                <p className="text-sm text-gray-500">Manage the availability of the online application portal.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Accept Online Applications</h4>
                                        <p className="text-sm text-gray-500">If disabled, the "Apply Now" button will be hidden for all users.</p>
                                    </div>
                                    {/* Toggle Switch */}
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={data.accepting_applications}
                                            onChange={(e) => setData('accepting_applications', e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div>
                                    <InputLabel htmlFor="system_announcement" value="Global Announcement (Optional)" />
                                    <TextInput
                                        id="system_announcement"
                                        className="mt-1 block w-full"
                                        value={data.system_announcement}
                                        onChange={(e) => setData('system_announcement', e.target.value)}
                                        placeholder="e.g. Office closed on Dec 25 due to Holiday."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">This text will appear at the top of the Welcome page if set.</p>
                                </div>
                            </div>
                        </div>

                        {/* --- CARD 2: OFFICIAL SIGNATORIES --- */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-800">Document Signatories</h3>
                                <p className="text-sm text-gray-500">Update the names appearing on Claim Stubs and Official Reports.</p>
                            </div>
                            <div className="p-6 grid grid-cols-1 gap-6">
                                <div>
                                    <InputLabel htmlFor="signatory_social_worker" value="Social Worker / Verifier" />
                                    <TextInput
                                        id="signatory_social_worker"
                                        className="mt-1 block w-full"
                                        value={data.signatory_social_worker}
                                        onChange={(e) => setData('signatory_social_worker', e.target.value)}
                                        placeholder="e.g. BIVIEN B. DELA CRUZ, RSW"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Appears as "Assessed By" on Claim Stub.</p>
                                </div>
                                <div>
                                    <InputLabel htmlFor="signatory_cswdo_head" value="CSWDO Head / Approving Officer" />
                                    <TextInput
                                        id="signatory_cswdo_head"
                                        className="mt-1 block w-full"
                                        value={data.signatory_cswdo_head}
                                        onChange={(e) => setData('signatory_cswdo_head', e.target.value)}
                                        placeholder="e.g. PERSEUS L. CORDOVA"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Appears as "Approved By" on Claim Stub.</p>
                                </div>
                            </div>
                        </div>

                        {/* --- ACTION BAR --- */}
                        <div className="flex items-center justify-end gap-4">
                            <Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0">
                                <p className="text-sm text-green-600 font-bold">Settings Updated.</p>
                            </Transition>
                            <PrimaryButton disabled={processing} className="bg-blue-800 hover:bg-blue-900 px-6 py-3 text-lg">
                                Save Configuration
                            </PrimaryButton>
                        </div>

                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
