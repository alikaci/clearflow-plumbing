import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ZipChecker } from "@/components/forms/ZipChecker";
import { serviceAreas } from "@/config/serviceAreas";

function setup() {
  const user = userEvent.setup();
  render(<ZipChecker id="test-zip" />);
  return {
    user,
    input: screen.getByLabelText(serviceAreas.zipLabel),
    submit: screen.getByRole("button", { name: serviceAreas.submitLabel }),
  };
}

describe("ZipChecker", () => {
  it("shows an invalid message for an incomplete code", async () => {
    const { user, input, submit } = setup();
    await user.type(input, "432");
    await user.click(submit);
    expect(screen.getByText(serviceAreas.invalidMessage)).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("confirms a covered ZIP code", async () => {
    const { user, input, submit } = setup();
    await user.type(input, "43215");
    await user.click(submit);
    expect(screen.getByText(serviceAreas.successMessage)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: serviceAreas.resetLabel }),
    ).toBeInTheDocument();
  });

  it("offers a follow-up for an uncovered ZIP code", async () => {
    const { user, input, submit } = setup();
    await user.type(input, "90210");
    await user.click(submit);
    expect(screen.getByText(serviceAreas.alternativeMessage)).toBeInTheDocument();
  });

  it("keeps only digits and clears the result on edit", async () => {
    const { user, input, submit } = setup();
    await user.type(input, "43215");
    await user.click(submit);
    expect(screen.getByText(serviceAreas.successMessage)).toBeInTheDocument();

    await user.clear(input);
    expect(screen.queryByText(serviceAreas.successMessage)).not.toBeInTheDocument();

    await user.type(input, "4a3b2");
    expect(input).toHaveValue("432");
  });

  it("resets back to the initial state", async () => {
    const { user, input, submit } = setup();
    await user.type(input, "43215");
    await user.click(submit);
    await user.click(screen.getByRole("button", { name: serviceAreas.resetLabel }));
    expect(input).toHaveValue("");
    expect(screen.queryByText(serviceAreas.successMessage)).not.toBeInTheDocument();
  });
});
