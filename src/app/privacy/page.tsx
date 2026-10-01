import { business } from "@/config/business";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata = buildMetadata("privacy");

const sections = [
  {
    id: "purpose",
    title: "What This Website Is",
    body: [
      "ClearFlow Plumbing Co. is a fictional business created by ServiceHarbor Studio for portfolio demonstration. The website presents services and a request process, but it does not provide real plumbing service, appointments, financing, offers or emergency response.",
    ],
  },
  {
    id: "form-data",
    title: "Request Form Data",
    body: [
      "The multi-step request form runs entirely in your browser. When the form is submitted in this demonstration, the details are used only to display a prepared-request message. Nothing is transmitted to a server, written to a database or stored anywhere.",
      "Because nothing is stored, there is no data to retrieve, correct or delete. Do not submit sensitive information such as identification numbers, payment details or account credentials.",
    ],
  },
  {
    id: "photo-preview",
    title: "Local Photo Previews",
    body: [
      "If you choose an optional photo, the preview is created locally on your device using a browser object URL. The image is never uploaded, saved or sent anywhere, and the preview is released when you remove it or leave the form.",
    ],
  },
  {
    id: "tracking",
    title: "Tracking and Cookies",
    body: [
      "This demonstration does not include analytics, advertising pixels, tracking scripts or third-party embeds, and it does not set marketing cookies.",
    ],
  },
  {
    id: "contact",
    title: "Contacting the Business",
    body: [
      "The phone number and email address are demonstration placeholders. The email address is shown as text only and is intentionally not a clickable link.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageIntro
        eyebrow="Privacy"
        heading="Privacy Notes"
        intro="How this fictional portfolio demonstration handles form details, local photo previews and tracking."
      />

      <Section labelledBy="privacy-details-heading">
        <Container size="narrow">
          <h2 id="privacy-details-heading" className="sr-only">
            Privacy details
          </h2>
          <div className="flex flex-col gap-8">
            {sections.map((section) => (
              <div key={section.id}>
                <h3 className="text-xl">{section.title}</h3>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
            <p className="text-sm text-muted">
              {business.disclosures.fictional}
            </p>
          </div>
        </Container>
      </Section>
    </main>
  );
}
