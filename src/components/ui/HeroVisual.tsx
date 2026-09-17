/*
Decorative hero placeholder. It preserves the intended 4:3 photo aspect ratio and
uses the brand palette so the layout is final before the approved hero image
arrives. To replace: swap this <div>-wrapped <svg> for the approved next/image
(4:3, priority) and delete this file's internals.
*/
export function HeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-navy"
    >
      <svg
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <pattern
            id="hero-grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M50 0H0V50"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.06"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect width="800" height="600" fill="#0b1f33" />
        <rect width="800" height="600" fill="url(#hero-grid)" />
        <circle cx="610" cy="130" r="210" fill="#1473e6" fillOpacity="0.12" />
        <circle cx="150" cy="510" r="170" fill="#f97316" fillOpacity="0.07" />

        <path
          d="M-20 470H250V300H520"
          fill="none"
          stroke="#155fa8"
          strokeWidth="30"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M-20 470H250V300H520"
          fill="none"
          stroke="#1473e6"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M-20 470H250V300H520"
          fill="none"
          stroke="#eaf4ff"
          strokeOpacity="0.55"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="2 26"
        />

        <path
          d="M250 300V120"
          fill="none"
          stroke="#155fa8"
          strokeWidth="26"
          strokeLinecap="round"
        />
        <path
          d="M250 300V120"
          fill="none"
          stroke="#1473e6"
          strokeWidth="13"
          strokeLinecap="round"
        />

        <g fill="#0b1f33" stroke="#1473e6" strokeWidth="8">
          <circle cx="250" cy="300" r="20" />
          <circle cx="250" cy="470" r="20" />
        </g>

        <g>
          <circle
            cx="520"
            cy="300"
            r="34"
            fill="#0b1f33"
            stroke="#1473e6"
            strokeWidth="10"
          />
          <path
            d="M520 300h24M520 300v-24M520 300h-24M520 300v24"
            stroke="#eaf4ff"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="520" cy="300" r="8" fill="#f97316" />
        </g>

        <path
          d="M640 300s46 52 46 82a46 46 0 0 1-92 0c0-30 46-82 46-82Z"
          fill="#f97316"
          fillOpacity="0.9"
        />
        <path
          d="M618 388a22 22 0 0 0 22 22"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.5"
          strokeWidth="7"
          strokeLinecap="round"
        />

        <g fill="#eaf4ff" fillOpacity="0.7">
          <circle cx="120" cy="150" r="6" />
          <circle cx="640" cy="180" r="5" />
          <circle cx="700" cy="470" r="7" />
        </g>
      </svg>
    </div>
  );
}