import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CostGuidanceTool } from "@/components/forms/CostGuidanceTool";
import { costTool } from "@/config/costTool";

describe("CostGuidanceTool", () => {
  it("requires a service before showing guidance", async () => {
    const user = userEvent.setup();
    render(<CostGuidanceTool />);
    await user.click(screen.getByRole("button", { name: costTool.heading }));
    expect(
      screen.getByText("Choose the service you are asking about."),
    ).toBeInTheDocument();
    expect(screen.queryByText(costTool.resultMessage)).not.toBeInTheDocument();
  });

  it("shows guidance without a price after a service is chosen", async () => {
    const user = userEvent.setup();
    render(<CostGuidanceTool />);
    await user.selectOptions(
      screen.getByLabelText(/Which service are you asking about/),
      "water-heaters",
    );
    await user.click(screen.getByRole("button", { name: costTool.heading }));
    expect(screen.getByText(costTool.resultMessage)).toBeInTheDocument();
    expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument();
  });

  it("links to the provided call to action", async () => {
    const user = userEvent.setup();
    render(<CostGuidanceTool ctaHref="/#estimate" />);
    await user.selectOptions(
      screen.getByLabelText(/Which service are you asking about/),
      "drain-cleaning",
    );
    await user.click(screen.getByRole("button", { name: costTool.heading }));
    expect(
      screen.getByRole("link", { name: costTool.ctaLabel }),
    ).toHaveAttribute("href", "/#estimate");
  });
});
