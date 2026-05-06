import { Link } from '@inertiajs/react';

const LABEL_MAP = {
    '&laquo; Previous': 'Previous',
    'Next &raquo;': 'Next',
};

function resolveLabel(raw) {
    return LABEL_MAP[raw] ?? raw;
}

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <nav className="flex justify-center gap-1 flex-wrap mt-8">
            {links.map((link, i) => {
                if (!link.url && !link.active) {
                    return (
                        <span key={i} className="px-3 py-2 text-sm text-gray-400 select-none">
                            {resolveLabel(link.label)}
                        </span>
                    );
                }
                return (
                    <Link
                        key={i}
                        href={link.url ?? '#'}
                        className={`px-3.5 py-2 text-sm rounded-lg border transition ${
                            link.active
                                ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                                : 'bg-white text-ink-600 border-gray-200 hover:border-brand-300 hover:text-brand-600'
                        }`}
                    >
                        {resolveLabel(link.label)}
                    </Link>
                );
            })}
        </nav>
    );
}
