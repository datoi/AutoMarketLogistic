import { usePage } from '@inertiajs/react';

/**
 * Translation hook. Returns a `t(key, replacements)` helper that looks up the
 * key in the shared `translations` Inertia prop and falls back to the key
 * itself when no value exists — so missing translations render as English
 * (English-as-key) instead of "[missing translation]".
 *
 * Usage:
 *   const t = useTranslate();
 *   <h1>{t('How importing works')}</h1>
 *   <p>{t('Hello, :name', { name: user.name })}</p>
 */
export function useTranslate() {
    const { translations = {} } = usePage().props;
    return (key, replacements = {}) => {
        let str = translations[key] ?? key;
        for (const [k, v] of Object.entries(replacements)) {
            str = str.replace(new RegExp(`:${k}\\b`, 'g'), String(v));
        }
        return str;
    };
}
