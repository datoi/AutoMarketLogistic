import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatusBadge from '@/Components/StatusBadge';

export default function Dashboard({ stats, recentInquiries, recentVehicles }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>}>
            <Head title="Admin Dashboard" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <StatCard label="Total Vehicles" value={stats.total_vehicles} color="blue" />
                        <StatCard label="In Transit"     value={stats.in_transit}      color="blue" />
                        <StatCard label="At Port"        value={stats.at_port}         color="amber" />
                        <StatCard label="Available"      value={stats.available}       color="green" />
                        <StatCard label="Sold"           value={stats.sold}            color="gray" />
                        <StatCard label="Total Inquiries" value={stats.total_inquiries} color="indigo" />
                        <StatCard label="New Inquiries"  value={stats.new_inquiries}   color="red" />
                    </div>

                    {/* Quick actions */}
                    <div className="flex gap-3 flex-wrap">
                        <Link href={route('admin.vehicles.create')}
                            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition">
                            + Add Vehicle
                        </Link>
                        <Link href={route('admin.vehicles.index')}
                            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition">
                            Manage Vehicles
                        </Link>
                        <Link href={route('admin.inquiries.index')}
                            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition">
                            View Inquiries
                            {stats.new_inquiries > 0 && (
                                <span className="ml-2 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                                    {stats.new_inquiries}
                                </span>
                            )}
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Inquiries */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                                <h3 className="font-semibold text-gray-900">Recent Inquiries</h3>
                                <Link href={route('admin.inquiries.index')} className="text-xs text-red-600 hover:underline">View all</Link>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {recentInquiries.length === 0 ? (
                                    <p className="text-sm text-gray-500 px-6 py-4">No inquiries yet.</p>
                                ) : recentInquiries.map((inq) => (
                                    <div key={inq.id} className="px-6 py-3 flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{inq.name}</p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {inq.vehicle ? `${inq.vehicle.year} ${inq.vehicle.make} ${inq.vehicle.model}` : inq.car_of_interest || '—'}
                                            </p>
                                        </div>
                                        <StatusBadge status={inq.status} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Vehicles */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                                <h3 className="font-semibold text-gray-900">Recent Vehicles</h3>
                                <Link href={route('admin.vehicles.index')} className="text-xs text-red-600 hover:underline">View all</Link>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {recentVehicles.length === 0 ? (
                                    <p className="text-sm text-gray-500 px-6 py-4">No vehicles yet.</p>
                                ) : recentVehicles.map((v) => (
                                    <div key={v.id} className="px-6 py-3 flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {v.year} {v.make} {v.model}
                                            </p>
                                            <p className="text-xs text-gray-500">${Number(v.price).toLocaleString()}</p>
                                        </div>
                                        <StatusBadge status={v.status} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const colorMap = {
    blue:   'bg-blue-50 text-blue-700',
    amber:  'bg-amber-50 text-amber-700',
    green:  'bg-green-50 text-green-700',
    gray:   'bg-gray-100 text-gray-600',
    indigo: 'bg-indigo-50 text-indigo-700',
    red:    'bg-red-50 text-red-700',
};

function StatCard({ label, value, color }) {
    return (
        <div className={`rounded-xl p-5 ${colorMap[color]}`}>
            <div className="text-3xl font-extrabold">{value}</div>
            <div className="text-sm mt-1 font-medium opacity-80">{label}</div>
        </div>
    );
}
