import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProblemChooser } from "@/components/sections/ProblemChooser";
import { problemChooser, problemPaths } from "@/config/problemPaths";

describe("ProblemChooser", () => {
  it("renders exactly one section heading and supporting copy", () => {
    render(<ProblemChooser />);

    expect(
      screen.getByRole("heading", { level: 2, name: problemChooser.heading }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(1);
    expect(screen.getByText(problemChooser.supportingText)).toBeInTheDocument();
  });

  it("renders every problem path as an H3 option", () => {
    render(<ProblemChooser />);

    for (const path of problemPaths) {
      expect(
        screen.getByRole("heading", { level: 3, name: path.label }),
      ).toBeInTheDocument();
    }
  });

  it("exposes every destination as a real link with an accessible name", () => {
    render(<ProblemChooser />);

    for (const path of problemPaths) {
      const link = screen.getByRole("link", { name: path.linkLabel });
      expect(link).toHaveAttribute("href", path.href);
    }
  });

  it("adds an estimate-form route to the not-sure option", () => {
    render(<ProblemChooser />);

    const notSure = problemPaths.find((path) => path.id === "not-sure");
    expect(notSure?.altCta).toBeDefined();
    const altLink = screen.getByRole("link", {
      name: notSure?.altCta?.label,
    });
    expect(altLink).toHaveAttribute("href", notSure?.altCta?.href);
  });

  it("presents the options as a semantic list, not buttons", () => {
    const { container } = render(<ProblemChooser />);

    const list = container.querySelector("ul");
    const items = container.querySelectorAll("li");
    expect(list).not.toBeNull();
    expect(items.length).toBe(problemPaths.length);
    expect(container.querySelector('[role="button"]')).toBeNull();
    expect(container.querySelectorAll("button")).toHaveLength(0);
    expect(container.querySelectorAll("div[role='button']")).toHaveLength(0);
  });

  it("applies the orange accent only to the sewer option", () => {
    const { container } = render(<ProblemChooser />);

    const iconChips = Array.from(
      container.querySelectorAll("article span[aria-hidden='true']"),
    );
    const sewerChip = screen
      .getByRole("heading", { level: 3, name: /sewer backup/i })
      .closest("article")
      ?.querySelector("span[aria-hidden='true']");

    expect(sewerChip).not.toBeNull();
    expect(sewerChip?.className).toContain("bg-orange/10");
    expect(sewerChip?.className).toContain("text-orange");
    expect(iconChips.filter((chip) => chip.className.includes("bg-orange")))
      .toHaveLength(1);
  });

  it("keeps the not-sure card visually differentiated", () => {
    const { container } = render(<ProblemChooser />);

    const notSureCard = screen
      .getByRole("heading", { level: 3, name: /not sure/i })
      .closest("article");
    expect(notSureCard).not.toBeNull();
    expect(notSureCard?.className).toContain("border-blue");
    expect(container.querySelector("button")).toBeNull();
  });
});