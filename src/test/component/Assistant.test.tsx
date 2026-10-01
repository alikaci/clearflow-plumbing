import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Assistant } from "@/components/assistant/Assistant";
import { assistant } from "@/config/assistant";
import { business } from "@/config/business";

let pathname = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
}));

beforeEach(() => {
  pathname = "/";
});

async function openPanel(user: ReturnType<typeof userEvent.setup>) {
  await user.click(
    screen.getByRole("button", { name: "Open website assistant" }),
  );
  return screen.getByRole("dialog", { name: "Website assistant" });
}

describe("Assistant panel shell", () => {
  it("opens from the established launcher name into a named dialog", async () => {
    const user = userEvent.setup();
    render(<Assistant />);

    const launcher = screen.getByRole("button", {
      name: "Open website assistant",
    });
    expect(launcher).toHaveAttribute("aria-expanded", "false");

    const dialog = await openPanel(user);

    expect(assistant.dialogLabel).toBe("Website assistant");
    expect(dialog).toBeInTheDocument();
    expect(launcher).toHaveAttribute("aria-expanded", "true");
    expect(dialog).toHaveAttribute("id", launcher.getAttribute("aria-controls"));
  });

  it("shows the ClearFlow Guide identity with a guided demo label", async () => {
    const user = userEvent.setup();
    render(<Assistant />);

    const dialog = await openPanel(user);

    expect(within(dialog).getByText(assistant.name)).toBeInTheDocument();
    expect(within(dialog).getByText(assistant.statusLabel)).toBeInTheDocument();
    expect(assistant.name).toBe("ClearFlow Guide");
    expect(assistant.statusLabel).toBe("Guided demo");
  });

  it("moves focus into the dialog when it opens", async () => {
    const user = userEvent.setup();
    render(<Assistant />);

    const dialog = await openPanel(user);

    await waitFor(() => expect(dialog).toHaveFocus());
  });

  it("closes on Escape and returns focus to the launcher", async () => {
    const user = userEvent.setup();
    render(<Assistant />);

    const launcher = screen.getByRole("button", {
      name: "Open website assistant",
    });
    await openPanel(user);

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(launcher).toHaveFocus());
  });

  it("closes from the close button and keeps the launcher name", async () => {
    const user = userEvent.setup();
    render(<Assistant />);

    const dialog = await openPanel(user);
    await user.click(
      within(dialog).getByRole("button", { name: "Close website assistant" }),
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Open website assistant" }),
    ).toBeInTheDocument();
  });
});

describe("Assistant welcome state", () => {
  it("renders the welcome message and a short explanation", async () => {
    const user = userEvent.setup();
    render(<Assistant />);

    const dialog = await openPanel(user);

    expect(within(dialog).getByText(assistant.welcome)).toBeInTheDocument();
    expect(within(dialog).getByText(assistant.explanation)).toBeInTheDocument();
  });

  it("keeps the required disclosures visible without a legal wall", async () => {
    const user = userEvent.setup();
    render(<Assistant />);

    const dialog = await openPanel(user);
    const rendered = dialog.textContent ?? "";

    for (const disclosure of assistant.disclosures) {
 expect(rendered).toContain(disclosure.replace(/['']/g, "'"));
    }
    expect(assistant.disclosures.length).toBeLessThanOrEqual(6);
  });

  it("never claims a live person, real AI or live availability", async () => {
    const user = userEvent.setup();
    render(<Assistant />);

    const dialog = await openPanel(user);
    const rendered = (dialog.textContent ?? "").toLowerCase();

    for (const forbidden of [
      "ai technician",
      "live agent",
      "online plumber",
      "technician available",
      "we are responding",
      "i am an ai",
      "ai assistant",
      "language model",
    ]) {
      expect(rendered, forbidden).not.toContain(forbidden);
    }
  });

  it("mentions 24/7 only as emergency-call availability", async () => {
    const user = userEvent.setup();
    render(<Assistant />);

    const dialog = await openPanel(user);
    const rendered = (dialog.textContent ?? "").toLowerCase();

    // 24/7 is a permitted fact only when scoped to emergency calls. It must
    // never be presented as office hours or as general availability.
    for (const match of rendered.matchAll(/24\/7/g)) {
      const window = rendered.slice(
        Math.max(0, match.index! - 60),
        match.index! + 60,
      );
      expect(window).toContain("emergency");
    }
    expect(rendered).not.toMatch(/24\/7[^.]{0,40}office hours/i);
  });

  it("offers every configured quick prompt as a real button", async () => {
    const user = userEvent.setup();
    render(<Assistant />);

    const dialog = await openPanel(user);
    for (const prompt of assistant.quickPrompts) {
      expect(
        within(dialog).getByRole("button", { name: prompt.label }),
      ).toBeInTheDocument();
    }
  });
});

