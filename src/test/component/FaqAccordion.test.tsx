import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import type { FaqItem } from "@/types";

const items: readonly FaqItem[] = [
  { id: "one", question: "First question?", answer: "First answer." },
  { id: "two", question: "Second question?", answer: "Second answer." },
];

describe("FaqAccordion", () => {
  it("starts fully collapsed", () => {
    render(<FaqAccordion items={items} />);
    expect(screen.getByRole("button", { name: "First question?" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByText("First answer.")).not.toBeVisible();
  });

  it("expands a panel on activation", async () => {
    const user = userEvent.setup();
    render(<FaqAccordion items={items} />);
    const button = screen.getByRole("button", { name: "First question?" });
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("First answer.")).toBeVisible();
  });

  it("keeps only one panel open at a time", async () => {
    const user = userEvent.setup();
    render(<FaqAccordion items={items} />);
    await user.click(screen.getByRole("button", { name: "First question?" }));
    await user.click(screen.getByRole("button", { name: "Second question?" }));
    expect(screen.getByRole("button", { name: "First question?" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByText("First answer.")).not.toBeVisible();
    expect(screen.getByText("Second answer.")).toBeVisible();
  });

  it("associates each control with its region", async () => {
    const user = userEvent.setup();
    render(<FaqAccordion items={items} />);
    const button = screen.getByRole("button", { name: "First question?" });
    await user.click(button);
    const panel = screen.getByRole("region", { name: "First question?" });
    expect(button).toHaveAttribute("aria-controls", panel.id);
  });
});
