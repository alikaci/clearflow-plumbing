import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { gallery } from "@/config/gallery";

describe("GalleryGrid", () => {
  it("renders every pair as a labelled before and after card", () => {
    const { container } = render(<GalleryGrid pairs={gallery.pairs} />);

    expect(screen.getAllByRole("article")).toHaveLength(5);
    expect(container.querySelectorAll("figure")).toHaveLength(10);
    expect(screen.getAllByText("Before")).toHaveLength(5);
    expect(screen.getAllByText("After")).toHaveLength(5);
    expect(container.querySelectorAll("img")).toHaveLength(10);
  });

  it("keeps each comparison pair side by side on narrow viewports", () => {
    const { container } = render(<GalleryGrid pairs={gallery.pairs} />);
    const comparison = container.querySelector("article > div");

    expect(comparison?.className).toContain("grid-cols-2");
    expect(comparison?.className).not.toMatch(/\bsm:grid-cols-2\b/);
  });

  it("keeps the imagery disclosure copy unchanged", () => {
    expect(gallery.note).toBe(
      "Project visuals are AI-generated artwork created for this portfolio concept.",
    );
  });
});
