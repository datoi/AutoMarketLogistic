import { Head, router } from '@inertiajs/react';
import { useState, useCallback, useRef, useEffect } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import CarCard from '@/Components/CarCard';
import Pagination from '@/Components/Pagination';

const CONDITIONS   = ['Excellent', 'Good', 'Fair', 'Poor'];
const STATUSES     = ['In Transit', 'At Port', 'Available', 'Sold'];
const FUELS        = ['Gasoline', 'Diesel', 'Hybrid', 'Electric', 'Other'];
const TRANSMISSIONS = ['Automatic', 'Manual', 'CVT', 'Other'];

const SORTS = [
    { value: '',           label: 'Newest First' },
    { value: 'price_asc',  label: 'Price: Low → High' },
    { value: 'price_desc', label: 'Price: High → Low' },
    { value: 'year_desc',  label: 'Year: Newest' },
    { value: 'year_asc',   label: 'Year: Oldest' },
    { value: 'mileage_asc',  label: 'Mileage: Lowest' },
    { value: 'mileage_desc', label: 'Mileage: Highest' },
];

export default function Inventory({ vehicles, filters, makes }) {
    const [form, setForm] = useState({
        search:       filters.search       ?? '',
        make:         filters.make         ?? '',
        year_min:     filters.year_min     ?? '',
        year_max:     filters.year_max     ?? '',
        price_min:    filters.price_min    ?? '',
        price_max:    filters.price_max    ?? '',
        condition:    filters.condition    ?? '',
        status:       filters.status       ?? '',
        fuel_type:    filters.fuel_type    ?? '',
        transmission: filters.transmission ?? '',
        sort:         filters.sort         ?? '',
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const debounceTimer = useRef(null);

    useEffect(() => () => clearTimeout(debounceTimer.current), []);

    const apply = useCallback((next) => {
        router.get(route('inventory.index'), next, {
            preserveState: true,
            replace: true,
        });
    }, []);

    const handleChange = (key, value) => {
        const next = { ...form, [key]: value };
        setForm(next);
        if (key === 'search') {
            clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(() => apply(next), 400);
        } else {
            apply(next);
        }
    };

    const reset = () => {
        const empty = Object.fromEntries(Object.keys(form).map((k) => [k, '']));
        setForm(empty);
        apply(empty);
    };

    const activeCount = Object.entries(form).filter(([k, v]) => k !== 'sort' && Boolean(v)).length;

    return (
        <PublicLayout>
            <Head title="Inventory" />

            {/* Page header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <nav className="text-xs text-ink-400 mb-3 flex items-center gap-1.5">
                        <a href={route('home')} className="hover:text-ink-700">Home</a>
                        <span>/</span>
                        <span className="text-ink-700 font-medium">Inventory</span>
                    </nav>
                    <h1 className="text-2xl sm:text-3xl font-bold text-ink-900">Vehicle Inventory</h1>
                    <p className="text-ink-500 text-sm mt-1">
                        {vehicles.total} vehicle{vehicles.total !== 1 ? 's' : ''} available — sourced from USA Copart auctions
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        {/* Mobile filter toggle */}
                        <button
                            onClick={() => setSidebarOpen((v) => !v)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-ink-700 bg-white hover:border-brand-300 hover:text-brand-600 transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                            </svg>
                            Filters
                            {activeCount > 0 && <span className="bg-brand-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">{activeCount}</span>}
                        </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-ink-500">
                        <label htmlFor="sort" className="hidden sm:inline">Sort by:</label>
                        <select
                            id="sort"
                            value={form.sort}
                            onChange={(e) => handleChange('sort', e.target.value)}
                            className="border border-gray-200 bg-white rounded-lg text-sm px-3 py-2 text-ink-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        >
                            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex gap-6">
                    {/* Sidebar */}
                    <aside className={`w-64 flex-shrink-0 ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 space-y-6 sticky top-32">
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold text-ink-900">Filters</h2>
                                {activeCount > 0 && (
                                    <button onClick={reset} className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                                        Clear all
                                    </button>
                                )}
                            </div>

                            <FilterGroup label="Search">
                                <input
                                    type="text"
                                    value={form.search}
                                    onChange={(e) => handleChange('search', e.target.value)}
                                    placeholder="Make, model, VIN…"
                                    className="input"
                                />
                            </FilterGroup>

                            <FilterGroup label="Make">
                                <select
                                    value={form.make}
                                    onChange={(e) => handleChange('make', e.target.value)}
                                    className="input"
                                >
                                    <option value="">All Makes</option>
                                    {makes.map((m) => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </FilterGroup>

                            <FilterGroup label="Year">
                                <div className="flex gap-2">
                                    <input type="number" placeholder="From" value={form.year_min} onChange={(e) => handleChange('year_min', e.target.value)} className="input" />
                                    <input type="number" placeholder="To" value={form.year_max} onChange={(e) => handleChange('year_max', e.target.value)} className="input" />
                                </div>
                            </FilterGroup>

                            <FilterGroup label="Price (USD)">
                                <div className="flex gap-2">
                                    <input type="number" placeholder="Min" value={form.price_min} onChange={(e) => handleChange('price_min', e.target.value)} className="input" />
                                    <input type="number" placeholder="Max" value={form.price_max} onChange={(e) => handleChange('price_max', e.target.value)} className="input" />
                                </div>
                            </FilterGroup>

                            <FilterGroup label="Condition">
                                <CheckList name="condition" options={CONDITIONS} value={form.condition} onChange={(v) => handleChange('condition', v)} />
                            </FilterGroup>

                            <FilterGroup label="Fuel Type">
                                <CheckList name="fuel_type" options={FUELS} value={form.fuel_type} onChange={(v) => handleChange('fuel_type', v)} />
                            </FilterGroup>

                            <FilterGroup label="Transmission">
                                <CheckList name="transmission" options={TRANSMISSIONS} value={form.transmission} onChange={(v) => handleChange('transmission', v)} />
                            </FilterGroup>
                        </div>
                    </aside>

                    {/* Grid */}
                    <div className="flex-1 min-w-0">
                        {vehicles.data.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-card text-center py-20 px-6 text-ink-500">
                                <div className="w-16 h-16 mx-auto mb-4 bg-brand-50 rounded-full flex items-center justify-center text-brand-500">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="font-semibold text-ink-900">No vehicles match your filters</p>
                                <p className="text-sm mt-1">Try adjusting or clearing your search.</p>
                                <button onClick={reset} className="mt-5 inline-flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                                    Clear filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {vehicles.data.map((v) => <CarCard key={v.id} vehicle={v} />)}
                                </div>
                                <Pagination links={vehicles.links} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

function FilterGroup({ label, children }) {
    return (
        <div>
            <label className="block text-[11px] font-semibold text-ink-400 uppercase tracking-wider mb-2">{label}</label>
            {children}
        </div>
    );
}

function CheckList({ name, options, value, onChange }) {
    return (
        <div className="space-y-1.5">
            {options.map((opt) => (
                <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                        type="checkbox"
                        name={name}
                        checked={value === opt}
                        onChange={() => onChange(value === opt ? '' : opt)}
                        className="text-brand-500 focus:ring-brand-500 h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-ink-600 group-hover:text-ink-900 transition">{opt}</span>
                </label>
            ))}
        </div>
    );
}
