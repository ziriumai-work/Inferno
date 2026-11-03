"use client";

import React, { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root Global Error caught exception:", error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Operations Interrupted | The Inferno Group LLC</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#0d0f12",
          color: "#f3f4f6",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          paddingLeft: "16px",
          paddingRight: "16px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            width: "100%",
            backgroundColor: "#161b22",
            borderRadius: "16px",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            padding: "32px 24px",
            textAlign: "center",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              backgroundColor: "rgba(239, 68, 68, 0.12)",
              color: "#ef4444",
              borderRadius: "9999px",
              padding: "4px 12px",
              fontSize: "12px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "16px",
            }}
          >
            System Disrupted
          </div>

          <h1
            style={{
              fontSize: "24px",
              fontWeight: "800",
              margin: "0 0 12px 0",
              color: "#ffffff",
            }}
          >
            The Inferno Group LLC
          </h1>

          <p
            style={{
              fontSize: "14px",
              lineHeight: "1.6",
              color: "#9ca3af",
              margin: "0 0 24px 0",
            }}
          >
            An unexpected error occurred while loading this page. Please try reloading or returning to the homepage.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => reset()}
              style={{
                backgroundColor: "#e14d18",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.href = "/";
                }
              }}
              style={{
                backgroundColor: "transparent",
                color: "#f3f4f6",
                border: "1px solid #374151",
                borderRadius: "8px",
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Return Home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

