import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ testimonials }) {
    const { flash } = usePage().props;

    const destroy = (id) => {
        if (confirm('Delete this testimonial? This cannot be undone.')) {
            router.delete(route('admin.testimonials.destroy', id));
        }
    };

    const toggle = (id) => {
        router.patch(route('admin.testimonials.toggle', id), {}, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Testimonials</h2>}>
            <Head title="Admin – Testimonials" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-lg">
                            {flash.success}
                        </div>
                    )}

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-50">
                            <p className="text-sm text-gray-500">
                                Homepage shows the first 3 active testimonials (sorted). Section is hidden if fewer than 3 are active.
                            </p>
                            <Link
                                href={route('admin.testimonials.create')}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap"
                            >
                                + Add Testimonial
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Name</th>
                                        <th className="px-4 py-3 text-left">Quote</th>
                                        <th className="px-4 py-3 text-left">City</th>
                                        <th className="px-4 py-3 text-left">Rating</th>
                                        <th className="px-4 py-3 text-left">Sort</th>
                                        <th className="px-4 py-3 text-left">Active</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {testimonials.data.length === 0 ? (
                                        <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">No testimonials yet.</td></tr>
                                    ) : testimonials.data.map((t) => (
                                        <tr key={t.id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-3">
                                                <div className="font-medium text-gray-900">{t.name}</div>
                                                {t.vehicle_label && <div className="text-xs text-gray-400">{t.vehicle_label}</div>}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 max-w-md">
                                                <span className="line-clamp-2">{t.quote}</span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">{t.city ?? '—'}</td>
                                            <td className="px-4 py-3 text-amber-500">{'★'.repeat(t.rating)}<span className="text-gray-200">{'★'.repeat(5 - t.rating)}</span></td>
                                            <td className="px-4 py-3 text-gray-500">{t.sort_order}</td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => toggle(t.id)}
                                                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                                                        t.is_active
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {t.is_active ? 'Visible' : 'Hidden'}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-right space-x-3">
                                                <Link
                                                    href={route('admin.testimonials.edit', t.id)}
                                                    className="text-blue-600 hover:text-blue-700 transition"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => destroy(t.id)}
                                                    className="text-red-500 hover:text-red-700 transition"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-50">
                            <Pagination links={testimonials.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
