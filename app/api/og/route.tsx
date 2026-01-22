import { ImageResponse } from "next/og";
import type { JSX } from "react";

export const runtime = "edge";

export function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const text = searchParams.get("text")?.slice(0, 100);
    const streak = searchParams.get("streak");
    const count = searchParams.get("count");

    const title = "PosiFrame";

    let content: JSX.Element;

    if (streak && count) {
      content = (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            padding: "40px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            width: "90%",
            height: "80%",
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontWeight: "bold",
              marginBottom: 20,
              backgroundClip: "text",
              color: "white",
            }}
          >
            {title} Stats
          </div>
          <div style={{ display: "flex", gap: "40px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 80, fontWeight: "bold" }}>
                🔥 {streak}
              </div>
              <div style={{ fontSize: 30, opacity: 0.8 }}>Day Streak</div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 80, fontWeight: "bold" }}>🛡️ {count}</div>
              <div style={{ fontSize: 30, opacity: 0.8 }}>Toxic Blocked</div>
            </div>
          </div>
        </div>
      );
    } else {
      content = (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            padding: "40px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            width: "90%",
            height: "80%",
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontWeight: "bold",
              marginBottom: 20,
              backgroundClip: "text",
              color: "white",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 36,
              fontStyle: "italic",
              lineHeight: 1.4,
              marginBottom: 40,
              opacity: 0.9,
            }}
          >
            "{text || "Turn negative vibes into positive energy."}"
          </div>
          <div
            style={{
              fontSize: 24,
              opacity: 0.7,
            }}
          >
            Reframed with AI ✨
          </div>
        </div>
      );
    }

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "linear-gradient(to bottom right, #4c1d95, #7c3aed, #ea580c)",
          color: "white",
          padding: "40px",
          textAlign: "center",
        }}
      >
        {content}
      </div>,
      {
        width: 1200,
        height: 800,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response("Failed to generate the image", {
      status: 500,
    });
  }
}
