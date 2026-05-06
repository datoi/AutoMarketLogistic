import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatusBadge from '@/Components/StatusBadge';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';

const STATUS_TABS = [
    { value: '',          label: 'All' },
    { value: 'new',       label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'closed',    label: 'Closed' },
];

export default function Index({ inquiries, filters, counts }) {
    const { flash } = usePage().props;
    const [messageModal, setMessageModal] = useState(null);

    const setStatus = (status) => {
        router.get(route('admin.inquiries.index'), { status }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Inquiries</h2>}>
            <Head title="Admin – Inquiries" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-lg">
                            {flash.success}
                        </div>
                    )}

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Status tabs */}
                        <div className="flex gap-1 px-4 pt-4 border-b border-gray-100">
                            {STATUS_TABS.map((tab) => {
                                const count = tab.value === '' ? counts.all : counts[tab.value] ?? 0;
                                const active = (filters.status ?? '') === tab.value;
                                return (
                                    <button
                                        key={tab.value}
                                        onClick={() => setStatus(tab.value)}
                                        className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition ${
                                            active
                                                ? 'border-red-600 text-red-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        {tab.label}
                                        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-red-100' : 'bg-gray-100'}`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Contact</th>
                                        <th className="px-4 py-3 text-left">Vehicle</th>
                                        <th className="px-4 py-3 text-left">Phone</th>
                                        <th className="px-4 py-3 text-left">Message</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                        <th className="px-4 py-3 text-left">Date</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {inquiries.data.length === 0 ? (
                                        <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">No inquiries found.</td></tr>
                                    ) : inquiries.data.map((inq) => (
                                        <InquiryRow key={inq.id} inquiry={inq} onReadMore={setMessageModal} />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-50">
                            <Pagination links={inquiries.links} />
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={messageModal !== null} onClose={() => setMessageModal(null)} maxWidth="lg">
                <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Full Message</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{messageModal}</p>
                    <div className="mt-5 text-right">
                        <button
                            onClick={() => setMessageModal(null)}
                            className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}

function InquiryRow({ inquiry, onReadMore }) {
    const [processing, setProcessing] = useState(false);

    const update = (newStatus) => {
        setProcessing(true);
        router.patch(route('admin.inquiries.update', inquiry.id), { status: newStatus }, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    const destroy = () => {
        if (!confirm('Delete this inquiry? This cannot be undone.')) return;
        router.delete(route('admin.inquiries.destroy', inquiry.id), { preserveScroll: true });
    };

    const vehicleLabel = inquiry.vehicle
        ? `${inquiry.vehicle.year} ${inquiry.vehicle.make} ${inquiry.vehicle.model}`
        : inquiry.car_of_interest || '—';

    return (
        <tr className="hover:bg-gray-50/50 align-top">
            <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{inquiry.name}</div>
                <a href={`mailto:${inquiry.email}`} className="text-xs text-blue-600 hover:underline">{inquiry.email}</a>
            </td>
            <td className="px-4 py-4">
                {inquiry.vehicle ? (
                    <Link href={route('inventory.show', inquiry.vehicle.id)} target="_blank"
                        className="text-blue-600 hover:underline text-xs">
                        {vehicleLabel}
                    </Link>
                ) : (
                    <span className="text-xs text-gray-500">{vehicleLabel}</span>
                )}
            </td>
            <td className="px-4 py-4 text-gray-500 text-xs whitespace-nowrap">{inquiry.phone}</td>
            <td className="px-4 py-4 max-w-xs">
                {inquiry.message ? (
                    <button
                        onClick={() => onReadMore(inquiry.message)}
                        className="text-xs text-gray-500 line-clamp-2 text-left hover:text-blue-600 transition-colors"
                    >
                        {inquiry.message}
                    </button>
                ) : <span className="text-xs text-gray-400">—</span>}
            </td>
            <td className="px-4 py-4"><StatusBadge status={inquiry.status} /></td>
            <td className="px-4 py-4 text-xs text-gray-400 whitespace-nowrap">
                {new Date(inquiry.created_at).toLocaleDateString()}
            </td>
            <td className="px-4 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <select
                        value={inquiry.status}
                        disabled={processing}
                        onChange={(e) => update(e.target.value)}
                        className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                    </select>
                    <button
                        onClick={destroy}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete inquiry"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    );
}
