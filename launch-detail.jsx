// Launch Detail — hero view with Readiness Score, AI Bridge, deps, assets

const Section = ({ title, kicker, action, children, className = "" }) => (
  <section className={`sec ${className}`}>
    <header className="sec-h">
      <div>
        {kicker && <div className="sec-kicker">{kicker}</div>}
        <h3 className="sec-title">{title}</h3>
      </div>
      {action}
    </header>
    {children}
  </section>
);

// Hero card — readiness, eng/gtm split, key facts
const ReadinessCard = ({ launch }) => {
  return (
    <div className="ready-card">
      <div className="ready-left">
        <div className="ready-badges">
          <Pill tone={launch.risk === "red" ? "danger" : launch.risk === "yellow" ? "warn" : "ok"}>
            <RiskDot level={launch.risk} size={6}/>
            {launch.risk === "red" ? "At risk" : launch.risk === "yellow" ? "Watch" : "On track"}
          </Pill>
          <Pill tone="neutral">{launch.pillar}</Pill>
          <Pill tone="ghost">{launch.code}</Pill>
        </div>
        <h2 className="ready-name">{launch.name}</h2>
        <div className="ready-sub">
          Targets <b>{launch.target}</b> · ships in <b>{launch.daysToShip} days</b> · UI freeze <b>{launch.freeze}</b>
        </div>

        <div className="ready-people">
          {[
            { tag: "PM", name: launch.owner.pm, color: "linear-gradient(135deg,#F59E0B,#EF4444)" },
            { tag: "PMM", name: launch.owner.pmm, color: "linear-gradient(135deg,#7B6FF0,#3B82F6)" },
            { tag: "ENG", name: launch.owner.eng, color: "linear-gradient(135deg,#10B981,#059669)" },
          ].map((p, i) => (
            <div key={i} className="ready-person">
              <div className="ready-avatar" style={{ background: p.color }}>{p.name.split(" ").map(n=>n[0]).join("")}</div>
              <div>
                <div className="ready-person-tag">{p.tag}</div>
                <div className="ready-person-name">{p.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ready-right">
        <ReadinessRing overall={launch.readiness} eng={launch.eng} gtm={launch.gtm}/>
        <div className="ready-split">
          <SplitBars eng={launch.eng} gtm={launch.gtm}/>
        </div>
        <div className="ready-deltas">
          <div>
            <span className="ready-delta-label">Δ 7-day</span>
            <span className={`ready-delta-val ${launch.delta >= 0 ? "up" : "dn"}`}>
              {launch.delta > 0 ? "+" : ""}{launch.delta} pts
            </span>
          </div>
          <div>
            <span className="ready-delta-label">Environment</span>
            <EnvBadge env={launch.env}/>
          </div>
        </div>
      </div>
    </div>
  );
};

// AI Bridge panel — streaming summary + asset suggestions (Lovable layout with native style)
const AIBridge = ({ launch }) => {
  const [phase, setPhase] = React.useState("idle"); // idle | streaming | done
  const [shown, setShown] = React.useState(0);
  const [approved, setApproved] = React.useState(false);
  const totalChars = launch.summary.reduce((a,s) => a + s.length, 0);

  const run = () => {
    setPhase("streaming");
    setShown(0);
    setApproved(false);
  };

  React.useEffect(() => {
    if (phase !== "streaming") return;
    const id = setInterval(() => {
      setShown(s => {
        const next = s + 8;
        if (next >= totalChars) { setPhase("done"); clearInterval(id); return totalChars; }
        return next;
      });
    }, 18);
    return () => clearInterval(id);
  }, [phase, totalChars]);

  // Build the visible streaming bullets
  let remaining = shown;
  const visible = launch.summary.map(s => {
    if (remaining <= 0) return null;
    if (remaining >= s.length) { remaining -= s.length; return s; }
    const slice = s.slice(0, remaining); remaining = 0; return slice + "▌";
  });

  return (
    <Section
      kicker="The Bridge"
      title="AI Knowledge Extraction"
      action={
        <div className="bridge-actions">
          {phase === "idle" && (
            <button className="sp-btn sp-btn-primary animate-scale" onClick={run}>
              <Icon name="sparkle" size={13}/> Generate from spec
            </button>
          )}
          {phase === "streaming" && (
            <button className="sp-btn sp-btn-ghost" disabled>
              <span className="bridge-spinner"/> Reading PRD-204…
            </button>
          )}
          {phase === "done" && !approved && (
            <>
              <button className="sp-btn sp-btn-ghost animate-scale" onClick={run}><Icon name="sparkle" size={12}/>Regenerate</button>
              <button className="sp-btn sp-btn-primary animate-scale" onClick={() => setApproved(true)}>
                <Icon name="check" size={13}/> Approve as copy
              </button>
            </>
          )}
          {approved && <Pill tone="ok" icon="check">Approved by Marcus L.</Pill>}
        </div>
      }
    >
      <div className="bridge-native">
        <div className="bridge-native-source">
          <div className="bridge-source-icon"><Icon name="doc" size={16}/></div>
          <div className="bridge-source-content">
            <span className="bridge-source-label">Source</span>
            <span className="bridge-source-name">PRD-204 · v1.4</span>
          </div>
          <a href="#" className="bridge-source-link">Open <Icon name="external" size={11}/></a>
        </div>

        <div className={`bridge-native-content ${phase === "idle" ? "is-empty" : ""} ${approved ? "is-approved" : ""}`}>
          <div className="bridge-content-header">
            <div className="bridge-content-title">
              {approved ? "Approved copy — User value" : "Draft — User value"}
            </div>
            <Pill tone={approved ? "ok" : "warn"}>
              {approved ? "Approved" : "Draft · awaiting review"}
            </Pill>
          </div>

          {phase === "idle" ? (
            <div className="bridge-empty-native">
              <div className="bridge-empty-icon"><Icon name="sparkle" size={32}/></div>
              <div className="bridge-empty-content">
                <div className="bridge-empty-title">No summary yet</div>
                <div className="bridge-empty-sub">The Bridge will turn PRD-204 into 3–5 marketing-ready bullets. You stay in control — drafts are never auto-published.</div>
              </div>
            </div>
          ) : (
            <ul className="bridge-bullets-native">
              {visible.map((s, i) => s ? (
                <li key={i} className="bridge-bullet-native animate-slide">
                  <span className="bridge-bullet-icon"><Icon name="dot" size={6}/></span>
                  <span>{s}</span>
                </li>
              ) : null)}
            </ul>
          )}
        </div>

        {phase === "done" && (
          <div className="bridge-meta-native">
            <div className="bridge-meta-item">
              <Icon name="git-merge" size={12}/> Inferred from <b>4 commits</b> on <b>main</b>
            </div>
            <div className="bridge-meta-item">
              <Icon name="dot" size={9}/> Tone: <b>Plain · enterprise</b>
            </div>
            <div className="bridge-meta-item">
              <Icon name="dot" size={9}/> Reading level: <b>Grade 9</b>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};

const AssetSuggestions = ({ launch }) => {
  const iconFor = k => k === "Loom" ? "video" : k === "Hero image" ? "image" : "image";
  const tones = { ready: "ok", draft: "warn", blocked: "danger", todo: "neutral" };
  return (
    <Section
      kicker="Asset Generator"
      title="Suggested assets"
      action={<button className="sp-btn sp-btn-ghost"><Icon name="plus" size={12}/>Add manually</button>}
    >
      <div className="asset-list">
        {launch.assets.map(a => (
          <div key={a.id} className={`asset-row asset-${a.status}`}>
            <div className="asset-thumb">
              <Icon name={iconFor(a.kind)} size={16}/>
            </div>
            <div className="asset-meta">
              <div className="asset-title">{a.title}</div>
              <div className="asset-source">
                <span className="asset-kind">{a.kind}</span>
                <span className="asset-dot">·</span>
                <code>{a.source}</code>
              </div>
            </div>
            <Pill tone={tones[a.status]}>{a.status}</Pill>
            <button className="sp-icon-btn" title="Open"><Icon name="external" size={13}/></button>
          </div>
        ))}
      </div>
      <div className="asset-foot">
        <Icon name="sparkle" size={12}/>
        Suggestions update when commits touch UI components.
        <a href="#">View commit a7f2c1</a>
      </div>
    </Section>
  );
};

const Dependencies = ({ launch }) => {
  const { dispatch } = useStateContext();
  const toggle = (id) => {
    const dep = launch.deps.find(d => d.id === id);
    const nextStatus = dep.status === "done" ? "in-progress" : "done";
    dispatch({ 
      type: "UPDATE_LAUNCH_DEPENDENCY", 
      payload: { launchId: launch.id, depId: id, status: nextStatus }
    });
  };
  const tones = { done: "ok", "in-progress": "warn", blocked: "danger", todo: "neutral" };
  const labels = { done: "Done", "in-progress": "In progress", blocked: "Blocked", todo: "Not started" };

  const blocking = launch.deps.filter(d => d.hard && d.status !== "done");

  return (
    <Section
      kicker="Dependency Engine"
      title="Hard blocks"
      action={
        <div className="deps-action">
          {blocking.length > 0 && (
            <Pill tone="danger" icon="lock">
              {`Email blocked \u00b7 ${blocking.length} ${blocking.length > 1 ? "deps" : "dep"}`}
            </Pill>
          )}
          <button className="sp-btn sp-btn-ghost"><Icon name="plus" size={12}/>Add dependency</button>
        </div>
      }
    >
      <div className="deps">
        {launch.deps.map(d => (
          <div key={d.id} className={`dep dep-${d.status}`}>
            <button className="dep-check" onClick={() => toggle(d.id)} aria-pressed={d.status === "done"}>
              {d.status === "done" && <Icon name="check" size={12} stroke={2.5}/>}
            </button>
            <div className="dep-main">
              <div className="dep-label">{d.label}</div>
              <div className="dep-meta">
                <span>{d.owner}</span>
                {d.hard && <Pill tone="ghost" icon="lock">hard block</Pill>}
              </div>
            </div>
            <Pill tone={tones[d.status]}>{labels[d.status]}</Pill>
          </div>
        ))}
      </div>
      <div className="deps-foot">
        <Icon name="alert" size={12}/>
        <span>Conflict detected: <b>Sales enablement deck</b> is due May 10 — 4 days before <b>QA verification</b> projects to land.</span>
      </div>
    </Section>
  );
};

const TicketTable = ({ launch }) => {
  const stateTones = { "Done": "ok", "In review": "accent", "In progress": "warn", "To do": "neutral" };
  return (
    <Section
      kicker="Engineering"
      title="Live ticket sync"
      action={<Pill tone="ghost"><Icon name="dot" size={9}/> Synced 2 min ago · Jira</Pill>}
    >
      <div className="tix">
        <div className="tix-head">
          <div>Ticket</div>
          <div>Title</div>
          <div>State</div>
          <div>Environment</div>
        </div>
        {launch.tickets.map(t => (
          <div key={t.id} className="tix-row">
            <div className="tix-id"><code>{t.id}</code></div>
            <div className="tix-title">{t.title}</div>
            <div><Pill tone={stateTones[t.state]}>{t.state}</Pill></div>
            <div><EnvBadge env={t.env}/></div>
          </div>
        ))}
      </div>
    </Section>
  );
};

const ActivityFeed = ({ launch }) => (
  <Section kicker="Activity" title="Recent events">
    <ul className="feed">
      {launch.activity.map((a, i) => (
        <li key={i} className="feed-item">
          <div className="feed-dot"><Icon name="dot" size={9}/></div>
          <div className="feed-body">
            <div className="feed-line"><b>{a.who}</b> {a.what}</div>
            <div className="feed-t">{a.t}</div>
          </div>
        </li>
      ))}
    </ul>
  </Section>
);

// Sticky right rail — quick facts
const QuickRail = ({ launch }) => {
  const facts = [
    { label: "Code", value: launch.code },
    { label: "Target ship", value: launch.target },
    { label: "Days to ship", value: `${launch.daysToShip}d` },
    { label: "UI freeze", value: launch.freeze, icon: "snowflake" },
    { label: "Environment", value: <EnvBadge env={launch.env}/> },
    { label: "Pillar", value: launch.pillar },
  ];
  return (
    <aside className="rail">
      <div className="rail-card">
        <div className="rail-h">Launch facts</div>
        <dl className="rail-list">
          {facts.map((f, i) => (
            <div key={i} className="rail-row">
              <dt>{f.label}</dt>
              <dd>
                {f.icon && <Icon name={f.icon} size={11} style={{ marginRight: 4, color: "var(--fg-3)" }}/>}
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="rail-card">
        <div className="rail-h">Connected</div>
        <ul className="rail-conn">
          <li><span className="rail-conn-name">Jira</span><Pill tone="ok"><Icon name="dot" size={9}/>live</Pill></li>
          <li><span className="rail-conn-name">Linear</span><Pill tone="ok"><Icon name="dot" size={9}/>live</Pill></li>
          <li><span className="rail-conn-name">Asana</span><Pill tone="ok"><Icon name="dot" size={9}/>live</Pill></li>
          <li><span className="rail-conn-name">Figma</span><Pill tone="warn">re-auth</Pill></li>
          <li><span className="rail-conn-name">GitHub</span><Pill tone="ok"><Icon name="dot" size={9}/>live</Pill></li>
        </ul>
      </div>

      <div className="rail-card rail-tip">
        <div className="rail-tip-h"><Icon name="sparkle" size={12}/>Tip</div>
        <p>Set a <b>UI freeze date</b> 5 days before ship — Marcus' campaigns historically land 32% faster.</p>
      </div>
    </aside>
  );
};

const LaunchDetail = ({ launch, onBack }) => {
  const { dispatch } = useStateContext();
  const [activeTab, setActiveTab] = React.useState(0);
  const tabs = ["Overview", "Engineering", "GTM Assets", "Dependencies", "Activity"];
  
  const handleBack = () => {
    dispatch({ type: "CLOSE_LAUNCH" });
    if (onBack) onBack();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Overview
        return (
          <>
            <ReadinessCard launch={launch}/>
            <AIBridge launch={launch}/>
            <Dependencies launch={launch}/>
            <ActivityFeed launch={launch}/>
          </>
        );
      case 1: // Engineering
        return (
          <>
            <ReadinessCard launch={launch}/>
            <TicketTable launch={launch}/>
          </>
        );
      case 2: // GTM Assets
        return (
          <>
            <ReadinessCard launch={launch}/>
            <AssetSuggestions launch={launch}/>
          </>
        );
      case 3: // Dependencies
        return (
          <>
            <ReadinessCard launch={launch}/>
            <Dependencies launch={launch}/>
          </>
        );
      case 4: // Activity
        return (
          <>
            <ReadinessCard launch={launch}/>
            <ActivityFeed launch={launch}/>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="ldetail">
      <div className="ldetail-back">
        <button className="sp-btn sp-btn-ghost" onClick={handleBack}>
          <Icon name="chevron-right" size={13} style={{ transform: "rotate(180deg)" }}/>
          Back to launches
        </button>
        <div className="ldetail-tabs">
          {tabs.map((tab, i) => (
            <button 
              key={tab} 
              className={`ldetail-tab ${i === activeTab ? "is-active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="ldetail-grid">
        <div className="ldetail-main">
          {renderTabContent()}
        </div>
        <QuickRail launch={launch}/>
      </div>
    </div>
  );
};

Object.assign(window, { LaunchDetail });
