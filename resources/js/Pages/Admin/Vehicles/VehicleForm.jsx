import { router } from '@inertiajs/react';
import VehicleImageUploader from '@/Components/VehicleImageUploader';

const CONDITIONS   = ['Excellent', 'Good', 'Fair', 'Poor'];
const STATUSES     = ['In Transit', 'At Port', 'Available', 'Sold'];
const FUELS        = ['Gasoline', 'Diesel', 'Hybrid', 'Electric', 'Other'];
const TRANSMISSIONS = ['Automatic', 'Manual', 'CVT', 'Other'];

export default function VehicleForm({ form, onSubmit, submitLabel }) {
    const { data, setData, errors, processing } = form;

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-5">Basic Information</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                    <Field label="Year *" error={errors.year}>
                        <input type="number" value={data.year} onChange={(e) => setData('year', e.target.value)}
                            className="input" placeholder="2021" step="1" required />
                    </Field>
                    <Field label="Make *" error={errors.make}>
                        <input value={data.make} onChange={(e) => setData('make', e.target.value)}
                            className="input" placeholder="BMW" required />
                    </Field>
                    <Field label="Model *" error={errors.model}>
                        <input value={data.model} onChange={(e) => setData('model', e.target.value)}
                            className="input" placeholder="5 Series" required />
                    </Field>
                    <Field label="Trim" error={errors.trim}>
                        <input value={data.trim} onChange={(e) => setData('trim', e.target.value)}
                            className="input" placeholder="530i xDrive" />
                    </Field>
                    <Field label="Price (USD) *" error={errors.price}>
                        <input type="number" step="0.01" min="0" value={data.price} onChange={(e) => setData('price', e.target.value)}
                            className="input" placeholder="28500" required />
                    </Field>
                    <Field label="Mileage *" error={errors.mileage}>
                        <input type="number" min="0" value={data.mileage} onChange={(e) => setData('mileage', e.target.value)}
                            className="input" placeholder="34200" required />
                    </Field>
                    <Field label="Condition *" error={errors.condition}>
                        <select value={data.condition} onChange={(e) => setData('condition', e.target.value)} className="input" required>
                            <option value="">Select…</option>
                            {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </Field>
                    <Field label="Status *" error={errors.status}>
                        <select value={data.status} onChange={(e) => setData('status', e.target.value)} className="input" required>
                            <option value="">Select…</option>
                            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </Field>
                    <Field label="Estimated Arrival" error={errors.estimated_arrival}>
                        <input type="date" value={data.estimated_arrival} onChange={(e) => setData('estimated_arrival', e.target.value)}
                            className="input" min={new Date().toISOString().split('T')[0]} />
                    </Field>
                    <Field label="Color" error={errors.color}>
                        <input value={data.color} onChange={(e) => setData('color', e.target.value)}
                            className="input" placeholder="White, Silver, Blue…" />
                    </Field>
                </div>
                <div className="flex items-center gap-2 pt-1">
                    <input
                        type="checkbox"
                        id="is_featured"
                        checked={!!data.is_featured}
                        onChange={(e) => setData('is_featured', e.target.checked)}
                        className="h-4 w-4 rounded text-red-600 focus:ring-red-500"
                    />
                    <label htmlFor="is_featured" className="text-sm text-gray-700 cursor-pointer">
                        Feature this vehicle on the home page
                    </label>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-5">Identification</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="VIN *" error={errors.vin}>
                        <input value={data.vin} onChange={(e) => setData('vin', e.target.value.toUpperCase())}
                            className="input font-mono" placeholder="WBAJB0C50KB375821" minLength={17} maxLength={17} required />
                    </Field>
                    <Field label="Lot Number *" error={errors.lot_number}>
                        <input value={data.lot_number} onChange={(e) => setData('lot_number', e.target.value)}
                            className="input" placeholder="CP-48291043" required />
                    </Field>
                    <Field label="Location" error={errors.location} className="sm:col-span-2">
                        <input value={data.location} onChange={(e) => setData('location', e.target.value)}
                            className="input" placeholder="Copart – Dallas, TX" />
                    </Field>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-5">Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <Field label="Engine" error={errors.engine}>
                        <input value={data.engine} onChange={(e) => setData('engine', e.target.value)}
                            className="input" placeholder="2.0L Turbo I4" />
                    </Field>
                    <Field label="Fuel Type" error={errors.fuel_type}>
                        <select value={data.fuel_type} onChange={(e) => setData('fuel_type', e.target.value)} className="input">
                            <option value="">Select…</option>
                            {FUELS.map((f) => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </Field>
                    <Field label="Transmission" error={errors.transmission}>
                        <select value={data.transmission} onChange={(e) => setData('transmission', e.target.value)} className="input">
                            <option value="">Select…</option>
                            {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </Field>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-5">Damage & Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Primary Damage" error={errors.primary_damage}>
                        <input value={data.primary_damage} onChange={(e) => setData('primary_damage', e.target.value)}
                            className="input" placeholder="Front End" />
                    </Field>
                    <Field label="Secondary Damage" error={errors.secondary_damage}>
                        <input value={data.secondary_damage} onChange={(e) => setData('secondary_damage', e.target.value)}
                            className="input" placeholder="Mechanical" />
                    </Field>
                    <Field label="Highlights (one per line)" error={errors.highlights} className="sm:col-span-2">
                        <textarea value={data.highlights} onChange={(e) => setData('highlights', e.target.value)}
                            className="input" rows={4} placeholder={"Clean Title\nLow Mileage\nAWD"} />
                    </Field>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-5">Images & Description</h3>
                <div className="space-y-5">
                    <VehicleImageUploader
                        existingImages={data.existing_images || []}
                        newFiles={data.new_files || []}
                        onChangeExisting={(urls) => setData('existing_images', urls)}
                        onChangeNewFiles={(files) => setData('new_files', files)}
                        error={errors['new_files'] || errors['existing_images'] || errors['new_files.0']}
                    />
                    <Field label="Description" error={errors.description}>
                        <textarea value={data.description} onChange={(e) => setData('description', e.target.value)}
                            className="input" rows={5} placeholder="Describe the vehicle, its history, and condition…" />
                    </Field>
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 pb-6">
                <button type="button" onClick={() => router.visit(route('admin.vehicles.index'))}
                    className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm transition">
                    Cancel
                </button>
                <button type="submit" disabled={processing}
                    className="px-8 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold text-sm transition">
                    {processing ? 'Saving…' : submitLabel}
                </button>
            </div>
        </form>
    );
}

function Field({ label, error, children, className = '' }) {
    return (
        <div className={className}>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
            {children}
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
}
