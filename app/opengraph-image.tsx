import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "The Inferno Group LLC | Operational Readiness & Government Consulting";
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
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          backgroundColor: "#070b14",
          backgroundImage:
            "radial-gradient(circle at 85% 20%, rgba(225, 77, 24, 0.25) 0%, transparent 50%), radial-gradient(circle at 15% 85%, rgba(26, 86, 196, 0.25) 0%, transparent 50%)",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          border: "2px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "16px",
                backgroundColor: "#e14d18",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                fontWeight: "900",
                color: "#ffffff",
                boxShadow: "0 0 30px rgba(225, 77, 24, 0.6)",
              }}
            >
              TIG
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  letterSpacing: "1px",
                }}
              >
                THE INFERNO GROUP LLC
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.6)",
                  letterSpacing: "1.5px",
                }}
              >
                CAGE: 22VP2 &bull; UEI: QW6RHJACHA56
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 20px",
              borderRadius: "999px",
              backgroundColor: "rgba(225, 77, 24, 0.12)",
              border: "1px solid rgba(225, 77, 24, 0.4)",
              color: "#ff6b35",
              fontSize: "14px",
              fontWeight: "700",
              letterSpacing: "1px",
            }}
          >
            HUBZONE CERTIFIED &bull; VOSB
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "950px",
          }}
        >
          <h1
            style={{
              fontSize: "56px",
              fontWeight: "900",
              lineHeight: "1.15",
              margin: 0,
              letterSpacing: "-1px",
            }}
          >
            Operational Readiness When Crisis Meets Command.
          </h1>
          <p
            style={{
              fontSize: "22px",
              color: "rgba(255, 255, 255, 0.75)",
              lineHeight: "1.4",
              margin: 0,
            }}
          >
            Emergency Management, FEMA Public Assistance, Stafford Act Compliance &amp; Federal Program Advisory.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
            paddingTop: "24px",
            fontSize: "16px",
            color: "rgba(255, 255, 255, 0.6)",
          }}
        >
          <span>https://www.theinfernogroup.com</span>
          <span>Orlando, FL &bull; Nationwide Deployment Cadre</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