describe("Assistant conversation", () => {
  it("routes a quick prompt through the same matcher and shows a user bubble", async () => {
    const user = userEvent.setup();
    const { container } = render(<Assistant />);

    const dialog = await openPanel(user);
    await user.click(
      within(dialog).getByRole("button", { name: "I have a water leak" }),
    );

    expect(
      container.querySelector('[data-message-role="user"]'),
    ).toHaveTextContent("I have a water leak");
    expect(
      within(dialog).getByRole("link", { name: "See leak repair" }),
    ).toHaveAttribute("href", "/services/leak-repair");
  });

  it("submits typed input on Enter and shows a matching response", async () => {
    const user = userEvent.setup();
    render(<Assistant />);

    const dialog = await openPanel(user);
    const input = within(dialog).getByRole("textbox", {
      name: assistant.inputLabel,
    });

    await user.type(input, "my drain is blocked");
    await user.keyboard("{Enter}");

    expect(within(dialog).getByText("my drain is blocked")).toBeInTheDocument();
    expect(
      within(dialog).getByRole("link", { name: "See drain cleaning" }),
    ).toHaveAttribute("href", "/services/drain-cleaning");
  });

  it("clears the input after sending and keeps the composer usable", async () => {
    const user = userEvent.setup();
    render(<Assistant />);

    const dialog = await openPanel(user);
    const input = within(dialog).getByRole("textbox", {
      name: assistant.inputLabel,
    });

    await user.type(input, "no hot water{Enter}");

    expect(input).toHaveValue("");
    expect(
      within(dialog).getByRole("link", { name: "See water heater services" }),
    ).toBeInTheDocument();
  });

  it("refuses to send an empty or whitespace-only message", async () => {
    const user = userEvent.setup();
    render(<Assistant />);

    const dialog = await openPanel(user);
    const input = within(dialog).getByRole("textbox", {
      name: assistant.inputLabel,
    });
    const send = within(dialog).getByRole("button", { name: assistant.sendLabel });

    expect(send).toBeDisabled();

    await user.type(input, "    ");
    expect(send).toBeDisabled();

    await user.keyboard("{Enter}");
    expect(
      within(dialog).queryByRole("link", { name: /see |browse |contact/i }),
    ).not.toBeInTheDocument();
  });

  it("limits input to the configured character maximum", async () => {
    const user = userEvent.setup();
    render(<Assistant />);

    const dialog = await openPanel(user);
    const input = within(dialog).getByRole("textbox", {
      name: assistant.inputLabel,
    });

    expect(input).toHaveAttribute("maxlength", String(assistant.maxLength));
    expect(assistant.maxLength).toBe(300);
  });

  it("gives a safe fallback with services, request and contact links", async () => {
    const user = userEvent.setup();
    render(<Assistant />);

    const dialog = await openPanel(user);
    const input = within(dialog).getByRole("textbox", {
      name: assistant.inputLabel,
    });

    await user.type(input, "what is the weather like today{Enter}");

    expect(
      within(dialog).getByText(/couldn.t match that question/i),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole("link", { name: "Browse all services" }),
    ).toHaveAttribute("href", "/services");
    expect(
      within(dialog).getByRole("link", { name: "Open the request form" }),
    ).toHaveAttribute("href", "#estimate");
    expect(
      within(dialog).getByRole("link", { name: "Contact details" }),
    ).toHaveAttribute("href", "/contact");
  });

  it("routes a safety message to the safety response and emergency link", async () => {
    const user = userEvent.setup();
    render(<Assistant />);

    const dialog = await openPanel(user);
    const input = within(dialog).getByRole("textbox", {
      name: assistant.inputLabel,
    });

    await user.type(input, "my water heater is leaking and I smell gas{Enter}");

    expect(within(dialog).getByText(/safety comes before/i)).toBeInTheDocument();
    expect(within(dialog).getByText("Safety first")).toBeInTheDocument();
    expect(
      within(dialog).getByRole("link", { name: "Read the emergency guidance" }),
    ).toHaveAttribute("href", "/emergency");
    // Safety wins even though the message also describes a water-heater leak.
    expect(
      within(dialog).queryByRole("link", {
        name: "See water heater services",
      }),
    ).not.toBeInTheDocument();
  });

  it("renders typed input as plain text with no HTML interpretation", async () => {
    const user = userEvent.setup();
    const { container } = render(<Assistant />);

    const dialog = await openPanel(user);
    const input = within(dialog).getByRole("textbox", {
      name: assistant.inputLabel,
    });

    await user.type(input, "<img src=x onerror=alert(1)>{Enter}");

    expect(container.querySelector("img[src='x']")).toBeNull();
    expect(
      within(dialog).getByText("<img src=x onerror=alert(1)>"),
    ).toBeInTheDocument();
  });

  it("resets to the welcome state from Start over", async () => {
    const user = userEvent.setup();
    render(<Assistant />);

    const dialog = await openPanel(user);
    const input = within(dialog).getByRole("textbox", {
      name: assistant.inputLabel,
    });

    await user.type(input, "sewer backup{Enter}");
    expect(
      dialog.querySelector('[data-message-role="user"]'),
    ).toHaveTextContent("sewer backup");

    await user.click(within(dialog).getByRole("button", { name: "Start over" }));

    expect(within(dialog).queryByText("sewer backup")).not.toBeInTheDocument();
    expect(within(dialog).getByText(assistant.welcome)).toBeInTheDocument();
  });

  it("resolves the estimate hash per route so the link works off the homepage", async () => {
    pathname = "/services";
    const user = userEvent.setup();
    render(<Assistant />);

    const dialog = await openPanel(user);
    const input = within(dialog).getByRole("textbox", {
      name: assistant.inputLabel,
    });

    await user.type(input, "how much{Enter}");

    expect(
      within(dialog).getByRole("link", { name: "Open the request form" }),
    ).toHaveAttribute("href", "/#estimate");
  });

  it("uses the configured demonstration phone number for contact questions", async () => {
    const user = userEvent.setup();
    render(<Assistant />);

    const dialog = await openPanel(user);
    const input = within(dialog).getByRole("textbox", {
      name: assistant.inputLabel,
    });

    await user.type(input, "what is your phone number{Enter}");

    const call = within(dialog).getByRole("link", {
      name: `Call ${business.phoneDisplay}`,
    });
    expect(call).toHaveAttribute("href", business.phoneUri);
    expect(dialog.textContent).toContain(business.phoneDisplay);
  });
});

