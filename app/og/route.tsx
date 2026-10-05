import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Default social share banner (1200x630). Referenced from layout metadata so
// every page inherits it; podcast episodes override with the video thumbnail.
export async function GET() {
  const [serif, medallion] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/LTRemark-Bold.otf")),
    readFile(join(process.cwd(), "public/obc/og-medallion.png")),
  ]);
  const medallionSrc = `data:image/png;base64,${medallion.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          backgroundImage:
            "radial-gradient(1200px 700px at 50% 128%, #1c1c1c 0%, #000000 58%)",
          color: "#fafafa",
          fontFamily: "Remark",
          textAlign: "center",
          padding: "64px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={medallionSrc} alt="" width={220} height={220} />
        <div
          style={{
            fontSize: 122,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            marginTop: 40,
            lineHeight: 1,
          }}
        >
          OB CLUB
        </div>
        <div
          style={{
            fontSize: 38,
            color: "#c9c9c9",
            marginTop: 44,
            maxWidth: 880,
            lineHeight: 1.3,
          }}
        >
          Where entrepreneurs meet, network, and build real business.
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#8a8a8a",
            marginTop: 56,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
          }}
        >
          obclub.co · Est. 2026
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Remark", data: serif, style: "normal", weight: 700 }],
      headers: {
        "Cache-Control":
          "public, immutable, no-transform, max-age=31536000",
      },
    },
  );
}
