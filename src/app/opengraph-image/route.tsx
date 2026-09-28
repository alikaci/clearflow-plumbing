import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

/*
Social preview image.

The approved concept visual in public/images/opengraph.jpg is used as the
background. Every piece of text is rendered here in code so the spelling stays
exact and nothing depends on text baked into the generated artwork. The route
is only referenced from metadata when NEXT_PUBLIC_SITE_URL is configured, and
noindex is unaffected.
*/

export const dynamic = "force-static";

export const alt =
  "ClearFlow Plumbing Co. fictional plumbing website concept by ServiceHarbor Studio.";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function backgroundImage(): string {
  const file = path.join(process.cwd(), "public", "images", "opengraph.jpg");
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
          approved concept visual is layered as a real image element instead.
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
              "linear-gradient(90deg, rgba(11,31,51,0.95) 0%, rgba(11,31,51,0.88) 40%, rgba(11,31,51,0.45) 66%, rgba(11,31,51,0.1) 100%)",
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
            padding: "60px 68px",
            color: "#ffffff",
          }}
        >          <div style={{ display: "flex", flexDirection: "column" }}>
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
                marginTop: "10px",
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
              fontSize: 46,
              fontWeight: 700,
              lineHeight: 1.15,
              maxWidth: "680px",
            }}
          >
            <div style={{ whiteSpace: "nowrap" }}>
              Clear Plumbing Information.
            </div>
            <div style={{ whiteSpace: "nowrap" }}>
              Confident Service Requests.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              fontSize: 28,
              color: "#eaf4ff",
            }}
          >
            <div style={{ display: "flex" }}>Columbus, Ohio</div>
            <div
              style={{
                display: "flex",
                fontSize: 19,
                color: "#a8b8cb",
                textAlign: "right",
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