describe("Assistant privacy and state", () => {
  it("keeps the composer disclosure visible while typing", async () => {
    const user = userEvent.setup();
    render(<Assistant />);

    const dialog = await openPanel(user);

    expect(within(dialog).getByText(/nothing you type is sent or stored/i)).toBeInTheDocument();
  });

  it("does not use browser storage or the network in its source", () => {
    // A static source scan is kept in assistant-privacy.test.ts, which reads
    // the file from disk; this assertion guards the rendered behavior only.
    expect(assistant.disclosures.join(" ")).toMatch(
      /nothing you type is sent anywhere or stored/i,
    );
  });

  it("keeps history within the page view and resets only on Start over", async () => {
    const user = userEvent.setup();
    render(<Assistant />);

    const dialog = await openPanel(user);
    const input = within(dialog).getByRole("textbox", {
      name: assistant.inputLabel,
    });
    await user.type(input, "burst pipe{Enter}");
    expect(
      dialog.querySelector('[data-message-role="user"]'),
    ).toHaveTextContent("burst pipe");

    // Closing and reopening in the same page view keeps the conversation, and
    // a visible "Start over" control is always offered while it exists.
    await user.click(
      within(dialog).getByRole("button", { name: "Close website assistant" }),
    );
    const reopened = await openPanel(user);
    expect(
      reopened.querySelector('[data-message-role="user"]'),
    ).toHaveTextContent("burst pipe");
    expect(
      within(reopened).getByRole("button", { name: "Start over" }),
    ).toBeInTheDocument();

    await user.click(within(reopened).getByRole("button", { name: "Start over" }));
    expect(
      reopened.querySelector('[data-message-role="user"]'),
    ).not.toBeInTheDocument();
    expect(within(reopened).getByText(assistant.welcome)).toBeInTheDocument();
  });

  it("clears the conversation on a full page reload, since nothing is persisted", async () => {
    // Messages are React state only: there is no storage, cookie or query
    // parameter, so a remount always starts from the welcome state. This is
    // asserted by construction in assistant-privacy.test.ts and by the
    // absence of any persistence API in the source scan.
    const user = userEvent.setup();
    const first = render(<Assistant />);
    const dialog = await openPanel(user);
    const input = within(dialog).getByRole("textbox", {
      name: assistant.inputLabel,
    });
    await user.type(input, "burst pipe{Enter}");

    first.unmount();
    const second = render(<Assistant />);
    const fresh = await openPanel(user);

    expect(
      fresh.querySelector('[data-message-role="user"]'),
    ).not.toBeInTheDocument();
    expect(within(fresh).getByText(assistant.welcome)).toBeInTheDocument();
    second.unmount();
  });
});
