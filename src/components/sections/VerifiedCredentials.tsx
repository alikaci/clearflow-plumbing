import { credentials } from "@/config/credentials";
import {
  filterValidCredentials,
  formatMarketDate,
} from "@/lib/credentials";
import { getDateFormat } from "@/lib/market";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import type { VerifiedCredential as VerifiedCredentialItem } from "@/types";

const defaultHeading = "Verified Credentials";
const headingId = "verified-credentials-heading";

/*
Verified credentials.

ClearFlow is fictional and has no real credential data, so this component
renders nothing today. It exists so that a future client with real, verified
credentials can publish them without a redesign.

Safety rules baked into the component:
- returns null when disabled, empty, or when nothing validates
- invalid entries are dropped, never repaired into a claim
- the credential name is always shown as text, so meaning never depends on a
  logo being recognised
- colour alone never signals verification: the word "Verified", the registry
  date and the link to the public source carry the meaning
- no carousel, animation or auto-scrolling logo strip
*/
export function VerifiedCredentials() {
  if (!credentials.enabled) return null;

  const items = filterValidCredentials(credentials.items);
  if (items.length === 0) return null;

  const heading = credentials.heading ?? defaultHeading;
  const dateFormat = getDateFormat();

  return (
    <Section surface="muted" labelledBy={headingId}>
      <Container>
        <h2 id={headingId} className="text-2xl md:text-3xl">
          {heading}
        </h2>
        {credentials.intro ? (
          <p className="mt-4 max-w-3xl text-muted">{credentials.intro}</p>
        ) : null}

        <ul className="mt-8 grid gap-5 sm:grid-cols-2">
          {items.map((credential) => (
            <li key={`${credential.name}-${credential.verificationUrl}`}>
              <CredentialItem
                credential={credential}
                dateFormat={dateFormat}
              />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

function CredentialItem({
  credential,
  dateFormat,
}: {
  credential: VerifiedCredentialItem;
  dateFormat: string;
}) {
  const verifiedDate = formatMarketDate(credential.verifiedAt, dateFormat);

  return (
    <Card elevated className="h-full">
      {credential.logo ? (
        // eslint-disable-next-line @next/next/no-img-element -- reviewed local asset only; no remote image domain is configured
        <img
          src={credential.logo.src}
          alt={credential.logo.alt}
          className="mb-4 h-10 w-auto"
        />
      ) : null}

      <h3 className="text-lg text-navy">{credential.name}</h3>

      {credential.registrationNumber ? (
        <p className="mt-1 text-sm text-muted">
          Registration {credential.registrationNumber}
        </p>
      ) : null}

      {verifiedDate ? (
        <p className="mt-2 text-sm text-muted">
          Verified{" "}
          <time dateTime={credential.verifiedAt}>{verifiedDate}</time>
        </p>
      ) : null}

      <a
        href={credential.verificationUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue underline-offset-4 hover:underline"
      >
        <Icon name="check" className="h-4 w-4 shrink-0" />
        <span>{`Verify ${credential.name} at the public registry (opens in a new tab)`}</span>
      </a>
    </Card>
  );
}
