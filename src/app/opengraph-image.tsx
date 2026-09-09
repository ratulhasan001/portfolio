import { ImageResponse } from "next/og";
import { profile } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 60,
              height: 60,
              borderRadius: 14,
              background: "#000000",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#ffffff",
            }}
          >
            RH
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#000000" }}>
            {profile.name}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 76,
            fontWeight: 700,
            color: "#000000",
            letterSpacing: "-0.02em",
          }}
        >
          Aspiring Graduate Researcher
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 30,
            color: "#525252",
          }}
        >
          {profile.role}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 24,
            color: "#000000",
          }}
        >
          {profile.website.replace("https://", "")}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 10,
            display: "flex",
            background: "#000000",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
