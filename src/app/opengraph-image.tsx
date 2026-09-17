import { ImageResponse } from "next/og";
import { business } from "@/config/business";

export const alt = "ClearFlow Plumbing Co. concept social preview image.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b1f33",
          color: "#ffffff",
          padding: "64px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              background: "#1473e6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "34px",
              fontWeight: 700,
            }}
          >
            C
          </div>
          <div style={{ fontSize: "30px", fontWeight: 700 }}>
            {business.shortName}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              fontSize: "62px",
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: "920px",
            }}
          >
            Reliable Plumbing Help, Without the Guesswork
          </div>
          <div style={{ fontSize: "28px", color: "#cdd8e4" }}>
            Columbus and surrounding communities
          </div>
        </div>

        <div style={{ fontSize: "22px", color: "#a8b8cb" }}>
          Fictional portfolio concept by ServiceHarbor Studio
        </div>
      </div>
    ),
    { ...size },
  );
}
