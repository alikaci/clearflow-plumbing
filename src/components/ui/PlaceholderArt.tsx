import type { ReactNode } from "react";
import { images } from "@/config/images";
import type { ImageFallbackMotif, ImageKey } from "@/types";

function gridPattern(uid: string): ReactNode {
  return (
    <>
      <defs>
        <pattern
          id={`ph-grid-${uid}`}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M40 0H0V40"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.05"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="400" height="300" fill={`url(#ph-grid-${uid})`} />
      <circle cx="330" cy="60" r="110" fill="#1473e6" fillOpacity="0.12" />
      <circle cx="50" cy="270" r="120" fill="#f97316" fillOpacity="0.06" />
    </>
  );
}

const motifs: Record<ImageFallbackMotif, (uid: string) => ReactNode> = {
  pipes: (uid) => (
    <>
      {gridPattern(uid)}
      <path
        d="M-10 210H120V120H260"
        fill="none"
        stroke="#155fa8"
        strokeWidth="26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M-10 210H120V120H260"
        fill="none"
        stroke="#1473e6"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="120" cy="210" r="16" fill="#0b1f33" stroke="#1473e6" strokeWidth="7" />
      <circle cx="260" cy="120" r="16" fill="#0b1f33" stroke="#1473e6" strokeWidth="7" />
    </>
  ),
  tank: (uid) => (
    <>
      {gridPattern(uid)}
      <rect x="150" y="55" width="100" height="150" rx="22" fill="#1473e6" fillOpacity="0.85" />
      <rect x="166" y="72" width="68" height="10" rx="5" fill="#eaf4ff" fillOpacity="0.6" />
      <circle cx="200" cy="150" r="20" fill="#0b1f33" stroke="#eaf4ff" strokeOpacity="0.5" strokeWidth="5" />
      <path d="M200 48v-22M160 205v20M240 205v20" stroke="#155fa8" strokeWidth="10" strokeLinecap="round" />
    </>
  ),
  drain: (uid) => (
    <>
      {gridPattern(uid)}
      <circle cx="200" cy="150" r="78" fill="#0b1f33" stroke="#1473e6" strokeWidth="10" />
      <circle cx="200" cy="150" r="48" fill="none" stroke="#eaf4ff" strokeOpacity="0.35" strokeWidth="6" />
      <path
        d="M200 150 158 108M200 150l42-42M200 150l-42 42M200 150l42 42"
        stroke="#eaf4ff"
        strokeOpacity="0.4"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="200" cy="150" r="12" fill="#f97316" />
    </>
  ),
  droplet: (uid) => (
    <>
      {gridPattern(uid)}
      <path
        d="M200 55s58 66 58 103a58 58 0 0 1-116 0c0-37 58-103 58-103Z"
        fill="#1473e6"
      />
      <path
        d="M172 168a28 28 0 0 0 28 28"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.55"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </>
  ),
  van: (uid) => (
    <>
      {gridPattern(uid)}
      <rect x="70" y="110" width="170" height="80" rx="12" fill="#1473e6" />
      <path d="M240 130h44l34 40v20h-78z" fill="#155fa8" />
      <rect x="256" y="140" width="42" height="24" rx="4" fill="#eaf4ff" fillOpacity="0.7" />
      <circle cx="128" cy="196" r="22" fill="#0b1f33" stroke="#eaf4ff" strokeOpacity="0.6" strokeWidth="7" />
      <circle cx="286" cy="196" r="22" fill="#0b1f33" stroke="#eaf4ff" strokeOpacity="0.6" strokeWidth="7" />
    </>
  ),
  people: (uid) => (
    <>
      {gridPattern(uid)}
      <circle cx="160" cy="118" r="26" fill="#1473e6" />
      <path d="M118 214a42 42 0 0 1 84 0Z" fill="#155fa8" />
      <circle cx="248" cy="126" r="24" fill="#155fa8" />
      <path d="M210 214a38 38 0 0 1 76 0Z" fill="#1473e6" />
    </>
  ),
  before: (uid) => (
    <>
      {gridPattern(uid)}
      <circle cx="200" cy="150" r="80" fill="#3b4a5c" />
      <path
        d="M148 202 252 98M166 214 264 116"
        stroke="#f97316"
        strokeOpacity="0.55"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <circle cx="200" cy="150" r="80" fill="none" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="6" />
    </>
  ),
  after: (uid) => (
    <>
      {gridPattern(uid)}
      <circle cx="200" cy="150" r="80" fill="#1473e6" fillOpacity="0.9" />
      <path
        d="m162 150 26 26 52-56"
        fill="none"
        stroke="#ffffff"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  brand: (uid) => (
    <>
      {gridPattern(uid)}
      <path
        d="M200 68s52 60 52 94a52 52 0 0 1-104 0c0-34 52-94 52-94Z"
        fill="#1473e6"
      />
      <path
        d="M176 172a26 26 0 0 0 26 26"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.55"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <rect x="120" y="228" width="160" height="10" rx="5" fill="#f97316" fillOpacity="0.85" />
    </>
  ),
};

type PlaceholderArtProps = {
  imageKey: ImageKey;
  className?: string;
  objectPosition?: string;
};

export function PlaceholderArt({
  imageKey,
  className = "",
  objectPosition,
}: PlaceholderArtProps) {
  const asset = images[imageKey];

  return (
    <div
      role={asset.decorative ? undefined : "img"}
      aria-label={asset.decorative ? undefined : asset.alt}
      aria-hidden={asset.decorative ? true : undefined}
      className={["relative overflow-hidden bg-navy", className]
        .filter(Boolean)
        .join(" ")}
      style={{ aspectRatio: asset.aspectRatio, objectPosition }}
    >
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      >
        <rect width="400" height="300" fill="#0b1f33" />
        {motifs[asset.motif](imageKey)}
      </svg>
      <span className="absolute bottom-2 left-2 rounded-full bg-navy/80 px-2.5 py-1 text-[0.6875rem] font-medium text-footer-text">
        Concept visual
      </span>
    </div>
  );
}
