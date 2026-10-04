import { business } from "@/config/business";
import { home } from "@/config/home";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { BrandImage } from "@/components/ui/BrandImage";

/**
 * Decorative plumbing-route motif.
 *
 * Purely ornamental: `aria-hidden`, no text or label of any kind, and drawn in
 * `currentColor` at low opacity so it can never reduce the contrast of the copy
 * layered above it. It carries no information the surrounding markup does not.
 */
function RouteMotif() {
  return (
    <svg
      viewBox="0 0 1200 520"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.07]"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M-40 452H214a44 44 0 0 0 44-44V188a44 44 0 0 1 44-44h176" />
        <path d="M700 64h132a44 44 0 0 1 44 44v96a44 44 0 0 0 44 44h96" />
        <path d="M742 520V392a44 44 0 0 0-44-44h-58" />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="258" cy="188" r="9" />
        <circle cx="876" cy="108" r="9" />
        <circle cx="742" cy="392" r="9" />
      </g>
    </svg>
  );
}

/**
 * Proof cues attached to the image frame.
 *
 * Rendered as a single connected bar overlapping the frame's lower edge rather
 * than as free-floating cards, because each cue is a real capability of the site
 * and the bar reads as part of the composition instead of decoration. Detail
 * text is dropped below `sm` so the bar still fits at 360px.
 */
function ProofCueBar() {
  return (
    <div className="absolute inset-x-3 -bottom-5 rounded-xl border border-white/15 bg-navy p-4 shadow-lg sm:inset-x-5 sm:p-5">
      <ul className="grid grid-cols-2 gap-4 sm:gap-6">
        {home.hero.proofCues.map((cue) => (
          <li key={cue.label} className="flex min-w-0 items-start gap-2.5">
            <span
              aria-hidden="true"
              className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-orange"
            >
              <Icon name={cue.icon} className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-white">
                {cue.label}
              </span>
              <span className="mt-0.5 hidden text-xs leading-snug text-footer-muted sm:block">
                {cue.detail}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Hero() {
  const { hero } = home;

  return (
    <Section
      ariaLabel="Introduction"
      className="relative overflow-hidden bg-navy pb-24 pt-12 md:pb-28 md:pt-16 lg:pb-24 lg:pt-20"
    >
      <RouteMotif />

      {/*
        A single soft blue light behind the image column. It sits on its own
        layer below the content and never overlaps the copy, so it adds depth
        without acting as a backdrop behind text.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block"
      >
        <div className="absolute right-[-10%] top-1/2 h-[38rem] w-[38rem] -translate-y-1/2 rounded-full bg-blue/25 blur-3xl" />
      </div>

      {/*
        `data-hero-root` is the opt-in marker FloatingControlVisibility looks for
        to decide when the fixed action bar and assistant launcher should step
        aside. It resolves the enclosing section from here, so the observed box
        is the whole Hero including its padding.
      */}
      <div data-hero-root="">
        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-[0.94fr_1.06fr] lg:gap-14 xl:gap-20">
            <div className="hero-enter max-w-xl">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.2em] text-footer-text sm:text-sm">
                <span aria-hidden="true" className="h-px w-8 bg-orange" />
                {hero.eyebrow}
              </p>

              <h1 className="mt-5 text-4xl leading-[1.08] text-white sm:text-5xl lg:text-[3.5rem] xl:text-[4rem]">
                {hero.heading}
              </h1>

              {/*
                Two deliberate variants of the same sentence. The compact copy is
                what keeps the primary and phone CTAs plus a visible slice of the
                image inside a 360x800 first viewport.
              */}
              <p className="mt-5 max-w-lg text-base leading-relaxed text-footer-text sm:mt-6 sm:text-lg">
                <span className="sm:hidden">{hero.paragraphCompact}</span>
                <span className="hidden sm:inline">{hero.paragraph}</span>
              </p>

              {/*
                These are plain anchors rather than `Button`, deliberately.

                `Button` renders `next/link`, which intercepts a same-page hash
                click and scrolls without moving focus to the target. A fragment
                link to the ProblemChooser has to deliver the native behaviour:
                scroll to the anchor, land focus on it, work with keyboard, and
                work with JavaScript disabled. The utility set below mirrors
                `Button`'s primary/outline treatment so the hero keeps the same
                visual language without depending on the router.
              */}
              <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
                <a
                  href={hero.primaryCtaHref}
                  className="hero-cta inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-orange px-6 text-base font-semibold text-navy microtransition hover-on:-translate-y-px hover:opacity-90 active:translate-y-px"
                >
                  {hero.primaryCtaLabel}
                </a>
                <a
                  href={business.phoneUri}
                  aria-label={`Call ${business.phoneDisplay}`}
                  className="hero-cta inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/40 bg-transparent px-6 text-base font-semibold text-white microtransition hover-on:-translate-y-px hover:border-white active:translate-y-px"
                >
                  {hero.secondaryCtaLabel}
                </a>
              </div>

              <p className="mt-5 text-sm">
                <a
                  href={hero.tertiaryHref}
                  className="hero-cta inline-flex min-h-11 items-center gap-1.5 font-semibold text-footer-text underline-offset-4 hover:text-white hover:underline"
                >
                  {hero.tertiaryLabel}
                  <Icon name="arrow-right" className="h-4 w-4" />
                </a>
              </p>
            </div>

            {/*
              The frame keeps the source 4:3 ratio, so the photo is never stretched
              and `object-position` is an editorial crop rather than a resize. The
              intrinsic width/height come from the manifest and the ratio is held by
              the container, so the box is reserved before the image loads and
              there is no layout shift. Only this image carries LCP priority.
            */}
            <div className="hero-enter-visual relative mt-2 pb-8 lg:mt-0 lg:translate-y-6 lg:pb-8">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/15 shadow-xl">
                <BrandImage
                  imageKey={hero.imageKey}
                  className="h-full w-full object-cover"
                  sizes={hero.imageSizes}
                  objectPosition={hero.imageFocalPoint}
                />
              </div>

              <ProofCueBar />
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}
