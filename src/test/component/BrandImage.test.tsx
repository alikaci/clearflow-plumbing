import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { images } from "@/config/images";
import { BrandImage } from "@/components/ui/BrandImage";
import { PlaceholderArt } from "@/components/ui/PlaceholderArt";

vi.mock("@/config/images", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/config/images")>();
  return {
    ...actual,
    images: {
      ...actual.images,
      heroTechnician: { ...actual.images.heroTechnician, available: false },
      brandedVan: { ...actual.images.brandedVan, decorative: true },
    },
  };
});

describe("BrandImage", () => {
  it("renders the real asset with the manifest alt text and dimensions", () => {
    const asset = images.aboutTeam;
    expect(asset.available).toBe(true);

    render(<BrandImage imageKey="aboutTeam" />);

    const img = screen.getByRole("img", { name: asset.alt });
    expect(img.getAttribute("src")).toContain(encodeURIComponent(asset.src));
    expect(img).toHaveAttribute("width", String(asset.width));
    expect(img).toHaveAttribute("height", String(asset.height));
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("marks decorative assets so they stay out of the accessibility tree", () => {
    render(<BrandImage imageKey="brandedVan" />);

    const img = screen.getByRole("presentation", { hidden: true });
    expect(img).toHaveAttribute("alt", "");
    expect(img).toHaveAttribute("aria-hidden", "true");
  });

  it("falls back to the branded placeholder when an asset is unavailable", () => {
    const asset = images.heroTechnician;
    expect(asset.available).toBe(false);

    const { container } = render(<BrandImage imageKey="heroTechnician" />);

    // the photo is replaced by an inline SVG placeholder, never a broken <img>
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByRole("img", { name: asset.alt })).toBeInTheDocument();
    expect(screen.getByText("Concept visual")).toBeInTheDocument();
  });

  it("keeps the fallback frame at the manifest aspect ratio", () => {
    const asset = images.heroTechnician;
    render(<PlaceholderArt imageKey="heroTechnician" />);

    expect(screen.getByRole("img", { name: asset.alt })).toHaveStyle({
      aspectRatio: asset.aspectRatio,
    });
  });
});
