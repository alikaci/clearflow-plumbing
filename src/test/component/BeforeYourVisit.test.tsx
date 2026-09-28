import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BeforeYourVisit } from "@/components/services/BeforeYourVisit";
import { getService, services } from "@/config/services";
import type { BeforeVisitConfig } from "@/types";

const heading = "Before Your Visit";

const importantOnly: BeforeVisitConfig = {
  items: [
    {
      title: "Keep Clear of Electrical Hazards",
      description: "Do not enter standing water near electrical devices.",
      importance: "important",
    },
  ],
};

describe("BeforeYourVisit", () => {
  it("renders a section heading connected to the section by aria-labelledby", () => {
    render(<BeforeYourVisit config={importantOnly} />);

    const sectionHeading = screen.getByRole("heading", {
      level: 2,
      name: heading,
    });
    expect(sectionHeading).toBeInTheDocument();

    const region = screen.getByRole("region", { name: heading });
    expect(region.tagName).toBe("SECTION");
    expect(region).toHaveAttribute("aria-labelledby", sectionHeading.id);
    expect(sectionHeading.id).toBe("before-your-visit-heading");
    expect(region).toHaveAttribute("id", "before-your-visit");
  });

  it("renders every configured item with its description", () => {
    render(<BeforeYourVisit config={importantOnly} />);

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Keep Clear of Electrical Hazards",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Do not enter standing water near electrical devices."),
    ).toBeInTheDocument();
  });

  it("presents items in a single semantic list in reading order", () => {
    const config: BeforeVisitConfig = {
      items: [
        { title: "First guidance", description: "First description." },
        { title: "Second guidance", description: "Second description." },
        { title: "Third guidance", description: "Third description." },
      ],
    };
    render(<BeforeYourVisit config={config} />);

    const list = screen.getByRole("list");
    expect(list.tagName).toBe("UL");

    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items.map((item) => item.textContent)).toEqual([
      expect.stringContaining("First guidance"),
      expect.stringContaining("Second guidance"),
      expect.stringContaining("Third guidance"),
    ]);
  });

  it("marks important items with a visible text label, not colour alone", () => {
    const config: BeforeVisitConfig = {
      items: [
        { title: "Standard guidance", description: "Standard description." },
        {
          title: "Urgent guidance",
          description: "Urgent description.",
          importance: "important",
        },
      ],
    };
    render(<BeforeYourVisit config={config} />);

    const items = screen.getAllByRole("listitem");
    expect(within(items[0]).queryByText("Important")).not.toBeInTheDocument();
    expect(within(items[1]).getByText("Important")).toBeInTheDocument();
  });

  it("treats an explicitly standard item as not important", () => {
    render(
      <BeforeYourVisit
        config={{
          items: [
            {
              title: "Explicitly standard",
              description: "Description.",
              importance: "standard",
            },
          ],
        }}
      />,
    );

    expect(screen.queryByText("Important")).not.toBeInTheDocument();
  });

  it("uses the default supporting copy when no intro is configured", () => {
    render(<BeforeYourVisit config={importantOnly} />);

    expect(
      screen.getByText(/No service visit has been scheduled/),
    ).toBeInTheDocument();
  });

  it("prefers a configured intro over the default", () => {
    render(
      <BeforeYourVisit
        config={{ intro: "Custom introduction.", items: importantOnly.items }}
      />,
    );

    expect(screen.getByText("Custom introduction.")).toBeInTheDocument();
    expect(
      screen.queryByText(/No service visit has been scheduled/),
    ).not.toBeInTheDocument();
  });

  it("renders nothing when the config is missing", () => {
    const { container } = render(<BeforeYourVisit />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when the config has no items", () => {
    const { container } = render(<BeforeYourVisit config={{ items: [] }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("supports a caller-supplied id without colliding with the default", () => {
    render(<BeforeYourVisit config={importantOnly} id="visit-prep" />);

    const sectionHeading = screen.getByRole("heading", { level: 2, name: heading });
    expect(sectionHeading).toHaveAttribute("id", "visit-prep-heading");
    expect(
      screen.getByRole("region", { name: heading }),
    ).toHaveAttribute("aria-labelledby", "visit-prep-heading");
  });

  it("renders guidance for a real service configuration", () => {
    const service = getService("leak-repair");
    render(<BeforeYourVisit config={service?.beforeVisit} />);

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Keep Clear of Electrical Hazards",
      }),
    ).toBeInTheDocument();
  });

  it("keeps a guidance list for every configured service", () => {
    for (const service of services) {
      const { unmount } = render(
        <BeforeYourVisit config={service.beforeVisit} />,
      );
      expect(
        screen.getByRole("list"),
        `${service.slug} should render guidance`,
      ).toBeInTheDocument();
      unmount();
    }
  });
});
