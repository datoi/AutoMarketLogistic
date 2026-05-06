import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import CarCard from '@/Components/CarCard';

export default function Home({ featured = [] }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('inventory.index'), { search }, { preserveState: false });
    };

    return (
        <PublicLayout>
            <Head title="Import Your Dream Car From USA Auctions" />

            {/* Hero */}
            <section className="relative bg-ink-900 text-white overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2000&q=80)' }}
                    aria-hidden="true"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-800 to-brand-900/80" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-2 bg-brand-500/15 border border-brand-500/30 text-brand-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
                            Direct from Copart USA Auctions
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-6 tracking-tight">
                            Import Your <span className="text-brand-400">Dream Car</span><br className="hidden sm:block" />
                            from the USA
                        </h1>

                        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg bg-white/5 backdrop-blur p-1.5 rounded-xl border border-white/10">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by make, model, VIN…"
                                className="flex-1 bg-transparent px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-brand-500 hover:bg-brand-600 px-6 py-2.5 rounded-lg font-semibold transition shadow-lg"
                            >
                                Search
                            </button>
                        </form>

                        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                            <Link
                                href={route('inventory.index')}
                                className="inline-flex items-center gap-2 text-white font-medium hover:text-brand-300 transition"
                            >
                                Browse all inventory
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                            <span className="text-gray-600">|</span>
                            <Link
                                href={route('contact')}
                                className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition"
                            >
                                Need help finding a vehicle?
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats bar */}
            <section className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
                        {[
                            { val: '500+', label: 'Vehicles Imported' },
                            { val: '12+',  label: 'Years of Experience' },
                            { val: '50+',  label: 'Countries Served' },
                            { val: '98%',  label: 'Client Satisfaction' },
                        ].map((s) => (
                            <div key={s.label} className="px-4 py-6 text-center">
                                <div className="text-2xl sm:text-3xl font-extrabold text-brand-600">{s.val}</div>
                                <div className="text-ink-500 text-xs sm:text-sm mt-1 uppercase tracking-wide">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Vehicles */}
            {featured.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
                    <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
                        <div>
                            <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Available now</span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 mt-1">Featured Vehicles</h2>
                            <p className="text-ink-500 text-sm mt-1">Hand-picked imports ready to reserve</p>
                        </div>
                        <Link
                            href={route('inventory.index')}
                            className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-semibold text-sm group"
                        >
                            View all inventory
                            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featured.map((v) => <CarCard key={v.id} vehicle={v} />)}
                    </div>
                </section>
            )}

            {/* How it works */}
            <section className="bg-gradient-to-b from-gray-50 to-white py-16 lg:py-24 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Simple Process</span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 mt-2 mb-3">From Auction to Your Door</h2>
                        <p className="text-ink-500 text-sm sm:text-base">Four steps. We handle everything between selecting your vehicle and delivery.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { step: '01', title: 'Browse Inventory',  desc: 'Explore vehicles in transit or available at our USA partner lots.' },
                            { step: '02', title: 'Reserve Vehicle',   desc: 'Submit an inquiry and our team confirms availability and price.' },
                            { step: '03', title: 'We Handle Import',  desc: 'Full logistics: shipping, customs, paperwork — handled end to end.' },
                            { step: '04', title: 'Take Delivery',     desc: 'Receive your vehicle at your nearest port or doorstep.' },
                        ].map((item, i) => (
                            <div key={item.step} className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center font-extrabold text-lg">
                                        {item.step}
                                    </div>
                                    {i < 3 && (
                                        <svg className="hidden lg:block w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    )}
                                </div>
                                <h3 className="font-semibold text-ink-900 mb-2">{item.title}</h3>
                                <p className="text-ink-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust strip */}
            <section className="bg-white py-14 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Trust
                            title="Transparent pricing"
                            desc="Auction price, shipping, customs and our fee — every cost shown upfront, no surprises."
                            icon={
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.66 0-3 .9-3 2s1.34 2 3 2 3 .9 3 2-1.34 2-3 2m0-8v1m0 8v1m0-10a4 4 0 100 8 4 4 0 000-8z" />
                            }
                        />
                        <Trust
                            title="Door-to-door delivery"
                            desc="From the USA auction lot to your driveway. We coordinate every leg of the journey."
                            icon={
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17a2 2 0 104 0 2 2 0 00-4 0zm6 0a2 2 0 104 0 2 2 0 00-4 0zM3 6h13l1 4h4v7h-2M3 6v11h6" />
                            }
                        />
                        <Trust
                            title="Trusted since 2012"
                            desc="Over a decade of importing premium vehicles for clients across Georgia, Ukraine and beyond."
                            icon={
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            }
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative bg-ink-900 text-white py-16 lg:py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-800 to-brand-800/60" />
                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Ready to Import Your Vehicle?</h2>
                    <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                        Tell us the make, model and budget — our team will find the right vehicle at auction
                        and handle everything from purchase to delivery.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href={route('contact')}
                            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-7 py-3 rounded-lg transition shadow-lg"
                        >
                            Get a Free Quote
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <a
                            href="tel:+995592243623"
                            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-7 py-3 rounded-lg transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Call us
                        </a>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

function Trust({ title, desc, icon }) {
    return (
        <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icon}
                </svg>
            </div>
            <div>
                <h3 className="font-semibold text-ink-900 mb-1">{title}</h3>
                <p className="text-ink-500 text-sm leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
