import { Link } from '@inertiajs/react';

export default function CarCard({ vehicle }) {
    const image = vehicle.images?.[0]?.url ?? 'https://placehold.co/800x600/232837/9aa1ad?text=No+Image';

    return (
        <Link
            href={route('inventory.show', vehicle.id)}
            className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover overflow-hidden border border-gray-100 hover:border-brand-200 flex flex-col transition"
        >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                    src={image}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    loading="lazy"
                />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-ink-900 text-base leading-tight group-hover:text-brand-600 transition">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                </h3>
                {vehicle.trim && (
                    <p className="text-xs text-ink-500 mt-0.5">{vehicle.trim}</p>
                )}

                {/* Specs grid */}
                <div className="mt-4 grid grid-cols-2 gap-y-2 gap-x-3 text-xs text-ink-500 border-t border-gray-100 pt-4">
                    <Spec label="Mileage" value={`${vehicle.mileage.toLocaleString()} mi`} />
                    <Spec label="Condition" value={vehicle.condition} />
                    {vehicle.fuel_type && <Spec label="Fuel" value={vehicle.fuel_type} />}
                    {vehicle.transmission && <Spec label="Transmission" value={vehicle.transmission} />}
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <div className="text-xs text-ink-400 uppercase tracking-wide">Price</div>
                        <span className="text-xl font-extrabold text-ink-900">
                            ${Number(vehicle.price).toLocaleString()}
                        </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 group-hover:gap-2 transition-all">
                        View
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </div>
        </Link>
    );
}

function Spec({ label, value }) {
    return (
        <div>
            <div className="text-[10px] text-ink-400 uppercase tracking-wide">{label}</div>
            <div className="text-ink-700 font-medium">{value}</div>
        </div>
    );
}
