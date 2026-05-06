// Small shared primitives — Icon, Pill, ReadinessRing, EnvBadge, etc.

const Icon = ({ name, size = 14, stroke = 1.5, style }) => {
  const s = size;
  const common = {
    width: s, height: s, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round",
    style,
  };
  switch (name) {
    case "rocket": return <svg {...common}><path d="M14 4 20 4 20 10"/><path d="M20 4 12 12"/><path d="M9 11 13 15"/><path d="M5 14c-2 4-1 5-1 5s1 1 5-1l4-4-4-4-4 4Z"/></svg>;
    case "timeline": return <svg {...common}><path d="M3 6h12"/><path d="M3 12h18"/><path d="M3 18h8"/><circle cx="17" cy="6" r="2"/><circle cx="14" cy="18" r="2"/></svg>;
    case "bridge": return <svg {...common}><path d="M3 17V9"/><path d="M21 17V9"/><path d="M3 13h18"/><path d="M7 9V7"/><path d="M11 9V7"/><path d="M15 9V7"/><path d="M19 9V7"/></svg>;
    case "deps": return <svg {...common}><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8 7l3 9"/><path d="M16 7l-3 9"/></svg>;
    case "feed": return <svg {...common}><path d="M4 11a8 8 0 0 1 8 8"/><path d="M4 5a14 14 0 0 1 14 14"/><circle cx="5" cy="19" r="1"/></svg>;
    case "search": return <svg {...common}><circle cx="11" cy="11" r="6"/><path d="m20 20-3.5-3.5"/></svg>;
    case "plus": return <svg {...common}><path d="M12 5v14"/><path d="M5 12h14"/></svg>;
    case "filter": return <svg {...common}><path d="M3 5h18"/><path d="M6 12h12"/><path d="M10 19h4"/></svg>;
    case "chevron-right": return <svg {...common}><path d="m9 6 6 6-6 6"/></svg>;
    case "chevron-down": return <svg {...common}><path d="m6 9 6 6 6-6"/></svg>;
    case "check": return <svg {...common}><path d="m5 12 5 5 9-11"/></svg>;
    case "x": return <svg {...common}><path d="M6 6l12 12"/><path d="M18 6 6 18"/></svg>;
    case "lock": return <svg {...common}><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>;
    case "snowflake": return <svg {...common}><path d="M12 3v18"/><path d="M3 12h18"/><path d="m6 6 12 12"/><path d="m18 6-12 12"/></svg>;
    case "sparkle": return <svg {...common}><path d="M12 3v6"/><path d="M12 15v6"/><path d="M3 12h6"/><path d="M15 12h6"/><path d="m6 6 3 3"/><path d="m15 15 3 3"/><path d="m18 6-3 3"/><path d="m9 15-3 3"/></svg>;
    case "git-merge": return <svg {...common}><circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="9" r="2"/><path d="M6 8v8"/><path d="M18 11a8 8 0 0 1-8 7"/></svg>;
    case "alert": return <svg {...common}><path d="M12 9v4"/><circle cx="12" cy="17" r=".6" fill="currentColor"/><path d="M10.3 3.9 2.6 17.4A2 2 0 0 0 4.3 20.4h15.4a2 2 0 0 0 1.7-3l-7.7-13.5a2 2 0 0 0-3.4 0Z"/></svg>;
    case "image": return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m4 18 5-5 4 4 3-3 4 4"/></svg>;
    case "video": return <svg {...common}><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m21 8-5 4 5 4z"/></svg>;
    case "doc": return <svg {...common}><path d="M14 4H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z"/><path d="M14 4v5h5"/></svg>;
    case "user": return <svg {...common}><circle cx="12" cy="9" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>;
    case "bell": return <svg {...common}><path d="M6 9a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>;
    case "play": return <svg {...common}><path d="M7 5v14l12-7z"/></svg>;
    case "calendar": return <svg {...common}><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 9h16"/><path d="M9 3v4"/><path d="M15 3v4"/></svg>;
    case "command": return <svg {...common}><path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3z"/></svg>;
    case "external": return <svg {...common}><path d="M14 5h5v5"/><path d="m19 5-9 9"/><path d="M19 14v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/></svg>;
    case "dot": return <svg {...common}><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>;
    default: return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="2"/></svg>;
  }
};

const RiskDot = ({ level, size = 8 }) => (
  <span style={{
    width: size, height: size, borderRadius: 999, display: "inline-block",
    background: level === "red" ? "var(--risk-red)" : level === "yellow" ? "var(--risk-yellow)" : "var(--risk-green)",
    boxShadow: `0 0 0 3px color-mix(in oklab, ${level === "red" ? "var(--risk-red)" : level === "yellow" ? "var(--risk-yellow)" : "var(--risk-green)"} 18%, transparent)`,
  }}/>
);

