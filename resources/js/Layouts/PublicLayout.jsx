import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useTranslate } from '@/lib/i18n';

export default function PublicLayout({ children }) {
    const { auth, flash, publicSettings = {}, popularMakes = [] } = usePage().props;
    const t = useTranslate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [toast, setToast] = useState(null);

    const fallbackMakes = ['BMW', 'Mercedes', 'Toyota'];
    const footerMakes = popularMakes.length ? popularMakes : fallbackMakes;
    const addr1 = publicSettings.contact_address_line1;
    const addr2 = publicSettings.contact_address_line2;
    const mapsQuery = [addr1, addr2].filter(Boolean).join(', ');

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
            const t = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(t);
        }
        if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
            const t = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(t);
        }
    }, [flash]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Top contact strip */}
            <div className="hidden md:block bg-ink-900 text-gray-300 text-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <a href="tel:+995322054244" className="flex items-center gap-1.5 hover:text-white transition">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            +995 32 205 42 44
                        </a>
                        <a href="mailto:info@automarketlogistic.com" className="flex items-center gap-1.5 hover:text-white transition">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            info@automarketlogistic.com
                        </a>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Mon–Sat 9:00 – 18:00
                    </div>
                </div>
            </div>

            {/* Header */}
            <header className="bg-white text-ink-800 border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href={route('home')} className="flex items-center gap-3">
                            <img
                                src="/images/amlgc-logo.png"
                                alt="AutoMarket Logistic"
                                className="h-10 w-auto"
                            />
                            <span className="hidden lg:block font-semibold text-sm text-ink-500 border-l border-gray-200 pl-3 leading-tight">
                                Vehicle Import<br />
                                <span className="text-brand-600">From USA Auctions</span>
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
                            <NavItem href={route('home')} label={t('Home')} />
                            <NavItem href={route('inventory.index')} label={t('Inventory')} />
                            <NavItem href={route('contact')} label={t('Contact')} />
                            <LanguageSwitcher />
                            <div className="w-px h-6 bg-gray-200 mx-2" />
                            {auth?.user ? (
                                auth.user.is_admin ? (
                                    <Link
                                        href={route('admin.dashboard')}
                                        className="bg-brand-500 hover:bg-brand-600 px-4 py-2 rounded-lg text-white transition shadow-sm"
                                    >
                                        {t('Admin Panel')}
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('profile.edit')}
                                        className="text-ink-500 hover:text-ink-800 transition px-3 py-2"
                                    >
                                        {auth.user.name}
                                    </Link>
                                )
                            ) : (
                                <Link
                                    href={route('contact')}
                                    className="bg-brand-500 hover:bg-brand-600 px-4 py-2 rounded-lg text-white transition shadow-sm"
                                >
                                    {t('Get a Quote')}
                                </Link>
                            )}
                        </nav>

                        {/* Mobile hamburger */}
                        <button
                            className="md:hidden p-2 rounded text-ink-500 hover:text-ink-800 hover:bg-gray-100"
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-label="Toggle menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {menuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3 space-y-1 text-sm font-medium">
                        <LanguageSwitcher variant="mobile" />
                        <MobileNavItem href={route('home')} label={t('Home')} onClick={() => setMenuOpen(false)} />
                        <MobileNavItem href={route('inventory.index')} label={t('Inventory')} onClick={() => setMenuOpen(false)} />
                        <MobileNavItem href={route('contact')} label={t('Contact')} onClick={() => setMenuOpen(false)} />
                        {auth?.user && (
                            auth.user.is_admin ? (
                                <MobileNavItem href={route('admin.dashboard')} label={t('Admin Panel')} onClick={() => setMenuOpen(false)} />
                            ) : (
                                <MobileNavItem href={route('profile.edit')} label={auth.user.name} onClick={() => setMenuOpen(false)} />
                            )
                        )}
                        <a
                            href="tel:+995322054244"
                            className="mt-2 flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white py-2.5 rounded-lg transition"
                        >
                            {t('Call us')}
                        </a>
                    </div>
                )}
            </header>

            {/* Toast */}
            {toast && (
                <div
                    role="status"
                    className={`fixed top-24 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all ${
                        toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
                    }`}
                >
                    {toast.message}
                </div>
            )}

            {/* Main content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-ink-800 text-gray-400 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {/* Brand */}
                        <div className="lg:col-span-1">
                            <img
                                src="/images/amlgc-logo.png"
                                alt="AutoMarket Logistic"
                                className="h-10 w-auto mb-4 brightness-0 invert opacity-90"
                            />
                            <p className="text-sm leading-relaxed text-gray-400">
                                Your trusted partner for importing premium vehicles directly from USA Copart auctions —
                                door to door, since 2012.
                            </p>
                            {(publicSettings.social_facebook || publicSettings.social_instagram || publicSettings.social_whatsapp) && (
                                <div className="flex items-center gap-2 mt-5">
                                    {publicSettings.social_facebook && (
                                        <a
                                            href={publicSettings.social_facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Facebook"
                                            className="w-9 h-9 rounded-full border border-white/10 hover:bg-brand-500 hover:border-brand-500 hover:text-white flex items-center justify-center transition"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                            </svg>
                                        </a>
                                    )}
                                    {publicSettings.social_instagram && (
                                        <a
                                            href={publicSettings.social_instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Instagram"
                                            className="w-9 h-9 rounded-full border border-white/10 hover:bg-brand-500 hover:border-brand-500 hover:text-white flex items-center justify-center transition"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth={2} />
                                                <circle cx="12" cy="12" r="4" strokeWidth={2} />
                                                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                                            </svg>
                                        </a>
                                    )}
                                    {publicSettings.social_whatsapp && (
                                        <a
                                            href={publicSettings.social_whatsapp}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="WhatsApp"
                                            className="w-9 h-9 rounded-full border border-white/10 hover:bg-brand-500 hover:border-brand-500 hover:text-white flex items-center justify-center transition"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Inventory */}
                        <div>
                            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Inventory</h4>
                            <ul className="space-y-2.5 text-sm">
                                <li><Link href={route('inventory.index')} className="hover:text-white transition">All Vehicles</Link></li>
                                {footerMakes.map((m) => (
                                    <li key={m}>
                                        <Link
                                            href={`${route('inventory.index')}?make=${encodeURIComponent(m)}`}
                                            className="hover:text-white transition"
                                        >
                                            {m}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
                            <ul className="space-y-2.5 text-sm">
                                <li><a href={`${route('home')}#how-it-works`} className="hover:text-white transition">How it works</a></li>
                                <li><Link href={route('contact')} className="hover:text-white transition">Contact</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
                            <ul className="space-y-2.5 text-sm">
                                <li><a href="tel:+995322054244" className="hover:text-white transition">+995 32 205 42 44</a></li>
                                <li><a href="mailto:info@automarketlogistic.com" className="hover:text-white transition">info@automarketlogistic.com</a></li>
                                {(addr1 || addr2) && (
                                    <li className="text-gray-500 leading-relaxed">
                                        {addr1 && <div>{addr1}</div>}
                                        {addr2 && <div>{addr2}</div>}
                                        {mapsQuery && (
                                            <a
                                                href={`https://maps.google.com/?q=${encodeURIComponent(mapsQuery)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 mt-1.5 text-brand-400 hover:text-brand-300 transition"
                                            >
                                                Get directions
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </a>
                                        )}
                                    </li>
                                )}
                                <li className="text-gray-500">Mon–Sat 9:00 – 18:00</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Trust band */}
                <div className="bg-ink-900/50 border-t border-white/5 py-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-gray-500 text-center flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3">
                        <span>Since 2012</span>
                        <span className="hidden sm:inline">·</span>
                        <span>500+ vehicles imported</span>
                        <span className="hidden sm:inline">·</span>
                        <span>12+ years</span>
                        <span className="hidden sm:inline">·</span>
                        <span>98% satisfaction</span>
                    </div>
                </div>

                <div className="bg-ink-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
                        <span>© {new Date().getFullYear()} AutoMarket Logistic. All rights reserved.</span>
                        <span>Importing from USA since 2012</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function NavItem({ href, label }) {
    return (
        <Link
            href={href}
            className="text-ink-600 hover:text-brand-600 hover:bg-brand-50 px-3 py-2 rounded-md transition"
        >
            {label}
        </Link>
    );
}

function MobileNavItem({ href, label, onClick }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="block py-2.5 px-2 text-ink-700 hover:text-brand-600 hover:bg-brand-50 rounded-md transition"
        >
            {label}
        </Link>
    );
}
