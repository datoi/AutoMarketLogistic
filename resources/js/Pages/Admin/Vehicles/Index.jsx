import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatusBadge from '@/Components/StatusBadge';
import Pagination from '@/Components/Pagination';

export default function Index({ vehicles, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.vehicles.index'), { search: search || undefined }, { preserveState: true, replace: true });
    };

    const destroy = (id) => {
        if (confirm('Delete this vehicle? This cannot be undone.')) {
            router.delete(route('admin.vehicles.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Vehicles</h2>}>
            <Head title="Admin – Vehicles" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-lg">
                            {flash.success}
                        </div>
                    )}

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-50 flex-wrap">
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search make or model…"
                                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-56"
                                />
                                <button type="submit" className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm transition">
                                    Search
                                </button>
                            </form>
                            <Link
                                href={route('admin.vehicles.create')}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                            >
                                + Add Vehicle
                            </Link>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Vehicle</th>
                                        <th className="px-4 py-3 text-left">Lot #</th>
                                        <th className="px-4 py-3 text-left">Price</th>
                                        <th className="px-4 py-3 text-left">Mileage</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                        <th className="px-4 py-3 text-left">Condition</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {vehicles.data.length === 0 ? (
                                        <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">No vehicles found.</td></tr>
                                    ) : vehicles.data.map((v) => (
                                        <tr key={v.id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-3">
                                                <div className="font-medium text-gray-900">{v.year} {v.make} {v.model}</div>
                                                {v.trim && <div className="text-xs text-gray-400">{v.trim}</div>}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">{v.lot_number}</td>
                                            <td className="px-4 py-3 font-semibold text-gray-900">${Number(v.price).toLocaleString()}</td>
                                            <td className="px-4 py-3 text-gray-500">{Number(v.mileage).toLocaleString()} mi</td>
                                            <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                                            <td className="px-4 py-3 text-gray-500">{v.condition}</td>
                                            <td className="px-4 py-3 text-right space-x-3">
                                                <Link
                                                    href={route('inventory.show', v.id)}
                                                    target="_blank"
                                                    className="text-gray-400 hover:text-gray-700 transition"
                                                    title="View public page"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={route('admin.vehicles.edit', v.id)}
                                                    className="text-blue-600 hover:text-blue-700 transition"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => destroy(v.id)}
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
                            <Pagination links={vehicles.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
