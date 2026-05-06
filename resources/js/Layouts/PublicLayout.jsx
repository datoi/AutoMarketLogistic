import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function PublicLayout({ children }) {
    const { auth, flash } = usePage().props;
    const [menuOpen, setMenuOpen] = useState(false);
    const [toast, setToast] = useState(null);

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
                        <a href="tel:+995592243623" className="flex items-center gap-1.5 hover:text-white transition">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            +995 592 243 623
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
                            <NavItem href={route('home')} label="Home" />
                            <NavItem href={route('inventory.index')} label="Inventory" />
                            <NavItem href={route('contact')} label="Contact" />
                            <div className="w-px h-6 bg-gray-200 mx-2" />
                            {auth?.user ? (
                                auth.user.is_admin ? (
                                    <Link
                                        href={route('admin.dashboard')}
                                        className="bg-brand-500 hover:bg-brand-600 px-4 py-2 rounded-lg text-white transition shadow-sm"
                                    >
                                        Admin Panel
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
                                    Get a Quote
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
                        <MobileNavItem href={route('home')} label="Home" onClick={() => setMenuOpen(false)} />
                        <MobileNavItem href={route('inventory.index')} label="Inventory" onClick={() => setMenuOpen(false)} />
                        <MobileNavItem href={route('contact')} label="Contact" onClick={() => setMenuOpen(false)} />
                        {auth?.user && (
                            auth.user.is_admin ? (
                                <MobileNavItem href={route('admin.dashboard')} label="Admin Panel" onClick={() => setMenuOpen(false)} />
                            ) : (
                                <MobileNavItem href={route('profile.edit')} label={auth.user.name} onClick={() => setMenuOpen(false)} />
                            )
                        )}
                        <a
                            href="tel:+995592243623"
                            className="mt-2 flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white py-2.5 rounded-lg transition"
                        >
                            Call us
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
                        </div>

                        {/* Links */}
                        <div>
                            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Explore</h4>
                            <ul className="space-y-2.5 text-sm">
                                <li><Link href={route('home')} className="hover:text-white transition">Home</Link></li>
                                <li><Link href={route('inventory.index')} className="hover:text-white transition">Inventory</Link></li>
                                <li><Link href={route('contact')} className="hover:text-white transition">Contact Us</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
                            <ul className="space-y-2.5 text-sm">
                                <li><a href="mailto:info@automarketlogistic.com" className="hover:text-white transition">info@automarketlogistic.com</a></li>
                                <li><a href="tel:+995592243623" className="hover:text-white transition">+995 592 243 623</a></li>
                                <li className="text-gray-500">Mon–Sat 9:00 – 18:00</li>
                            </ul>
                        </div>

                        {/* CTA */}
                        <div>
                            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Ready to Import?</h4>
                            <p className="text-sm mb-4 text-gray-400">Tell us your dream vehicle — we'll source it from auction.</p>
                            <Link
                                href={route('contact')}
                                className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
                            >
                                Get Started
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
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
