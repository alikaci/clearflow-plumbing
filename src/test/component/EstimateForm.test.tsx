import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { UserEvent } from "@testing-library/user-event";
import { EstimateForm } from "@/components/forms/EstimateForm";
import { forms } from "@/config/forms";

const next = () => screen.getByRole("button", { name: forms.nextLabel });
const back = () => screen.getByRole("button", { name: forms.backLabel });

async function reachProblemStep(user: UserEvent) {
  await user.selectOptions(
    screen.getByLabelText(/Which service do you need/),
    "water-heaters",
  );
  await user.click(next());
  await user.type(screen.getByLabelText(/^City/), "Columbus");
  await user.type(screen.getByLabelText(/^ZIP code/), "43215");
  await user.click(next());
}

async function reachContactStep(user: UserEvent) {
  await reachProblemStep(user);
  await user.type(
    screen.getByLabelText(/Describe the problem/),
    "The water heater is leaking from the base.",
  );
  await user.click(next());
}

async function reachReviewStep(user: UserEvent) {
  await reachContactStep(user);
  await user.type(screen.getByLabelText(/^Full name/), "Jordan Miller");
  await user.type(screen.getByRole("textbox", { name: /^Email/ }), "jordan@example.com");
  await user.type(screen.getByRole("textbox", { name: /^Phone/ }), "6145550147");
  await user.click(next());
}

describe("EstimateForm", () => {
  it("shows the first step and progress indicator", () => {
    render(<EstimateForm />);
    expect(screen.getByText("Step 1 of 5")).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Which service do you need/),
    ).toBeInTheDocument();
  });

  it("blocks progress and reports a missing service", async () => {
    const user = userEvent.setup();
    render(<EstimateForm />);
    await user.click(next());
    expect(screen.getByRole("alert")).toHaveTextContent("Service");
    expect(screen.getByText("Choose the service you need.")).toBeInTheDocument();
    expect(screen.getByText("Step 1 of 5")).toBeInTheDocument();
  });

  it("moves forward and back while keeping entered values", async () => {
    const user = userEvent.setup();
    render(<EstimateForm />);
    await user.selectOptions(
      screen.getByLabelText(/Which service do you need/),
      "leak-repair",
    );
    await user.click(next());
    expect(screen.getByText("Step 2 of 5")).toBeInTheDocument();
    await user.type(screen.getByLabelText(/^City/), "Dublin");
    await user.click(back());
    expect(screen.getByText("Step 1 of 5")).toBeInTheDocument();
    await user.click(next());
    expect(screen.getByLabelText(/^City/)).toHaveValue("Dublin");
  });

  it("requires a meaningful problem description", async () => {
    const user = userEvent.setup();
    render(<EstimateForm />);
    await reachProblemStep(user);
    await user.type(screen.getByLabelText(/Describe the problem/), "drip");
    await user.click(next());
    expect(
      screen.getByText("Add a short description of at least 10 characters."),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(/^Full name/)).not.toBeInTheDocument();
  });

  it("rejects an invalid email address", async () => {
    const user = userEvent.setup();
    render(<EstimateForm />);
    await reachContactStep(user);
    await user.type(screen.getByLabelText(/^Full name/), "Jordan Miller");
    await user.type(screen.getByRole("textbox", { name: /^Email/ }), "not-an-email");
    await user.type(screen.getByRole("textbox", { name: /^Phone/ }), "6145550147");
    await user.click(next());
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
  });

  it("requires the demonstration acknowledgement before submitting", async () => {
    const user = userEvent.setup();
    render(<EstimateForm />);
    await reachReviewStep(user);
    expect(screen.getByText(forms.reviewLabel)).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: forms.submitLabel }),
    );
    expect(
      screen.getByText("Acknowledge the demonstration notice to continue."),
    ).toBeInTheDocument();
  });

  it("prepares a request and can be reset", async () => {
    const user = userEvent.setup();
    render(<EstimateForm />);
    await reachReviewStep(user);
    await user.click(
      screen.getByLabelText(/portfolio demonstration/),
    );
    await user.click(screen.getByRole("button", { name: forms.submitLabel }));
    expect(
      await screen.findByText(forms.successMessage, {}, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(screen.getByText(forms.successNote)).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: forms.resetLabel }),
    );
    expect(screen.getByText("Step 1 of 5")).toBeInTheDocument();
    expect(screen.getByLabelText(/Which service do you need/)).toHaveValue("");
  });
});
