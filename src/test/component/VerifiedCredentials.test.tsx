import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { VerifiedCredentials } from "@/components/sections/VerifiedCredentials";
import AboutPage from "@/app/about/page";
import type { CredentialsConfig, VerifiedCredential } from "@/types";

/*
The production config is the default for every test here, so the "renders
nothing" cases exercise the real ClearFlow configuration. Only the tests that
need to prove future rendering supply an override, and those never touch
production config.
*/
const state = vi.hoisted(() => ({ override: null as CredentialsConfig | null }));

vi.mock("@/config/credentials", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/config/credentials")>();
  return {
    get credentials() {
      return state.override ?? actual.credentials;
    },
  };
});

const validCredentialFixture: VerifiedCredential = {
  name: "Verified Trade Registry Example",
  registrationNumber: "EX-000-000",
  verificationUrl: "https://example.com/verify/credential-123",
  verifiedAt: "2026-02-10",
};

const configWith = (
  items: readonly VerifiedCredential[],
  enabled = true,
): CredentialsConfig => ({
  enabled,
  heading: "Verified Credentials",
  intro: "Credentials listed here would be independently verifiable.",
  items,
});

beforeEach(() => {
  state.override = null;
});

describe("VerifiedCredentials with production ClearFlow config", () => {
  it("renders nothing", () => {
    const { container } = render(<VerifiedCredentials />);
    expect(container).toBeEmptyDOMElement();
  });

  it("adds no heading, list, link or image", () => {
    render(<VerifiedCredentials />);
    expect(
      screen.queryByRole("heading", { name: /verified/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

describe("VerifiedCredentials hidden and empty states", () => {
  it("renders nothing when enabled is false even with valid items", () => {
    state.override = configWith([validCredentialFixture], false);
    const { container } = render(<VerifiedCredentials />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when the item list is empty", () => {
    state.override = configWith([]);
    const { container } = render(<VerifiedCredentials />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when no item passes validation", () => {
    state.override = configWith([
      { ...validCredentialFixture, verificationUrl: "http://example.com/x" },
      { ...validCredentialFixture, name: "  " },
      { ...validCredentialFixture, verifiedAt: "soon" },
    ]);
    const { container } = render(<VerifiedCredentials />);
    expect(container).toBeEmptyDOMElement();
  });

  it("drops invalid items and renders only the valid one", () => {
    state.override = configWith([
      { ...validCredentialFixture, name: "" },
      validCredentialFixture,
    ]);
    render(<VerifiedCredentials />);

    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(1);
    expect(
      screen.getByRole("heading", { name: "Verified Trade Registry Example" }),
    ).toBeInTheDocument();
  });
});

describe("VerifiedCredentials with valid future data", () => {
  beforeEach(() => {
    state.override = configWith([validCredentialFixture]);
  });

  it("renders a semantic section with a heading and list", () => {
    render(<VerifiedCredentials />);

    const region = screen.getByRole("region", { name: "Verified Credentials" });
    expect(region).toBeInTheDocument();
    expect(
      within(region).getByRole("heading", { level: 2, name: "Verified Credentials" }),
    ).toBeInTheDocument();
    expect(within(region).getByRole("list")).toBeInTheDocument();
    expect(
      within(region).getByRole("listitem"),
    ).toBeInTheDocument();
  });

  it("renders the intro when one is configured", () => {
    render(<VerifiedCredentials />);
    expect(
      screen.getByText("Credentials listed here would be independently verifiable."),
    ).toBeInTheDocument();
  });

  it("renders the name, registration number and verified date", () => {
    render(<VerifiedCredentials />);

    expect(
      screen.getByRole("heading", { level: 3, name: "Verified Trade Registry Example" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/EX-000-000/)).toBeInTheDocument();
    // US market date convention, not the raw ISO string.
    expect(screen.getByText("02/10/2026")).toBeInTheDocument();
  });

  it("omits the registration number when it is absent", () => {
    const { registrationNumber, ...withoutRegistration } = validCredentialFixture;
    expect(registrationNumber).toBeTruthy();
    state.override = configWith([withoutRegistration]);
    render(<VerifiedCredentials />);

    expect(
      screen.getByRole("heading", { name: "Verified Trade Registry Example" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Registration/)).not.toBeInTheDocument();
  });

  it("links to the verification url over https with a descriptive name", () => {
    render(<VerifiedCredentials />);

    const link = screen.getByRole("link", {
      name: /Verify Verified Trade Registry Example at the public registry/i,
    });
    expect(link).toHaveAttribute(
      "href",
      "https://example.com/verify/credential-123",
    );
    expect(link.getAttribute("href")?.startsWith("https://")).toBe(true);
  });

  it("adds safe rel attributes when opening in a new tab", () => {
    render(<VerifiedCredentials />);

    const link = screen.getByRole("link", { name: /Verify/i });
    expect(link).toHaveAttribute("target", "_blank");
    const rel = link.getAttribute("rel") ?? "";
    expect(rel).toContain("noopener");
    expect(rel).toContain("noreferrer");
  });

  it("shows the credential name as text, never only as a logo", () => {
    state.override = configWith([
      {
        ...validCredentialFixture,
        logo: {
          src: "/logos/example.svg",
          alt: "Verified Trade Registry Example",
        },
      },
    ]);
    render(<VerifiedCredentials />);

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("alt", "Verified Trade Registry Example");
    // The name is still present as a heading.
    expect(
      screen.getByRole("heading", { level: 3, name: "Verified Trade Registry Example" }),
    ).toBeInTheDocument();
  });
});

describe("About page shows no credentials by default", () => {
  it("renders no credential heading or container", () => {
    const { container } = render(<AboutPage />);

    expect(
      screen.queryByRole("heading", { name: /verified credentials/i }),
    ).not.toBeInTheDocument();
    expect(container.querySelector("#verified-credentials-heading")).toBeNull();
  });

  it("adds no blank credential block, placeholder card or badge", () => {
    const { container } = render(<AboutPage />);

    expect(container.querySelector("[aria-labelledby='verified-credentials-heading']")).toBeNull();
    expect(container.querySelector("img[src*='logo']")).toBeNull();
    expect(screen.queryByText(/registry/i)).not.toBeInTheDocument();
  });

  it("makes no real credential or legal claim", () => {
    render(<AboutPage />);
    const text = document.body.textContent ?? "";

    for (const claim of [
      "Licensed",
      "Insured",
      "BBB",
      "Gas Safe",
      "WaterSafe",
      "NICEIC",
      "CHAS",
      "WIAPS",
      "background-checked",
      "satisfaction guarantee",
      "workmanship warranty",
      "accredited",
      "certified",
    ]) {
      expect(text.toLowerCase()).not.toContain(claim.toLowerCase());
    }
  });

  it("keeps the existing About content and spacing order intact", () => {
    render(<AboutPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "About ClearFlow Plumbing Co." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Demonstration Disclosure" }),
    ).toBeInTheDocument();
  });
});
