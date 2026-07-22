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
          background: "#0d1117",
          backgroundImage:
            "radial-gradient(circle at 78% 30%, rgba(68,147,248,0.28), transparent 55%), radial-gradient(circle at 15% 85%, rgba(171,125,248,0.22), transparent 50%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: "9999px",
              background: "#161b22",
              border: "2px solid #30363d",
              fontSize: 26,
              color: "#4493f8",
            }}
          >
            {"</>"}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#8d96a0" }}>
            <span>ratulhasan</span>
            <span style={{ color: "#4493f8" }}>/</span>
            <span style={{ color: "#e6edf3" }}>research</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 76,
            fontWeight: 700,
            color: "#e6edf3",
            letterSpacing: "-0.02em",
          }}
        >
          {profile.name}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 32,
            color: "#aab4c0",
          }}
        >
          {profile.role}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 24,
            color: "#4493f8",
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
            background:
              "linear-gradient(90deg, #4493f8, #ab7df8, #3fb950, #4493f8)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
