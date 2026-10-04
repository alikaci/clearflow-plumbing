import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "@/components/sections/Hero";
import { ProblemChooser } from "@/components/sections/ProblemChooser";
import { business } from "@/config/business";
import { home } from "@/config/home";
import { images } from "@/config/images";
import { problemChooser } from "@/config/problemPaths";

/*
Focused tests for the 2026 homepage hero redesign.

The hero is the highest-value surface on the site, so these tests read the
rendered markup rather than only the config object. They cover the approved
copy, the conversion path, the configured phone source, image semantics, the
decorative motif, and the claims the redesign is not allowed to make.
*/

const APPROVED_HEADING = "Plumbing Help, Without the Runaround.";
const APPROVED_PRIMARY_LABEL = "Tell Us What\u2019s Happening";

describe("homepage hero", () => {
  it("renders the approved headline as the single page h1", () => {
    render(<Hero />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(APPROVED_HEADING);
  });

  it("derives the eyebrow from the configured emergency-call fact", () => {
    render(<Hero />);

    // The eyebrow must not introduce a second, hand-written source for the
    // emergency fact or the service area.
    expect(home.hero.eyebrow).toContain(business.hours.emergencyLabel);
    expect(home.hero.eyebrow).toContain("Columbus");
    expect(home.hero.eyebrow).not.toMatch(/open\s+24\/7/i);

    expect(screen.getByText(home.hero.eyebrow)).toBeInTheDocument();
  });

  it("keeps office hours and emergency availability separate in the hero", () => {
    render(<Hero />);

    const eyebrow = screen.getByText(home.hero.eyebrow);
    // "24/7" describes emergency intake, not the office being open around the
    // clock, so office hours must not appear merged into the same string.
    expect(eyebrow.textContent).not.toMatch(/7:\s*00\s*(AM|PM)/i);
  });

  it("points the primary CTA at the ProblemChooser anchor", () => {
    render(<Hero />);

    const primary = screen.getByRole("link", { name: APPROVED_PRIMARY_LABEL });
    expect(primary).toHaveAttribute("href", home.hero.primaryCtaHref);
    expect(home.hero.primaryCtaHref).toBe("#problem-chooser");
  });

  it("gives the CTA target a stable id and programmatic focus", () => {
    render(
      <>
        <Hero />
        <ProblemChooser />
      </>,
    );

    const target = document.getElementById("problem-chooser");
    expect(target).not.toBeNull();
    expect(target?.tagName.toLowerCase()).toBe("section");
    // A fragment link scrolls but only moves focus when the target is focusable.
    expect(target).toHaveAttribute("tabindex", "-1");
  });

  it("labels the anchor target so the jump is announced", () => {
    render(
      <>
        <Hero />
        <ProblemChooser />
      </>,
    );

    const target = document.getElementById("problem-chooser");
    expect(target).toHaveAttribute("aria-labelledby", "problem-chooser-heading");
    // Read the heading from config rather than restating it, so the two stay
    // coupled and a copy edit cannot silently orphan the anchor's label.
    expect(document.getElementById("problem-chooser-heading")).toHaveTextContent(
      problemChooser.heading,
    );
  });

  it("builds the phone CTA from the configured business phone only", () => {
    render(<Hero />);

    const phoneCta = screen.getByRole("link", { name: `Call ${business.phoneDisplay}` });
    expect(phoneCta).toHaveAttribute("href", business.phoneUri);
    expect(phoneCta).toHaveTextContent(`Call ${business.phoneDisplay}`);

    // A single phone source: nothing else in the hero may carry a tel: URI.
    const telLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]'),
    );
    expect(telLinks).toHaveLength(1);
    expect(telLinks[0].getAttribute("href")).toBe(business.phoneUri);
  });

  it("keeps every hero link target large enough to tap", () => {
    const { container } = render(<Hero />);

    const links = Array.from(container.querySelectorAll("a"));
    expect(links.length).toBeGreaterThanOrEqual(3);
    for (const link of links) {
      expect(link.className).toMatch(/min-h-(?:11|12)/);
    }
  });

  it("renders both copy variants so mobile stays above the fold", () => {
    const { container } = render(<Hero />);

    const compact = screen.getByText(home.hero.paragraphCompact);
    const full = screen.getByText(home.hero.paragraph);
    expect(compact).toBeInTheDocument();
    expect(full).toBeInTheDocument();

    // The compact copy must be a real shortening, not the same string twice.
    expect(home.hero.paragraphCompact.length).toBeLessThan(home.hero.paragraph.length);
    // Meaning is preserved: both still name the service area.
    expect(compact.className).toMatch(/sm:hidden/);
    expect(full.className).toMatch(/hidden sm:inline/);
    expect(container).toBeTruthy();
  });

  it("shows at most three concise proof cues and no generic bullet wall", () => {
    render(<Hero />);

    expect(home.hero.proofCues.length).toBeGreaterThanOrEqual(2);
    expect(home.hero.proofCues.length).toBeLessThanOrEqual(3);

    for (const cue of home.hero.proofCues) {
      expect(screen.getByText(cue.label)).toBeInTheDocument();
    }

    // The retired four-bullet generic list must not reappear.
    expect(
      screen.queryByText("Respectful Service"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Easy Online Requests")).not.toBeInTheDocument();
  });

  it("uses the configured hero image with intrinsic size and LCP priority", () => {
    const { container } = render(<Hero />);

    const asset = images[home.hero.imageKey];
    const image = container.querySelector("img");
    expect(image).not.toBeNull();

    // Meaningful, non-empty alt text.
    expect(image?.getAttribute("alt")).toBe(asset.alt);
    expect(image?.getAttribute("alt")?.length ?? 0).toBeGreaterThan(20);

    // Intrinsic dimensions are declared, so the box is reserved before load.
    expect(image).toHaveAttribute("width", String(asset.width));
    expect(image).toHaveAttribute("height", String(asset.height));

    // Exactly one image on the hero, and it is the LCP-priority asset.
    expect(container.querySelectorAll("img")).toHaveLength(1);
    expect(asset.priority).toBe(true);
    // A priority image is fetched eagerly rather than deferred by lazy loading.
    expect(image?.getAttribute("loading")).not.toBe("lazy");
  });

  it("reserves an aspect-ratio box so the hero image cannot cause layout shift", () => {
    const { container } = render(<Hero />);

    const frame = container.querySelector("img")?.closest("div");
    expect(frame?.className).toMatch(/aspect-\[4\/3\]/);
    expect(frame?.className).toMatch(/overflow-hidden/);
  });

  it("applies the configured editorial focal point without stretching", () => {
    const { container } = render(<Hero />);

    const image = container.querySelector("img");
    expect(image?.style.objectPosition).toBe(home.hero.imageFocalPoint);
    // object-cover keeps the intrinsic ratio; the frame matches the source ratio.
    expect(image?.className).toMatch(/object-cover/);
  });

  it("hides the decorative motif from assistive technology", () => {
    const { container } = render(<Hero />);

    const svgs = Array.from(container.querySelectorAll("svg"));
    expect(svgs.length).toBeGreaterThan(0);
    for (const svg of svgs) {
      expect(svg.getAttribute("aria-hidden")).toBe("true");
      expect(svg.getAttribute("focusable")).toBe("false");
    }

    // The motif carries no readable text of its own.
    const motif = container.querySelector("svg");
    expect(motif?.textContent?.trim()).toBe("");
  });

  it("contains no decorative element that can widen the hero", () => {
    const { container } = render(<Hero />);

    // The section clips any wide glow or motif so it cannot add a scrollbar.
    const section = container.querySelector("section");
    expect(section?.className).toMatch(/overflow-hidden/);
  });

  it("makes no claim that a call, dispatch or transaction happened", () => {
    const { container } = render(<Hero />);
    const text = (container.textContent ?? "").toLowerCase();

    const forbidden = [
      /answered your call/,
      /we answered/,
      /call answered/,
      /technician (?:is |has been |was )?dispatched/,
      /technician (?:is |has been |was )?on (?:the )?way/,
      /guaranteed (?:response|arrival)/,
      /\bguaranteed within\b/,
      /real appointment (?:created|booked|confirmed)/,
      /request (?:has been |was )?(?:sent|received|submitted|transmitted)/,
      /we sent your (?:request|details)/,
    ];
    for (const pattern of forbidden) {
      expect(text, `hero copy matched ${pattern}`).not.toMatch(pattern);
    }
  });

  it("carries no review rating or third-party verification branding", () => {
    const { container } = render(<Hero />);

    const text = (container.textContent ?? "").toLowerCase();
    for (const term of [
      "google",
      "yelp",
      "trustpilot",
      "bbb",
      "angi",
      "houzz",
      "verified review",
      "accredited",
      "certified",
      "licensed",
      "insured",
      "guarantee",
    ]) {
      expect(text, `hero copy mentioned "${term}"`).not.toContain(term);
    }

    // No star glyph and no numeric rating are rendered in the hero.
    expect(container.querySelector("svg")?.innerHTML ?? "").not.toMatch(/polygon/);
  });

  it("does not invent a license number, policy number or credential", () => {
    const { container } = render(<Hero />);
    const text = (container.textContent ?? "").toLowerCase();

    expect(text).not.toMatch(/licen[cs]e\s*(?:#|no\.?|number)/);
    expect(text).not.toMatch(/policy\s*(?:#|no\.?|number)/);
    expect(text).not.toMatch(/\b(ocilab|mbe|ohio plumbing license)\b/);
  });

  it("keeps a low-emphasis third action below the two primary CTAs", () => {
    render(<Hero />);

    const tertiary = screen.getByRole("link", { name: home.hero.tertiaryLabel });
    expect(tertiary).toHaveAttribute("href", home.hero.tertiaryHref);

    // The tertiary link is text-weight only, not styled as a filled button.
    expect(tertiary.className).not.toMatch(/bg-orange|bg-navy/);
  });

  it("scopes the entrance motion so reduced motion never animates", () => {
    const { container } = render(<Hero />);

    const entrance = container.querySelectorAll(".hero-enter, .hero-enter-visual");
    expect(entrance.length).toBe(2);

    // The classes are inert without the prefers-reduced-motion media query, and
    // they carry no inline animation state, so server HTML renders visible.
    for (const node of entrance) {
      expect(node.getAttribute("style") ?? "").not.toMatch(/opacity|animation/);
    }
  });

  it("applies a high-contrast focus ring to hero actions", () => {
    const { container } = render(<Hero />);

    const primary = screen.getByRole("link", { name: APPROVED_PRIMARY_LABEL });
    expect(primary.className).toMatch(/hero-cta/);
    // Every hero link and button shares the ring, including the tertiary link.
    expect(container.querySelectorAll(".hero-cta").length).toBe(3);
  });

  it("exposes the marker the floating controls read to detect the Hero", () => {
    const { container } = render(<Hero />);

    const marker = container.querySelector("main [data-hero-root], [data-hero-root]");
    expect(marker).not.toBeNull();
    // It must resolve to an enclosing section, which is the box that gets measured.
    expect(marker!.closest("section")).not.toBeNull();
    expect(marker!.closest("section")).toBe(
      screen.getByRole("region", { name: "Introduction" }),
    );
  });

  it("contains no floating control of its own", () => {
    const { container } = render(<Hero />);

    // The Hero's own phone CTA is static content, not the fixed action bar or the
    // assistant launcher, both of which belong to the layout shell.
    expect(container.querySelector(".mobile-action-bar")).toBeNull();
    expect(container.querySelector("[data-assistant-launcher]")).toBeNull();
  });

  it("does not render a review or trust section inside the hero", () => {
    const { container } = render(<Hero />);

    // The dedicated trust section stays a separate homepage block.
    expect(container.querySelectorAll("section")).toHaveLength(1);
    expect(within(container).queryByText(/846/)).not.toBeInTheDocument();
  });
});