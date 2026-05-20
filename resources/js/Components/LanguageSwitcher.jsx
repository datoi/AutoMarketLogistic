import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function LanguageSwitcher({ variant = 'header' }) {
    const { locale, supportedLocales = {} } = usePage().props;
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function onClick(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    /**
     * Swap the locale segment in the current path and navigate. URL-canonical
     * locales mean a full browser navigation is the right primitive — Inertia's
     * router.visit would also work but a hard navigation avoids any stale shared
     * props from the previous locale leaking into the next render.
     */
    const switchTo = (newLocale) => {
        if (newLocale === locale) {
            setOpen(false);
            return;
        }
        const supportedCodes = Object.keys(supportedLocales);
        const pattern = new RegExp(`^/(${supportedCodes.join('|')})(/|$)`);
        const pathname = window.location.pathname;
        const swapped = pattern.test(pathname)
            ? pathname.replace(pattern, `/${newLocale}$2`)
            : `/${newLocale}${pathname === '/' ? '' : pathname}`;
        window.location.href = swapped + window.location.search + window.location.hash;
    };

    const current = supportedLocales[locale] ?? { native: (locale || '').toUpperCase(), label: locale };

    if (variant === 'mobile') {
        return (
            <div className="border-b border-gray-100 pb-3 mb-2">
                <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider px-2 mb-2">Language</p>
                <div className="grid grid-cols-2 gap-2">
                    {Object.entries(supportedLocales).map(([code, info]) => (
                        <button
                            key={code}
                            type="button"
                            onClick={() => switchTo(code)}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition text-left ${
                                code === locale
                                    ? 'bg-brand-50 text-brand-700'
                                    : 'text-ink-700 hover:bg-gray-50'
                            }`}
                        >
                            {info.label}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-ink-600 hover:text-brand-600 hover:bg-brand-50 transition"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m4.5 14L9 7m0 0L4.5 19M7 15h4m5 5v-6m0 0l-2 4m2-4l2 4" />
                </svg>
                {current.native}
                <svg className={`w-3 h-3 transition ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && (
                <div
                    role="listbox"
                    className="absolute right-0 mt-1 min-w-[160px] bg-white border border-gray-100 rounded-lg shadow-card py-1 z-50"
                >
                    {Object.entries(supportedLocales).map(([code, info]) => (
                        <button
                            key={code}
                            type="button"
                            role="option"
                            aria-selected={code === locale}
                            onClick={() => switchTo(code)}
                            className={`w-full flex items-center justify-between px-3 py-2 text-sm transition ${
                                code === locale ? 'text-brand-600 font-semibold' : 'text-ink-700 hover:bg-gray-50'
                            }`}
                        >
                            {info.label}
                            {code === locale && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
