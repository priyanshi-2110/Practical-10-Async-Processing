import React, { useEffect, useState, useMemo } from "react";
import { getTasks } from "../api";

// ─── Analytics Page ───────────────────────────────────────────
// This is a LAZILY LOADED chunk — Supplementary Problem:
// A "heavy" dashboard component loaded only when /analytics is visited.
// ─────────────────────────────────────────────────────────────

// Simulate a heavy chart component (lazy-loaded with minimum 300ms delay)
// Real-world: this would be e.g. recharts / chart.js imported here
function BarChart({ data, maxValue }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "0.75rem", height: "160px" }}>
      {data.map((item) => {
        const heightPct = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
        return (
          <div
            key={item.label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.4rem",
              flex: 1,
            }}
          >
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 700,
                color: item.color || "var(--text-main)",
              }}
            >
              {item.value}
            </span>
            <div
              style={{
                width: "100%",
                maxWidth: "60px",
                height: `${heightPct}%`,
                minHeight: "4px",
                background: item.color || "var(--primary)",
                borderRadius: "6px 6px 0 0",
                transition: "height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                boxShadow: `0 0 12px ${item.color || "var(--primary)"}44`,
              }}
            />
            <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", textAlign: "center" }}>
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({ completed, total }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const circumference = 2 * Math.PI * 45;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
      <svg width="120" height="120" viewBox="0 0 100 100">
        {/* Background track */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        {/* Progress arc */}
        <circle
          cx="50" cy="50" r="45"
          fill="none"
          stroke="#10b981"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
        <text x="50" y="46" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
          {pct}%
        </text>
        <text x="50" y="60" textAnchor="middle" fill="#94a3b8" fontSize="8">
          complete
        </text>
      </svg>
    </div>
  );
}

function Analytics() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Supplementary: 300ms minimum delay to demonstrate fallback visibility
    const minDelay = new Promise((r) => setTimeout(r, 300));
    const fetchData = getTasks().then((data) => data).catch((err) => { throw err; });

    Promise.all([minDelay, fetchData])
      .then(([, data]) => {
        setTasks(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const high = tasks.filter((t) => t.priority === "high").length;
    const medium = tasks.filter((t) => t.priority === "medium").length;
    const low = tasks.filter((t) => t.priority === "low").length;

    // Tasks per day (last 7 days)
    const now = Date.now();
    const byDay = Array.from({ length: 7 }, (_, i) => {
      const dayStart = now - (6 - i) * 86400000;
      const dayEnd = dayStart + 86400000;
      const count = tasks.filter((t) => {
        const created = new Date(t.createdAt).getTime();
        return created >= dayStart && created < dayEnd;
      }).length;
      const d = new Date(dayStart);
      return {
        label: d.toLocaleDateString("en-US", { weekday: "short" }),
        value: count,
        color: "#6366f1",
      };
    });

    return { total, completed, pending, high, medium, low, byDay };
  }, [tasks]);

  const priorityChartData = [
    { label: "High", value: stats.high, color: "#f43f5e" },
    { label: "Medium", value: stats.medium, color: "#f59e0b" },
    { label: "Low", value: stats.low, color: "#10b981" },
  ];
  const maxDayCount = Math.max(...stats.byDay.map((d) => d.value), 1);
  const maxPriority = Math.max(stats.high, stats.medium, stats.low, 1);

  const statCards = [
    { label: "Total Tasks", value: stats.total, icon: "📋", color: "#6366f1", bg: "rgba(99,102,241,0.15)" },
    { label: "Completed", value: stats.completed, icon: "✅", color: "#10b981", bg: "rgba(16,185,129,0.15)" },
    { label: "Pending", value: stats.pending, icon: "⏳", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
    { label: "High Priority", value: stats.high, icon: "🔥", color: "#f43f5e", bg: "rgba(244,63,94,0.15)" },
  ];

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "1rem" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(99,102,241,0.2)", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "var(--text-muted)" }}>Loading analytics data...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: "600px", margin: "4rem auto", textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
        <h2 style={{ color: "#fb7185", marginBottom: "0.5rem" }}>Failed to load analytics</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          {error} — Make sure you are logged in and the backend is running.
        </p>
      </div>
    );
  }

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>

      {/* ── Page Header ──────────────────────────────────── */}
      <div style={{ marginBottom: "2.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "1.8rem" }}>📊</span>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Analytics Dashboard
          </h1>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Real-time task statistics — this page is a{" "}
          <span style={{ color: "#a5b4fc", fontWeight: 600 }}>lazily-loaded chunk</span> (Practical 8 Supplementary Problem).
          It is only downloaded by the browser when you navigate here.
        </p>
      </div>

      {/* ── Stat Cards ───────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {statCards.map((s) => (
          <div
            key={s.label}
            className="glass-card"
            style={{
              padding: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: s.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                flexShrink: 0,
              }}
            >
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-dim)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {s.label}
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: s.color, lineHeight: 1.1 }}>
                {s.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ───────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem", marginBottom: "2rem" }}>

        {/* Completion Donut */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem" }}>
            Completion Rate
          </h3>
          <DonutChart completed={stats.completed} total={stats.total} />
          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1rem", fontSize: "0.78rem" }}>
            <span style={{ color: "#10b981" }}>● Done ({stats.completed})</span>
            <span style={{ color: "#f59e0b" }}>● Pending ({stats.pending})</span>
          </div>
        </div>

        {/* Priority Bar Chart */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem" }}>
            Tasks by Priority
          </h3>
          <BarChart data={priorityChartData} maxValue={maxPriority} />
        </div>

        {/* 7-Day Activity */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem" }}>
            Created (Last 7 Days)
          </h3>
          <BarChart data={stats.byDay} maxValue={maxDayCount} />
        </div>
      </div>

      {/* ── Lazy Loading Info Box ────────────────────────── */}
      <div
        className="glass-card"
        style={{
          padding: "1.5rem 2rem",
          borderLeft: "4px solid #a78bfa",
          background: "rgba(167,139,250,0.06)",
        }}
      >
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#a78bfa", marginBottom: "0.5rem" }}>
          📚 Practical 8 — Supplementary Problem: Lazy-Loaded Heavy Component
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>
          This entire Analytics page — including its custom <code>BarChart</code>, <code>DonutChart</code> rendering
          logic and data-fetching logic — is only bundled into a <strong style={{ color: "var(--text-main)" }}>separate JS chunk</strong> by Vite.
          When a user first loads the app they download <em>zero bytes</em> of this component.
          The chunk is fetched only when they navigate to <code>/analytics</code>. A minimum 300ms delay
          is enforced to make the Suspense fallback visible even on fast connections.
        </p>
      </div>
    </main>
  );
}

export default Analytics;
