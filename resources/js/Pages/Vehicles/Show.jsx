import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import ImageGallery from '@/Components/ImageGallery';
import CarCard from '@/Components/CarCard';

export default function Show({ vehicle, related }) {
    const specs = [
        { label: 'Year',         value: vehicle.year },
        { label: 'Make',         value: vehicle.make },
        { label: 'Model',        value: vehicle.model },
        { label: 'Trim',         value: vehicle.trim },
        { label: 'Mileage',      value: vehicle.mileage ? `${Number(vehicle.mileage).toLocaleString()} mi` : null },
        { label: 'Engine',       value: vehicle.engine },
        { label: 'Fuel Type',    value: vehicle.fuel_type },
        { label: 'Transmission', value: vehicle.transmission },
        { label: 'Condition',    value: vehicle.condition },
        { label: 'Location',     value: vehicle.location },
        { label: 'Lot #',        value: vehicle.lot_number },
        { label: 'VIN',          value: vehicle.vin },
    ].filter((s) => s.value);

    return (
        <PublicLayout>
            <Head title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Breadcrumb */}
                <nav className="text-xs text-ink-400 mb-6 flex items-center gap-1.5 flex-wrap">
                    <Link href={route('home')} className="hover:text-ink-700">Home</Link>
                    <span>/</span>
                    <Link href={route('inventory.index')} className="hover:text-ink-700">Inventory</Link>
                    <span>/</span>
                    <span className="text-ink-700 font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Gallery + Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <ImageGallery
                            images={(vehicle.images ?? []).map((i) => i.url)}
                            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                        />

                        {/* Title + Price (mobile only — desktop has it in sidebar) */}
                        <div className="lg:hidden">
                            <h1 className="text-2xl font-bold text-ink-900">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                                {vehicle.trim && <span className="text-ink-500 font-normal text-lg"> {vehicle.trim}</span>}
                            </h1>
                            <div className="mt-3 flex items-baseline gap-3">
                                <span className="text-3xl font-extrabold text-brand-600">
                                    ${Number(vehicle.price).toLocaleString()}
                                </span>
                                <span className="text-xs text-ink-400 uppercase tracking-wide">Import price</span>
                            </div>
                            {vehicle.estimated_arrival && (
                                <p className="text-sm text-ink-500 mt-2">
                                    Estimated arrival:{' '}
                                    <strong className="text-ink-700">
                                        {new Date(vehicle.estimated_arrival).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </strong>
                                </p>
                            )}
                        </div>

                        {/* Specs */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 lg:p-7">
                            <h2 className="font-semibold text-ink-900 mb-5 flex items-center gap-2">
                                <span className="w-1 h-5 bg-brand-500 rounded-full" />
                                Vehicle Specifications
                            </h2>
                            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                                {specs.map((s) => (
                                    <div key={s.label}>
                                        <dt className="text-[11px] text-ink-400 uppercase tracking-wider">{s.label}</dt>
                                        <dd className="mt-1 text-sm font-semibold text-ink-900 break-all">{s.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        {/* Damage */}
                        {(vehicle.primary_damage || vehicle.secondary_damage) && (
                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                                <h2 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" />
                                    </svg>
                                    Damage Disclosure
                                </h2>
                                <div className="space-y-1.5 text-sm text-amber-800">
                                    {vehicle.primary_damage && (
                                        <div><span className="font-medium">Primary:</span> {vehicle.primary_damage}</div>
                                    )}
                                    {vehicle.secondary_damage && (
                                        <div><span className="font-medium">Secondary:</span> {vehicle.secondary_damage}</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Highlights */}
                        {vehicle.highlights?.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 lg:p-7">
                                <h2 className="font-semibold text-ink-900 mb-4 flex items-center gap-2">
                                    <span className="w-1 h-5 bg-brand-500 rounded-full" />
                                    Highlights
                                </h2>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {vehicle.highlights.map((h, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-sm text-ink-700">
                                            <svg className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Description */}
                        {vehicle.description && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 lg:p-7">
                                <h2 className="font-semibold text-ink-900 mb-4 flex items-center gap-2">
                                    <span className="w-1 h-5 bg-brand-500 rounded-full" />
                                    Description
                                </h2>
                                <p className="text-sm text-ink-700 leading-relaxed whitespace-pre-line">{vehicle.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Right: Sticky CTA */}
                    <div className="lg:col-span-1">
                        <div className="lg:sticky lg:top-32 space-y-4">
                            {/* Title + price (desktop) */}
                            <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-card p-6">
                                <h1 className="text-2xl font-bold text-ink-900 leading-tight">
                                    {vehicle.year} {vehicle.make} {vehicle.model}
                                </h1>
                                {vehicle.trim && (
                                    <p className="text-sm text-ink-500 mt-1">{vehicle.trim}</p>
                                )}
                                <div className="mt-5 pt-5 border-t border-gray-100">
                                    <div className="text-xs text-ink-400 uppercase tracking-wider">Import price</div>
                                    <div className="text-3xl font-extrabold text-brand-600 mt-1">
                                        ${Number(vehicle.price).toLocaleString()}
                                    </div>
                                    <div className="text-xs text-ink-500 mt-1">USD, all-in to your delivery point</div>
                                </div>
                                {vehicle.estimated_arrival && (
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-start gap-2 text-sm text-ink-600">
                                        <svg className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>
                                            Estimated arrival<br />
                                            <strong className="text-ink-900">
                                                {new Date(vehicle.estimated_arrival).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </strong>
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Inquiry CTA */}
                            <div className="bg-gradient-to-br from-ink-800 to-ink-900 text-white rounded-2xl p-6 shadow-card">
                                <h2 className="font-bold text-lg mb-1">Interested in this vehicle?</h2>
                                <p className="text-sm text-gray-300 mb-5">
                                    Talk to our import team — we'll confirm availability, pricing and delivery options.
                                </p>

                                <a
                                    href="tel:+995592243623"
                                    className="flex items-center justify-center gap-2 w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 rounded-lg transition shadow-lg"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path d="M2 3.5A1.5 1.5 0 013.5 2h2.379a1.5 1.5 0 011.42 1.026l1.04 3.12a1.5 1.5 0 01-.502 1.685l-1.343.96a11.042 11.042 0 005.116 5.116l.96-1.343a1.5 1.5 0 011.685-.502l3.12 1.04A1.5 1.5 0 0118 14.621V17a1.5 1.5 0 01-1.5 1.5h-1C7.387 18.5 1.5 12.613 1.5 5.5v-1z" />
                                    </svg>
                                    +995 592 243 623
                                </a>

                                <Link
                                    href={route('contact', { vehicle: vehicle.id })}
                                    className="mt-3 flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold py-3 rounded-lg transition"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Send a Message
                                </Link>

                                <div className="mt-5 pt-5 border-t border-white/10 grid grid-cols-3 gap-3 text-center text-[11px] text-gray-400 uppercase tracking-wider">
                                    <div>
                                        <div className="text-brand-400 font-bold text-base normal-case tracking-normal">12+</div>
                                        Years
                                    </div>
                                    <div>
                                        <div className="text-brand-400 font-bold text-base normal-case tracking-normal">500+</div>
                                        Imports
                                    </div>
                                    <div>
                                        <div className="text-brand-400 font-bold text-base normal-case tracking-normal">98%</div>
                                        Happy
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related */}
                {related?.length > 0 && (
                    <div className="mt-16 lg:mt-20">
                        <div className="flex items-end justify-between mb-8">
                            <h2 className="text-xl sm:text-2xl font-bold text-ink-900">More {vehicle.make} Vehicles</h2>
                            <Link
                                href={route('inventory.index', { make: vehicle.make })}
                                className="text-brand-600 hover:text-brand-700 font-semibold text-sm"
                            >
                                View all {vehicle.make} →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {related.map((v) => <CarCard key={v.id} vehicle={v} />)}
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
