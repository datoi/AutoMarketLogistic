import { Head, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Contact({ vehicleId, vehicleTitle, settings = {} }) {
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        vehicle_id:      vehicleId ?? '',
        name:            '',
        email:           '',
        phone:           '',
        car_of_interest: vehicleTitle ?? '',
        message:         '',
        // Honeypot — invisible to humans, irresistible to dumb bots. Server discards
        // any submission where this is filled in.
        website:         '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('contact.store'), {
            preserveScroll: true,
            onSuccess: () => reset('name', 'email', 'phone', 'vehicle_id', 'car_of_interest', 'message'),
        });
    };

    return (
        <PublicLayout>
            <Head title="Contact Us" />

            {/* Hero banner */}
            <div className="relative bg-ink-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-800 to-brand-900/70" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
                    <span className="text-xs font-semibold text-brand-300 uppercase tracking-wider">Contact</span>
                    <h1 className="text-3xl sm:text-4xl font-bold mt-2">Get in touch with our team</h1>
                    <p className="text-gray-300 text-sm sm:text-base mt-3 max-w-xl">
                        Tell us what you're looking for — we typically respond within 24 hours.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
                    {/* Info */}
                    <div className="space-y-6">
                        <ContactInfo
                            icon={<PhoneIcon />}
                            title="Phone"
                            primary={settings.contact_phone ?? '+995 32 205 42 44'}
                            secondary={settings.contact_hours ?? 'Mon–Sat, 9:00–18:00'}
                            href={`tel:${(settings.contact_phone ?? '+995322054244').replace(/\s/g, '')}`}
                        />
                        <ContactInfo
                            icon={<MailIcon />}
                            title="Email"
                            primary={settings.contact_email ?? 'info@automarketlogistic.com'}
                            secondary={settings.contact_reply_time ?? 'We reply within 24h'}
                            href={`mailto:${settings.contact_email ?? 'info@automarketlogistic.com'}`}
                        />
                        <ContactInfo
                            icon={<LocationIcon />}
                            title="Office"
                            primary={settings.contact_address_line1 ?? '123 Auto Logistics Blvd'}
                            secondary={settings.contact_address_line2 ?? 'Tbilisi, Georgia'}
                        />

                        <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5 text-sm text-brand-900">
                            <strong className="block mb-1">Looking for a specific vehicle?</strong>
                            Tell us your budget, preferred make and model — we'll source it from
                            USA Copart auctions on your behalf.
                        </div>
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-card p-6 sm:p-8 lg:p-10">
                        <h2 className="font-bold text-ink-900 text-xl sm:text-2xl mb-1">Send us a message</h2>
                        <p className="text-sm text-ink-500 mb-7">All fields marked * are required.</p>

                        {wasSuccessful ? (
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-8 text-center">
                                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="font-semibold text-lg">Message sent!</p>
                                <p className="text-sm mt-2">We'll get back to you within 24 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="space-y-5">
                                {/* Honeypot — hidden from humans (off-screen + not focusable + autocomplete off) */}
                                <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
                                    <label htmlFor="website">Website (leave blank)</label>
                                    <input
                                        id="website"
                                        type="text"
                                        name="website"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        value={data.website}
                                        onChange={(e) => setData('website', e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <Field label="Full Name *" error={errors.name}>
                                        <input value={data.name} onChange={(e) => setData('name', e.target.value)}
                                            className="input" placeholder="John Doe" required />
                                    </Field>
                                    <Field label="Phone *" error={errors.phone}>
                                        <input value={data.phone} onChange={(e) => setData('phone', e.target.value)}
                                            className="input" placeholder="+1 555 000 1234" required />
                                    </Field>
                                </div>
                                <Field label="Email *" error={errors.email}>
                                    <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)}
                                        className="input" placeholder="you@example.com" required />
                                </Field>
                                <Field label="Vehicle of Interest" error={errors.car_of_interest}>
                                    <input value={data.car_of_interest} onChange={(e) => setData('car_of_interest', e.target.value)}
                                        className="input" placeholder="e.g. 2021 BMW 5 Series" />
                                </Field>
                                <Field label="Message" error={errors.message}>
                                    <textarea value={data.message} onChange={(e) => setData('message', e.target.value)}
                                        className="input" rows={5} placeholder="Tell us your requirements, budget, delivery location…" />
                                </Field>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-lg transition shadow-sm"
                                >
                                    {processing ? 'Sending…' : (
                                        <>
                                            Send Message
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

function Field({ label, error, children }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-ink-600 uppercase tracking-wide mb-1.5">{label}</label>
            {children}
            {error && <p className="text-xs text-rose-600 mt-1.5">{error}</p>}
        </div>
    );
}

function ContactInfo({ icon, title, primary, secondary, href }) {
    const inner = (
        <>
            <div className="w-11 h-11 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center flex-shrink-0">
                {icon}
            </div>
            <div className="min-w-0">
                <div className="font-semibold text-ink-900 text-sm">{title}</div>
                <div className="text-sm text-ink-700 mt-0.5 truncate">{primary}</div>
                <div className="text-xs text-ink-400 mt-0.5">{secondary}</div>
            </div>
        </>
    );

    if (href) {
        return (
            <a href={href} className="flex gap-4 group hover:text-brand-600 transition">
                {inner}
            </a>
        );
    }
    return <div className="flex gap-4">{inner}</div>;
}

function PhoneIcon() {
    return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
}
function MailIcon() {
    return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
}
function LocationIcon() {
    return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
}
