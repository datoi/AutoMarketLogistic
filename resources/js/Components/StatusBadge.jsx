const colours = {
    'In Transit': 'bg-blue-100 text-blue-800',
    'At Port':    'bg-amber-100 text-amber-800',
    'Available':  'bg-green-100 text-green-800',
    'Sold':       'bg-gray-200 text-gray-600',
    'new':        'bg-blue-100 text-blue-800',
    'contacted':  'bg-amber-100 text-amber-800',
    'closed':     'bg-gray-200 text-gray-600',
};

export default function StatusBadge({ status, className = '' }) {
    return (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${colours[status] ?? 'bg-gray-100 text-gray-600'} ${className}`}>
            {status}
        </span>
    );
}
