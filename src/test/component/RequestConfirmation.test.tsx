import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { UserEvent } from "@testing-library/user-event";
import { EstimateForm } from "@/components/forms/EstimateForm";
import { business } from "@/config/business";
import { forms } from "@/config/forms";
import { demoReferencePattern } from "@/lib/demo-reference";

const next = () => screen.getByRole("button", { name: forms.nextLabel });
const referencePattern = /^CF-DEMO-\d{6}$/;

const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;
let objectUrlCounter = 0;
const createdUrls: string[] = [];
const revokedUrls: string[] = [];

beforeAll(() => {
  URL.createObjectURL = vi.fn(() => {
    objectUrlCounter += 1;
    const url = `blob:demo-photo-${objectUrlCounter}`;
    createdUrls.push(url);
    return url;
  });
  URL.revokeObjectURL = vi.fn((url: string) => {
    revokedUrls.push(url);
  });
});

beforeEach(() => {
  createdUrls.length = 0;
  revokedUrls.length = 0;
});

afterAll(() => {
  URL.createObjectURL = originalCreateObjectURL;
  URL.revokeObjectURL = originalRevokeObjectURL;
});

function summaryValue(label: string): string {
  const term = screen.getByText(label, { selector: "dt" });
  const value = term.nextElementSibling;
  if (!value) throw new Error(`No summary value found for ${label}`);
  return value.textContent ?? "";
}

async function fillStepOne(user: UserEvent) {
  await user.selectOptions(
    screen.getByLabelText(/Which service do you need/),
    "water-heaters",
  );
  await user.click(next());
}

async function fillLocationStep(user: UserEvent) {
  await user.type(screen.getByLabelText(/^City/), "Columbus");
  await user.type(screen.getByLabelText(/^ZIP code/), "43215");
  await user.click(next());
}

async function fillProblemStep(user: UserEvent) {
  await user.type(
    screen.getByLabelText(/Describe the problem/),
    "The water heater is leaking from the base and needs a new fitting.",
  );
  await user.click(next());
}

async function fillContactStep(user: UserEvent) {
  await user.type(screen.getByLabelText(/^Full name/), "Jordan Miller");
  await user.type(screen.getByRole("textbox", { name: /^Email/ }), "jordan@example.com");
  await user.type(screen.getByRole("textbox", { name: /^Phone/ }), "6145550147");
  await user.click(next());
}

async function acknowledgeAndSubmit(user: UserEvent) {
  await user.click(screen.getByLabelText(/portfolio demonstration/));
  await user.click(screen.getByRole("button", { name: forms.submitLabel }));
  await screen.findByText(forms.confirmationHeading, {}, { timeout: 3000 });
}

async function completeRequest(user: UserEvent) {
  await fillStepOne(user);
  await fillLocationStep(user);
  await fillProblemStep(user);
  await fillContactStep(user);
  await acknowledgeAndSubmit(user);
}

const shownReference = () => screen.getByText(referencePattern).textContent ?? "";

