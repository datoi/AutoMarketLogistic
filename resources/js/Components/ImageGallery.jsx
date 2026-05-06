import { useState } from 'react';

export default function ImageGallery({ images, alt }) {
    const list = images?.length ? images : ['https://placehold.co/800x600/232837/9aa1ad?text=No+Image'];
    const [active, setActive] = useState(0);

    const prev = () => setActive((i) => (i - 1 + list.length) % list.length);
    const next = () => setActive((i) => (i + 1) % list.length);

    return (
        <div>
            {/* Main image */}
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-100 shadow">
                <img
                    src={list[active]}
                    alt={`${alt} – photo ${active + 1}`}
                    className="w-full h-full object-cover"
                />
                {list.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            {active + 1} / {list.length}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {list.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {list.map((src, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition ${
                                i === active ? 'border-brand-500 ring-2 ring-brand-200' : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                        >
                            <img src={src} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
