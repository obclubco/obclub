"use client";

import { useState } from "react";

/** Lightweight YouTube facade, shows the poster + play button, swaps to the
 * real iframe only on click (keeps the page fast, no autoplay tracking on load). */
export default function YouTube({
  id,
  title,
  className = "",
}: {
  id: string;
  title: string;
  className?: string;
}) {
  const [play, setPlay] = useState(false);
  const poster = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  return (
    <div
      className={`group relative aspect-video w-full overflow-hidden rounded-xl border border-[var(--border-2)] bg-black ${className}`}
    >
      {play ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          loading="lazy"
          allow="accelerated-sensors; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          data-hover
          onClick={() => setPlay(true)}
          className="group absolute inset-0 h-full w-full cursor-pointer"
          aria-label={`Play: ${title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-[1.03] group-hover:opacity-95"
            loading="lazy"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
          <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[var(--bg)] shadow-[0_10px_40px_-8px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-110">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="absolute bottom-4 left-5 inline-flex items-center rounded bg-black px-2.5 py-1 text-left text-[13px] font-medium text-white">
            Watch episode
          </span>
        </button>
      )}
    </div>
  );
}