const EnvBadge = ({ env }) => {
  const map = {
    "Local":      { bg: "var(--env-local-bg)",   fg: "var(--env-local-fg)",   dot: "var(--env-local-fg)" },
    "Staging":    { bg: "var(--env-stage-bg)",   fg: "var(--env-stage-fg)",   dot: "var(--env-stage-fg)" },
    "Canary":     { bg: "var(--env-canary-bg)",  fg: "var(--env-canary-fg)",  dot: "var(--env-canary-fg)" },
    "Production": { bg: "var(--env-prod-bg)",    fg: "var(--env-prod-fg)",    dot: "var(--env-prod-fg)" },
    "—":          { bg: "var(--bg-2)",           fg: "var(--fg-3)",           dot: "var(--fg-3)" },
  };
  const c = map[env] || map["—"];
  return (
    <span className="env-badge" style={{ background: c.bg, color: c.fg }}>
      <span className="env-dot" style={{ background: c.dot }}/>
      {env}
    </span>
  );
};

// Readiness ring — accepts overall, eng, gtm.
const ReadinessRing = ({ overall, eng, gtm, size = 140, strokeWidth = 10 }) => {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  // Two arcs: GTM (outer half) + ENG (inner). Single ring shows blended.
  const overallOff = c * (1 - overall / 100);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} stroke="var(--border-2)" strokeWidth={strokeWidth} fill="none"/>
        <circle cx={size/2} cy={size/2} r={r}
          stroke="var(--accent)" strokeWidth={strokeWidth} fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={overallOff}
          style={{ transition: "stroke-dashoffset .6s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex",
        flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ fontSize: 38, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--fg-1)", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
          {overall}
        </div>
        <div style={{ fontSize: 9.5, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--fg-3)", marginTop: 6 }}>Readiness</div>
      </div>
    </div>
  );
};

// Two horizontal mini bars — Eng vs GTM
const SplitBars = ({ eng, gtm }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
    {[
      { label: "Engineering", value: eng, hint: "tickets done · build state" },
      { label: "GTM", value: gtm, hint: "assets · deps · approvals" },
    ].map((row, i) => (
      <div key={i}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: "var(--fg-2)", fontWeight: 500 }}>{row.label}</span>
          <span style={{ fontSize: 11, color: "var(--fg-1)", fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>{row.value}<span style={{ color: "var(--fg-3)" }}>%</span></span>
        </div>
        <div style={{ height: 5, background: "var(--bg-2)", borderRadius: 999, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${row.value}%`,
            background: i === 0 ? "var(--fg-1)" : "var(--accent)",
            borderRadius: 999, transition: "width .6s cubic-bezier(.4,0,.2,1)",
          }}/>
        </div>
      </div>
    ))}
  </div>
);

const Kbd = ({ children }) => (
  <kbd style={{
    fontFamily: "var(--font-mono)", fontSize: 10.5,
    padding: "2px 5px", borderRadius: 4,
    border: "1px solid var(--border-1)", background: "var(--bg-1)",
    color: "var(--fg-2)", lineHeight: 1, fontWeight: 500,
  }}>{children}</kbd>
);

const Pill = ({ children, tone = "neutral", icon }) => {
  const tones = {
    neutral: { bg: "var(--bg-2)", fg: "var(--fg-2)" },
    accent:  { bg: "color-mix(in oklab, var(--accent) 12%, transparent)", fg: "var(--accent)" },
    danger:  { bg: "color-mix(in oklab, var(--risk-red) 14%, transparent)", fg: "var(--risk-red)" },
    warn:    { bg: "color-mix(in oklab, var(--risk-yellow) 18%, transparent)", fg: "var(--risk-yellow-fg)" },
    ok:      { bg: "color-mix(in oklab, var(--risk-green) 14%, transparent)", fg: "var(--risk-green)" },
    ghost:   { bg: "transparent", fg: "var(--fg-3)" },
  };
  const c = tones[tone];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: c.bg, color: c.fg,
      padding: "2px 7px", borderRadius: 999,
      fontSize: 10.5, fontWeight: 500, letterSpacing: ".01em",
      whiteSpace: "nowrap",
    }}>
      {icon && <Icon name={icon} size={11} stroke={1.8}/>}
      {children}
    </span>
  );
};

Object.assign(window, { Icon, RiskDot, EnvBadge, ReadinessRing, SplitBars, Kbd, Pill });
