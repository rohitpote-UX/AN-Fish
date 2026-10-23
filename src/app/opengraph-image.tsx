import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "AN Fish World | कराडची लाडकी मासोळी";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#05080C",
          backgroundImage:
            "radial-gradient(circle at 50% 30%, #063A63 0%, #02111F 60%, #05080C 100%)",
          fontFamily: "system-ui, sans-serif",
          color: "white",
          padding: "60px",
        }}
      >
        {/* Brand Icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "90px",
            height: "90px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, #0A9AD9 0%, #02111F 100%)",
            border: "2px solid rgba(110, 198, 240, 0.4)",
            marginBottom: "28px",
          }}
        >
          <svg
            width="56"
            height="34"
            viewBox="0 0 100 60"
            fill="white"
            style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))" }}
          >
            <path d="M5 30 C 25 10, 60 10, 85 30 C 60 50, 25 50, 5 30 Z" />
            <path d="M85 30 L 98 15 L 94 30 L 98 45 Z" />
            <circle cx="25" cy="27" r="3.5" fill="#05080C" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            textAlign: "center",
            marginBottom: "14px",
            textShadow: "0 4px 20px rgba(0,0,0,0.6)",
          }}
        >
          AN Fish World
        </div>

        {/* Marathi Tagline */}
        <div
          style={{
            fontSize: "30px",
            color: "#6EC6F0",
            fontWeight: 700,
            letterSpacing: "0.05em",
            marginBottom: "28px",
          }}
        >
          कराडची लाडकी मासोळी • 0°C Liquid Ice Cold Chain
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "20px",
            color: "rgba(233, 247, 255, 0.75)",
            maxWidth: "800px",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Direct from Ratnagiri & Malvan dawn harbour auctions to homes across Karad.
          100% Formalin & Chemical Free.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
