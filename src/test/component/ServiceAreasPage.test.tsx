import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ServiceAreasPage from "@/app/service-areas/page";
import { images } from "@/config/images";
import { serviceAreas } from "@/config/serviceAreas";

describe("service-areas page hero", () => {
  it("renders a strong H1 with the coverage heading", () => {
    render(<ServiceAreasPage />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(serviceAreas.heading);
    expect(heading).toBeVisible();
  });

  it("renders the coverage points as a list", () => {
    render(<ServiceAreasPage />);
    for (const point of serviceAreas.hero.coveragePoints) {
      expect(screen.getByText(point)).toBeInTheDocument();
    }
  });

  it("renders a photo via the image manifest, never a map or pin", () => {
    render(<ServiceAreasPage />);

    const hero = screen.getByLabelText("Service area coverage");
    const image = within(hero).getByRole("img");
    const preferredKey = images.brandedVan.available
      ? ("brandedVan" as const)
      : ("technicianHomeowner" as const);
    expect(image).toHaveAccessibleName(images[preferredKey].alt);
    expect(
      decodeURIComponent(image.getAttribute("src") ?? ""),
    ).toContain("/images/");
  });

  it("anchors the primary CTA to the ZIP checker", () => {
    render(<ServiceAreasPage />);
    const primary = screen.getByRole("link", {
      name: serviceAreas.hero.primaryCtaLabel,
    });
    expect(primary).toHaveAttribute("href", "#check-coverage");
  });

  it("links the secondary CTA to the request form", () => {
    render(<ServiceAreasPage />);
    const hero = screen.getByLabelText("Service area coverage");
    const secondary = within(hero).getByRole("link", {
      name: serviceAreas.hero.secondaryCtaLabel,
    });
    expect(secondary).toHaveAttribute("href", "/#estimate");
  });
});

describe("service-areas page contents", () => {
  it("contains the ZIP checker with a coverage result helper", () => {
    render(<ServiceAreasPage />);
    const checker = screen.getByRole("textbox", {
      name: serviceAreas.zipLabel,
    });
    expect(checker).toHaveAttribute("inputMode", "numeric");
    expect(
      screen.getByRole("button", { name: serviceAreas.submitLabel }),
    ).toBeInTheDocument();
  });

  it("lists every coverage community", () => {
    render(<ServiceAreasPage />);
    for (const area of serviceAreas.areas) {
      expect(
        screen.getByRole("heading", { level: 3, name: area.name }),
      ).toBeInTheDocument();
    }
  });

  it("shows the demonstration disclosure", () => {
    render(<ServiceAreasPage />);
    expect(
      screen.getAllByText(serviceAreas.disclaimer).length,
    ).toBeGreaterThan(0);
  });

  it("offers a request call to action", () => {
    render(<ServiceAreasPage />);
    const requestLinks = screen.getAllByRole("link", {
      name: /request a free estimate/i,
    });
    expect(requestLinks.length).toBeGreaterThan(0);
  });
});

describe("service-areas page claims", () => {
  const forbiddenPhrases = [
    "24/7",
    "same-day",
    "same day service",
    "guaranteed",
    "on the way",
    "live map",
    "live location",
    "we are at your door",
    "licensed",
    "insured",
    "background-checked",
    "verified reviews",
    "verified rating",
  ];

  it("makes no unverified coverage or dispatch claims", () => {
    const { container } = render(<ServiceAreasPage />);
    const text = (container.textContent ?? "").toLowerCase();
    for (const phrase of forbiddenPhrases) {
      expect(text, `page should not claim "${phrase}"`).not.toContain(phrase);
    }
  });

  it("scopes the hero badge and checker results to demonstration", () => {
    render(<ServiceAreasPage />);
    const hero = screen.getByLabelText("Service area coverage");
    // The hero must read like a real coverage badge, with no demonstration
    // language in the primary service-area experience.
    expect(
      within(hero).getByText(serviceAreas.hero.badge),
    ).toHaveTextContent(/columbus-area communities/i);
    expect(within(hero).queryByText(/demonstration|concept|portfolio/i)).toBeNull();
    expect(
      screen.getAllByText(serviceAreas.disclaimer).length,
    ).toBeGreaterThan(0);
  });
});