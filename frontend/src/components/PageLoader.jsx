import React from "react";

// ─── PageLoader (Suspense Fallback) ───────────────────────────
// This is the fallback UI shown while a lazy-loaded chunk is
// being downloaded. It is part of the main bundle (not lazy)
// so it is always immediately available.
//
// Practical 8 requirement: "Provide a meaningful fallback UI
// while a lazy-loaded chunk is loading."
// ─────────────────────────────────────────────────────────────

function PageLoader({ label = "Loading page" }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        gap: "1.5rem",
        padding: "2rem",
      }}
    >
      {/* Animated Logo Mark */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #6366f1, #06b6d4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.8rem",
            boxShadow: "0 0 30px rgba(99,102,241,0.35)",
            animation: "pulse-glow 2s ease-in-out infinite",
          }}
        >
          ⚡
        </div>
        {/* Spinning ring */}
        <div
          style={{
            position: "absolute",
            inset: "-6px",
            borderRadius: "26px",
            border: "2px solid transparent",
            borderTopColor: "#6366f1",
            borderRightColor: "rgba(99,102,241,0.3)",
            animation: "spin 0.9s linear infinite",
          }}
        />
      </div>

      {/* Status Text */}
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "var(--text-main)",
            marginBottom: "0.35rem",
          }}
        >
          {label}...
        </p>
        <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", maxWidth: "300px" }}>
          Fetching lazy-loaded chunk from server
        </p>
      </div>

      {/* Skeleton card strips */}
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        {[100, 75, 88].map((w, i) => (
          <div
            key={i}
            style={{
              height: "16px",
              width: `${w}%`,
              borderRadius: "6px",
              background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%)",
              backgroundSize: "400% 100%",
              animation: `shimmer 1.6s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>

      {/* CSS Keyframes */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.3); }
          50% { box-shadow: 0 0 40px rgba(99,102,241,0.55); }
        }
        @keyframes shimmer {
          0% { background-position: -400% 0; }
          100% { background-position: 400% 0; }
        }
      `}</style>
    </div>
  );
}

export default PageLoader;
