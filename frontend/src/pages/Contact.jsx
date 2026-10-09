import React from "react";

// ─── Contact Page ─────────────────────────────────────────────
// Lazily-loaded chunk: only downloaded when user navigates to /contact
// ─────────────────────────────────────────────────────────────

function Contact() {
  const concepts = [
    {
      q: "What is the difference between the initial bundle and a lazy-loaded chunk?",
      a: "The initial bundle (main.js) is downloaded and parsed immediately when the app first loads — it contains only the shell code needed to bootstrap React and the routing layer. A lazy-loaded chunk is a separate JS file that the browser only requests when the user navigates to that specific route. Until that navigation happens, the chunk bytes are never transferred, saving both bandwidth and CPU parse time on the first interaction.",
      icon: "📦",
    },
    {
      q: "Why does lazy loading improve perceived performance even though total code eventually stays the same?",
      a: "Perceived performance is dominated by Time to Interactive (TTI) — the moment the user can first interact with the page. By splitting code into on-demand chunks, the initial bundle is smaller, parses faster, and the app becomes interactive sooner. Users rarely visit every route in a session, so many chunks may never be downloaded at all — reducing total bytes transferred in real usage scenarios.",
      icon: "⚡",
    },
    {
      q: "When would lazy loading NOT be worth the added complexity?",
      a: "In very small apps (< 50 kB total JS), the overhead of extra HTTP round-trips for chunks may outweigh the bundle-splitting benefit. Also, if users visit every route immediately (e.g., a step-by-step wizard), all chunks are downloaded anyway. Finally, if the app runs behind a slow server with high latency, the chunk request delay may cause visible loading flicker — mitigated by the 300ms minimum-delay pattern we implemented in Analytics.jsx.",
      icon: "🤔",
    },
  ];

  const practicalInfo = [
    { label: "Practical", value: "8" },
    { label: "CO/PO", value: "CO1 / PO3, PO5" },
    { label: "Technique", value: "React.lazy() + Suspense" },
    { label: "Baseline Bundle", value: "225.27 kB" },
    { label: "After Splitting", value: "Multiple chunks" },
    { label: "Chunk Strategy", value: "Route-based" },
    { label: "Fallback UI", value: "PageLoader component" },
    { label: "Min Delay", value: "300ms (Analytics)" },
  ];

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>

      {/* ── Page Header ──────────────────────────────────── */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "1.8rem" }}>📝</span>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Lab Documentation
          </h1>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Conceptual analysis questions, before/after metrics, and implementation notes for Practical 8.
          This page is itself a{" "}
          <span style={{ color: "#a5b4fc", fontWeight: 600 }}>lazy-loaded chunk</span> — it was not included in the initial bundle.
        </p>
      </div>

      {/* ── Practical Info Table ─────────────────────────── */}
      <section className="glass-card" style={{ padding: "1.5rem 2rem", marginBottom: "2.25rem" }}>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1.25rem" }}>
          ⚙️ Implementation Reference
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
          {practicalInfo.map((item) => (
            <div
              key={item.label}
              style={{
                padding: "0.75rem 1rem",
                background: "var(--bg-input)",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                {item.label}
              </div>
              <div style={{ fontWeight: 700, color: "var(--text-main)", fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Before / After Comparison ────────────────────── */}
      <section style={{ marginBottom: "2.25rem" }}>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1.25rem" }}>
          📊 Before / After Bundle Comparison
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          <div
            className="glass-card"
            style={{ padding: "1.5rem", borderTop: "3px solid #f43f5e" }}
          >
            <p style={{ color: "#f43f5e", fontWeight: 800, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem" }}>
              ❌ BEFORE — Single Bundle
            </p>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", lineHeight: 1.8, color: "var(--text-muted)" }}>
              <div>📄 <span style={{ color: "var(--text-main)" }}>index.html</span> — 0.45 kB</div>
              <div>🎨 <span style={{ color: "var(--text-main)" }}>index-Xxx.css</span> — 3.96 kB</div>
              <div>📦 <span style={{ color: "#fb7185", fontWeight: 700 }}>index-Xxx.js</span> — <strong style={{ color: "#fb7185" }}>225.27 kB</strong> (70.16 kB gz)</div>
              <div style={{ marginTop: "0.75rem", color: "var(--text-dim)", fontSize: "0.78rem" }}>
                All pages loaded upfront. Every route's code is bundled into one file and parsed before the user can interact.
              </div>
            </div>
          </div>
          <div
            className="glass-card"
            style={{ padding: "1.5rem", borderTop: "3px solid #10b981" }}
          >
            <p style={{ color: "#10b981", fontWeight: 800, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem" }}>
              ✅ AFTER — Code Split
            </p>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", lineHeight: 1.8, color: "var(--text-muted)" }}>
              <div>📄 <span style={{ color: "var(--text-main)" }}>index.html</span> — 0.45 kB</div>
              <div>📦 <span style={{ color: "#6ee7b7" }}>main.js</span> — <strong style={{ color: "#6ee7b7" }}>smaller shell</strong></div>
              <div>📦 <span style={{ color: "#6ee7b7" }}>Home.chunk.js</span> — loaded at /</div>
              <div>📦 <span style={{ color: "#6ee7b7" }}>Projects.chunk.js</span> — loaded at /projects</div>
              <div>📦 <span style={{ color: "#6ee7b7" }}>Analytics.chunk.js</span> — loaded at /analytics</div>
              <div>📦 <span style={{ color: "#6ee7b7" }}>Contact.chunk.js</span> — loaded at /contact</div>
              <div style={{ marginTop: "0.75rem", color: "var(--text-dim)", fontSize: "0.78rem" }}>
                Each chunk only downloaded when its route is first visited. Faster TTI.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Questions ────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1.25rem" }}>
          🎯 Key Analysis Questions
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {concepts.map((c, i) => (
            <div
              key={i}
              className="glass-card"
              style={{ padding: "1.5rem 1.75rem", borderLeft: "3px solid #6366f1" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <span style={{ fontSize: "1.5rem", flexShrink: 0, marginTop: "2px" }}>{c.icon}</span>
                <div>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.65rem", color: "var(--text-main)" }}>
                    Q{i + 1}: {c.q}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.65 }}>
                    {c.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Student Info Section ─────────────────────────── */}
      <section
        className="glass-card"
        style={{ marginTop: "2.25rem", padding: "1.75rem 2rem" }}
      >
        <h2 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1rem" }}>
          🎓 Lab Reflection
        </h2>
        <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.75 }}>
          <p style={{ marginBottom: "0.75rem" }}>
            <strong style={{ color: "var(--text-main)" }}>Errors encountered &amp; explained:</strong>{" "}
            During implementation, the most common error was attempting to use named exports with{" "}
            <code>React.lazy()</code>, which only works with <em>default exports</em>.
            Each page component must have <code>export default ComponentName</code> at the bottom — not just a named export —
            or Vite will throw <em>"Element type is invalid"</em> at runtime.
          </p>
          <p style={{ marginBottom: "0.75rem" }}>
            <strong style={{ color: "var(--text-main)" }}>Fallback observation:</strong>{" "}
            On fast local connections the fallback UI flashes too quickly to observe.
            Throttling to <em>Slow 3G</em> in DevTools Network tab (or the 300ms minimum delay in Analytics.jsx)
            makes the <code>PageLoader</code> skeleton visibly render before the chunk arrives.
          </p>
          <p>
            <strong style={{ color: "var(--text-main)" }}>Unnecessary re-render identified:</strong>{" "}
            Using React DevTools Profiler, the <code>Navbar</code> component was re-rendering on every task
            CRUD operation even though it only depends on <code>user</code> state.
            This was resolved by ensuring the <code>user</code> and <code>onLogout</code> props are stable references
            (no inline object/function creation on each render in App.jsx).
          </p>
        </div>
      </section>
    </main>
  );
}

export default Contact;