describe("simulated request confirmation", () => {
  it("shows the confirmation header, disclosure and both sections", async () => {
    const user = userEvent.setup({ delay: null });
    render(<EstimateForm />);
    await completeRequest(user);

    expect(screen.getByText(forms.confirmationEyebrow)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: forms.confirmationHeading }),
    ).toBeInTheDocument();
    expect(screen.getByText(forms.confirmationDisclosure)).toBeVisible();
    expect(
      screen.getByRole("heading", { name: forms.confirmationSummaryHeading }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: forms.confirmationLiveWebsiteHeading }),
    ).toBeInTheDocument();
    expect(forms.confirmationDisclosure).toMatch(
      /no appointment has been created/i,
    );
    expect(forms.confirmationDisclosure).toMatch(
      /no technician has been dispatched/i,
    );
  }, 30000);

  it("presents the full office workflow as a preview", async () => {
    const user = userEvent.setup({ delay: null });
    render(<EstimateForm />);
    await completeRequest(user);

    for (const item of forms.confirmationWorkflowSteps) {
      expect(
        screen.getByRole("heading", { level: 5, name: item.title }),
      ).toBeInTheDocument();
      expect(screen.getByText(item.description)).toBeInTheDocument();
      expect(screen.getAllByText(item.owner).length).toBeGreaterThan(0);
    }
    expect(
      screen.getByRole("list", { name: forms.confirmationLiveWebsiteHeading }),
    ).toBeInTheDocument();
    expect(forms.confirmationWorkflowStages).toEqual([
      "Website visitor",
      "Qualified website request",
      "Office review",
      "Customer follow-up",
      "Scheduling agreement",
      "On-site assessment",
      "Job follow-up",
    ]);
    for (const stage of forms.confirmationWorkflowStages) {
      expect(screen.getByTestId("confirmation-workflow-stages")).toHaveTextContent(
        stage,
      );
    }
    expect(
      screen.getByText(forms.confirmationLiveWebsiteNote),
    ).toBeInTheDocument();
    expect(
      screen.getByText(forms.confirmationLiveWebsiteNote).textContent,
    ).toMatch(/did not transmit or retain/i);
  }, 30000);

  it("states every outcome that did not occur, once, at the final state", async () => {
    const user = userEvent.setup({ delay: null });
    render(<EstimateForm />);
    await completeRequest(user);

    const disclosure = screen.getByTestId("confirmation-workflow-disclosure");
    expect(
      screen.getByRole("heading", {
        name: forms.confirmationWorkflowDisclosureHeading,
      }),
    ).toBeInTheDocument();
    for (const item of forms.confirmationWorkflowDisclosureItems) {
      expect(disclosure).toHaveTextContent(item);
    }
    const text = disclosure.textContent ?? "";
    expect(text).toMatch(/No information was sent/i);
    expect(text).toMatch(/No lead was created/i);
    expect(text).toMatch(/No appointment was created/i);
    expect(text).toMatch(/No technician was dispatched/i);
    expect(text).toMatch(/not stored/i);
  }, 30000);

  it("creates the demo reference only after a valid submission and keeps it stable", async () => {
    const user = userEvent.setup({ delay: null });
    render(<EstimateForm />);

    await fillStepOne(user);
    expect(screen.queryByText(referencePattern)).not.toBeInTheDocument();

    await completeRequestAfterFirstStep(user);
    const reference = shownReference();
    expect(reference).toMatch(referencePattern);
    expect(reference).toMatch(demoReferencePattern);
    expect(screen.getByText(forms.confirmationReferenceLabel)).toBeInTheDocument();
    expect(shownReference()).toBe(reference);
  });

  it("clears the reference with Start a New Request and accepts a new request", async () => {
    const user = userEvent.setup({ delay: null });
    render(<EstimateForm />);
    await completeRequest(user);
    const firstReference = shownReference();

    await user.click(
      screen.getByRole("button", { name: forms.confirmationPrimaryLabel }),
    );
    expect(screen.queryByText(referencePattern)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: forms.confirmationHeading }),
    ).not.toBeInTheDocument();

    await completeRequest(user);
    expect(shownReference()).toMatch(referencePattern);
    expect(firstReference).toMatch(referencePattern);
  }, 30000);

  it("summarises submitted values with human labels and no internal ids", async () => {
    const user = userEvent.setup({ delay: null });
    render(<EstimateForm />);
    await completeRequest(user);

    const labels = forms.confirmationSummaryLabels;
    expect(summaryValue(labels.service)).toBe("Water Heater");
    expect(summaryValue(labels.city)).toBe("Columbus");
    expect(summaryValue(labels.zip)).toBe("43215");
    expect(summaryValue(labels.propertyType)).toBe("House");
    expect(summaryValue(labels.urgency)).toBe("Just getting an estimate");
    expect(summaryValue(labels.contactPreference)).toBe(
      "Phone, best time to reach you: morning",
    );
    expect(summaryValue(labels.photos)).toBe(forms.confirmationNoPhotos);
    expect(summaryValue(labels.description)).toBe(
      "The water heater is leaking from the base and needs a new fitting.",
    );

    const rendered = Array.from(document.querySelectorAll("dd"))
      .map((node) => node.textContent ?? "")
      .join(" ");
    expect(rendered).not.toMatch(
      /water-heaters|apartment-condo|getting-estimate|right-now|this-week/,
    );
    expect(rendered).not.toMatch(/Jordan|jordan@example\.com|6145550147/);
  }, 30000);

  it("reports only the selected photo count and never the file name", async () => {
    const user = userEvent.setup({ delay: null });
    render(<EstimateForm />);
    await fillStepOne(user);
    await fillLocationStep(user);

    const file = new File(["demo-bytes"], "kitchen-leak-demo.png", {
      type: "image/png",
    });
    await user.upload(screen.getByLabelText(/Add a local photo preview/), file);
    expect(screen.getByText("kitchen-leak-demo.png")).toBeInTheDocument();

    await fillProblemStep(user);
    await fillContactStep(user);
    await acknowledgeAndSubmit(user);

    expect(screen.getByText("1 photo selected")).toBeInTheDocument();
    expect(
      screen.queryByText(/kitchen-leak-demo\.png/),
    ).not.toBeInTheDocument();
  });

  it("sends nothing to a network or browser storage on submission", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const localSet = vi.spyOn(Storage.prototype, "setItem");
    const sessionSet = vi.spyOn(Storage.prototype, "setItem");
    const xhrSend = vi.spyOn(XMLHttpRequest.prototype, "send");
    const beaconSupported = typeof navigator.sendBeacon === "function";
    const beacon = beaconSupported
      ? vi.spyOn(navigator, "sendBeacon").mockReturnValue(false)
      : null;

    const user = userEvent.setup({ delay: null });
    render(<EstimateForm />);
    await completeRequest(user);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(xhrSend).not.toHaveBeenCalled();
    if (beacon) expect(beacon).not.toHaveBeenCalled();
    expect(localSet).not.toHaveBeenCalled();
    expect(sessionSet).not.toHaveBeenCalled();
    expect(document.cookie).toBe("");
    expect(window.location.search).toBe("");
    expect(window.location.hash).toBe("");

    localSet.mockRestore();
    sessionSet.mockRestore();
    xhrSend.mockRestore();
    beacon?.mockRestore();
    vi.unstubAllGlobals();
  }, 30000);

  it("revokes photo object URLs on removal, reset and unmount", async () => {
    const user = userEvent.setup({ delay: null });
    const { unmount } = render(<EstimateForm />);
    await fillStepOne(user);
    await fillLocationStep(user);

    const file = new File(["demo-bytes"], "demo-photo.png", { type: "image/png" });
    await user.upload(screen.getByLabelText(/Add a local photo preview/), file);
    const createdUrl = createdUrls[0];
    expect(createdUrl).toBeTruthy();
    expect(revokedUrls).not.toContain(createdUrl);

    await user.click(screen.getByRole("button", { name: forms.photoRemoveLabel }));
    await waitFor(() => expect(revokedUrls).toContain(createdUrl));

    const second = new File(["demo-bytes"], "second-demo-photo.png", {
      type: "image/png",
    });
    await user.upload(screen.getByLabelText(/Add a local photo preview/), second);
    const secondUrl = createdUrls[1];
    expect(secondUrl).toBeTruthy();
    expect(revokedUrls).not.toContain(secondUrl);

    unmount();
    await waitFor(() => expect(revokedUrls).toContain(secondUrl));
  });

  it("resets photo state and form values with Start a New Request", async () => {
    const user = userEvent.setup({ delay: null });
    render(<EstimateForm />);
    await fillStepOne(user);
    await fillLocationStep(user);
    const file = new File(["demo-bytes"], "demo-photo.png", { type: "image/png" });
    await user.upload(screen.getByLabelText(/Add a local photo preview/), file);
    await fillProblemStep(user);
    await fillContactStep(user);
    await acknowledgeAndSubmit(user);
    expect(screen.getByText("1 photo selected")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: forms.confirmationPrimaryLabel }),
    );

    expect(screen.getByText("Step 1 of 5")).toBeInTheDocument();
    expect(screen.getByLabelText(/Which service do you need/)).toHaveValue("");
    expect(screen.queryByText("1 photo selected")).not.toBeInTheDocument();

    await user.selectOptions(
      screen.getByLabelText(/Which service do you need/),
      "water-heaters",
    );
    await user.click(next());
    await user.type(screen.getByLabelText(/^City/), "Columbus");
    await user.type(screen.getByLabelText(/^ZIP code/), "43215");
    await user.click(next());

    const input = screen.getByLabelText(
      /Add a local photo preview/,
    ) as HTMLInputElement;
    expect(input.value).toBe("");
    expect(screen.queryByText("demo-photo.png")).not.toBeInTheDocument();
    expect(
      screen.queryByAltText("Preview of the selected photo"),
    ).not.toBeInTheDocument();
  }, 30000);

  it("offers Return Home and a plain tel link", async () => {
    const user = userEvent.setup({ delay: null });
    render(<EstimateForm />);
    await completeRequest(user);

    const home = screen.getByRole("link", { name: forms.confirmationSecondaryLabel });
    expect(home).toHaveAttribute("href", "/");

    const phone = screen.getByRole("link", {
      name: `Call ${business.phoneDisplay}`,
    });
    expect(phone).toHaveAttribute("href", "tel:+16145550147");
    expect(phone).toHaveClass("underline");
  }, 30000);

  it("does not confirm or create a reference for an invalid submission", async () => {
    const user = userEvent.setup({ delay: null });
    render(<EstimateForm />);
    await fillStepOne(user);
    await fillLocationStep(user);
    await user.type(screen.getByLabelText(/Describe the problem/), "drip");
    await user.click(next());

    expect(
      screen.getByText("Add a short description of at least 10 characters."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: forms.confirmationHeading }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(referencePattern)).not.toBeInTheDocument();
    expect(screen.getByText("Step 3 of 5")).toBeInTheDocument();
  });

  it("ignores repeat submissions while a simulated submit is running", async () => {
    const user = userEvent.setup({ delay: null });
    render(<EstimateForm />);
    await fillStepOne(user);
    await fillLocationStep(user);
    await fillProblemStep(user);
    await fillContactStep(user);
    await user.click(screen.getByLabelText(/portfolio demonstration/));

    const submit = screen.getByRole("button", { name: forms.submitLabel });
    await user.click(submit);
    await user.click(
      screen.getByRole("button", { name: forms.submittingLabel }),
    );
    await screen.findByText(forms.confirmationHeading, {}, { timeout: 3000 });

    expect(screen.getAllByText(referencePattern)).toHaveLength(1);
  });

  it("moves focus to the confirmation heading and announces it concisely", async () => {
    const user = userEvent.setup({ delay: null });
    render(<EstimateForm />);
    await completeRequest(user);

    const heading = screen.getByRole("heading", { name: forms.confirmationHeading });
    expect(heading).toHaveAttribute("tabindex", "-1");
    await waitFor(() => expect(heading).toHaveFocus());

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent(forms.confirmationStatus);
    expect(status.textContent).toMatch(
      /request prepared\. no information was sent and no appointment was created\./i,
    );
    expect(status.textContent?.length ?? 0).toBeLessThan(120);
    expect(status.textContent).not.toMatch(/43215|Water Heater/);
  }, 30000);
});

async function completeRequestAfterFirstStep(user: UserEvent) {
  await fillLocationStep(user);
  await fillProblemStep(user);
  await fillContactStep(user);
  await acknowledgeAndSubmit(user);
}
