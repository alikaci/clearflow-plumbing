import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

/*
Social preview image (corrected composition).

The previous background (public/images/opengraph.jpg) was generated with a
ClearFlow branding strip, headline text and service icons baked into the
artwork. Because every foreground word is rendered here in code over that
background, the baked-in artwork ghosted through behind the real text.

The corrected composition reuses the clean technician photo
(public/images/hero-technician.jpg) - the same asset used as the site hero,
which carries no embedded text or branding. The left content column sits on a
fully opaque navy zone so nothing from the photo can ever read behind the
text, and the fictional disclosure sits on its own solid navy chip for stable
contrast at social-card thumbnail sizes.

Every piece of text is rendered here in code so the spelling stays exact and
nothing depends on text baked into a generated art file. The route is only
referenced from metadata when NEXT_PUBLIC_SITE_URL is configured, and noindex
is unaffected.
*/

export const dynamic = "force-static";

export const alt =
  "ClearFlow Plumbing Co. fictional plumbing website concept by ServiceHarbor Studio.";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function backgroundImage(): string {
  const file = path.join(process.cwd(), "public", "images", "hero-technician.jpg");
  const encoded = fs.readFileSync(file).toString("base64");
  return `data:image/jpeg;base64,${encoded}`;
}

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#0b1f33",
          color: "#ffffff",
        }}
      >
        {/*
          Satori cannot resolve a data URI through `background-image`, so the
          clean technician photo is layered as a real image element instead.
          It is decorative here: the social preview text is rendered below it,
          so the image itself carries an empty alt.
        */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={backgroundImage()}
          alt=""
          width={size.width}
          height={size.height}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(90deg, rgba(11,31,51,1) 0%, rgba(11,31,51,1) 46%, rgba(11,31,51,0.94) 56%, rgba(11,31,51,0.74) 66%, rgba(11,31,51,0.46) 76%, rgba(11,31,51,0.2) 88%, rgba(11,31,51,0) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "68px 72px",
            color: "#ffffff",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                fontSize: 52,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              <div
                style={{
                  width: "14px",
                  height: "46px",
                  display: "flex",
                  backgroundColor: "#f97316",
                }}
              />
              ClearFlow
            </div>
            <div
              style={{
                marginTop: "12px",
                fontSize: 26,
                letterSpacing: "0.32em",
                color: "#cdd8e4",
              }}
            >
              PLUMBING CO.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "700px",
            }}
          >
            <div
              style={{
                fontSize: 52,
                fontWeight: 700,
                lineHeight: 1.12,
                whiteSpace: "nowrap",
              }}
            >
              Clear Plumbing Information.
            </div>
            <div
              style={{
                marginTop: "14px",
                fontSize: 26,
                fontWeight: 500,
                color: "#d7e2ee",
              }}
            >
              Confident Service Requests.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              width: "fit-content",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "12px 22px",
                borderRadius: 999,
                backgroundColor: "#122b47",
                color: "#ffffff",
                fontSize: 20,
                fontWeight: 500,
              }}
            >
              Fictional portfolio concept by ServiceHarbor Studio
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}