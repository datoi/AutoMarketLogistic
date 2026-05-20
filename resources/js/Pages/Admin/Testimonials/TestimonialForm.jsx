import { useState } from 'react';

export default function TestimonialForm({ form, onSubmit, submitLabel, existingPhotoUrl = null }) {
    const { data, setData, errors, processing } = form;
    const [photoPreview, setPhotoPreview] = useState(null);
    const [keepPhoto, setKeepPhoto] = useState(true);

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0] ?? null;
        setData('photo', file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setPhotoPreview(ev.target.result);
            reader.readAsDataURL(file);
        } else {
            setPhotoPreview(null);
        }
    };

    const clearPhoto = () => {
        setData('photo', null);
        setData('keep_photo', false);
        setKeepPhoto(false);
        setPhotoPreview(null);
    };

    const previewSrc = photoPreview || (keepPhoto ? existingPhotoUrl : null);

    return (
        <form onSubmit={onSubmit} className="space-y-6" encType="multipart/form-data">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-5">Testimonial Details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Name *" error={errors.name}>
                        <input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="input"
                            placeholder="Giorgi M."
                            required
                        />
                    </Field>
                    <Field label="City" error={errors.city}>
                        <input
                            value={data.city}
                            onChange={(e) => setData('city', e.target.value)}
                            className="input"
                            placeholder="Tbilisi"
                        />
                    </Field>
                    <Field label="Vehicle (e.g., 2020 BMW X5)" error={errors.vehicle_label} className="sm:col-span-2">
                        <input
                            value={data.vehicle_label}
                            onChange={(e) => setData('vehicle_label', e.target.value)}
                            className="input"
                            placeholder="2020 BMW X5"
                        />
                    </Field>
                    <Field label="Quote * (10–500 chars)" error={errors.quote} className="sm:col-span-2">
                        <textarea
                            value={data.quote}
                            onChange={(e) => setData('quote', e.target.value)}
                            className="input min-h-[120px]"
                            rows={4}
                            maxLength={500}
                            required
                        />
                        <p className="text-xs text-gray-400 mt-1">{(data.quote || '').length}/500</p>
                    </Field>
                    <Field label="Rating *" error={errors.rating}>
                        <select
                            value={data.rating}
                            onChange={(e) => setData('rating', Number(e.target.value))}
                            className="input"
                            required
                        >
                            {[5, 4, 3, 2, 1].map((r) => (
                                <option key={r} value={r}>{r} star{r !== 1 ? 's' : ''}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Sort order (lower = first)" error={errors.sort_order}>
                        <input
                            type="number"
                            min="0"
                            value={data.sort_order}
                            onChange={(e) => setData('sort_order', e.target.value)}
                            className="input"
                            placeholder="0"
                        />
                    </Field>
                </div>

                <div className="mt-5 flex items-center gap-2">
                    <input
                        id="is_active"
                        type="checkbox"
                        checked={!!data.is_active}
                        onChange={(e) => setData('is_active', e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <label htmlFor="is_active" className="text-sm text-gray-700">Active (show on homepage)</label>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Photo (optional)</h3>
                <p className="text-xs text-gray-500 mb-4">Square crop recommended. Max 2 MB. JPG/PNG/WebP.</p>

                {previewSrc && (
                    <div className="flex items-center gap-4 mb-4">
                        <img src={previewSrc} alt="Avatar preview" className="w-16 h-16 rounded-full object-cover border border-gray-200" />
                        <button
                            type="button"
                            onClick={clearPhoto}
                            className="text-xs text-red-600 hover:text-red-700"
                        >
                            Remove photo
                        </button>
                    </div>
                )}

                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {errors.photo && <p className="text-xs text-red-600 mt-1">{errors.photo}</p>}
            </div>

            <div className="flex items-center justify-end gap-3">
                <button
                    type="submit"
                    disabled={processing}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
                >
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
