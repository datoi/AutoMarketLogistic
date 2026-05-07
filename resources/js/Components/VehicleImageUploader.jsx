import { useEffect, useMemo, useRef, useState } from 'react';

const ACCEPT = 'image/jpeg,image/jpg,image/png,image/webp';
const MAX_BYTES = 5 * 1024 * 1024;
const MAX_TOTAL = 20;

export default function VehicleImageUploader({
    existingImages = [],
    newFiles = [],
    onChangeExisting,
    onChangeNewFiles,
    error,
}) {
    const inputRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);
    const [localError, setLocalError] = useState(null);

    const previews = useMemo(
        () => newFiles.map((file) => ({ file, url: URL.createObjectURL(file) })),
        [newFiles]
    );

    useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p.url)), [previews]);

    const totalCount = existingImages.length + newFiles.length;

    const addFiles = (incoming) => {
        setLocalError(null);
        const accepted = [];
        const rejected = [];

        for (const file of incoming) {
            if (!ACCEPT.split(',').includes(file.type)) {
                rejected.push(`${file.name}: unsupported type`);
                continue;
            }
            if (file.size > MAX_BYTES) {
                rejected.push(`${file.name}: over 5 MB`);
                continue;
            }
            accepted.push(file);
        }

        const room = MAX_TOTAL - totalCount;
        if (accepted.length > room) {
            rejected.push(`Only ${room} more image(s) allowed (max ${MAX_TOTAL} total)`);
            accepted.splice(room);
        }

        if (rejected.length) setLocalError(rejected.join(' • '));
        if (accepted.length) onChangeNewFiles([...newFiles, ...accepted]);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        addFiles(Array.from(e.dataTransfer.files || []));
    };

    const removeExisting = (url) => onChangeExisting(existingImages.filter((u) => u !== url));
    const removeNewFile = (idx) => onChangeNewFiles(newFiles.filter((_, i) => i !== idx));

    const displayError = error || localError;

    return (
        <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
                Images <span className="text-gray-400 font-normal">({totalCount}/{MAX_TOTAL})</span>
            </label>

            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                    dragOver ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPT}
                    multiple
                    className="hidden"
                    onChange={(e) => {
                        addFiles(Array.from(e.target.files || []));
                        e.target.value = '';
                    }}
                />
                <div className="text-sm text-gray-600">
                    <span className="font-semibold text-red-600">Click to browse</span> or drag & drop
                </div>
                <div className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — up to 5 MB each, {MAX_TOTAL} max</div>
            </div>

            {displayError && <p className="text-xs text-red-600 mt-2">{displayError}</p>}

            {(existingImages.length > 0 || previews.length > 0) && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
                    {existingImages.map((url) => (
                        <Thumb key={url} src={url} onRemove={() => removeExisting(url)} badge="Saved" />
                    ))}
                    {previews.map((p, idx) => (
                        <Thumb
                            key={`new-${idx}-${p.file.name}`}
                            src={p.url}
                            onRemove={() => removeNewFile(idx)}
                            badge="New"
                            badgeColor="bg-emerald-600"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function Thumb({ src, onRemove, badge, badgeColor = 'bg-gray-700' }) {
    return (
        <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group bg-gray-100">
            <img src={src} alt="" className="w-full h-full object-cover" />
            <span className={`absolute top-1 left-1 ${badgeColor} text-white text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded`}>
                {badge}
            </span>
            <button
                type="button"
                onClick={onRemove}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 hover:bg-white text-gray-800 hover:text-red-600 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                aria-label="Remove image"
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </div>
    );
}
