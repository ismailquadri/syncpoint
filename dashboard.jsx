// Dashboard view — quarter header, launches table, mini timeline

const QuarterHeader = ({ launches }) => {
  const { state, dispatch } = useStateContext();
  const atRisk = launches.filter(l => l.risk !== "green").length;
  const onTrack = launches.length - atRisk;
  const avgReadiness = Math.round(launches.reduce((a,l) => a+l.readiness, 0) / launches.length);

  const openNewLaunchModal = () => {
    dispatch({ type: "OPEN_NEW_LAUNCH_MODAL" });
  };

  // Format sync time
  const formatSyncTime = (date) => {
    if (!date) return "Never";
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const stats = [
    { label: "In flight", value: launches.length, hint: "active launches" },
    { label: "Avg readiness", value: `${avgReadiness}`, suffix: "%", hint: "blended eng + gtm", trend: +4 },
    { label: "At risk", value: atRisk, hint: "yellow or red", tone: atRisk > 1 ? "warn" : "neutral" },
    { label: "On track", value: onTrack, hint: "green" },
    { label: "Ships this week", value: 2, hint: "by Sun, May 10" },
  ];

  return (
    <div className="qhdr">
      <div className="qhdr-title">
        <div className="qhdr-eyebrow">Quarter</div>
        <h1>Q2 2026 — Reliability &amp; Self-Serve</h1>
        <div className="qhdr-sub">
          <span>Today is <b>Wed, May 6</b></span>
          <span className="qhdr-dot"/>
          <span>Quarter ends in <b>56 days</b></span>
          <span className="qhdr-dot"/>
          <span>
            Last sync: <b>{formatSyncTime(state.lastSyncTime)}</b>
            {state.syncStatus === "syncing" && <span className="sync-indicator syncing"/>}
            {state.syncStatus === "connected" && <span className="sync-indicator connected"/>}
            {state.syncStatus === "error" && <span className="sync-indicator error"/>}
            · <a href="#" className="qhdr-link">view sources</a>
          </span>
        </div>
      </div>
      <div className="qhdr-actions">
        <button className="sp-btn sp-btn-primary" onClick={openNewLaunchModal}>
          <Icon name="plus" size={14}/>
          New Launch
        </button>
      </div>
      <div className="qhdr-stats">
        {stats.map((s, i) => (
          <div key={i} className="qhdr-stat">
            <div className="qhdr-stat-label">{s.label}</div>
            <div className="qhdr-stat-row">
              <div className={`qhdr-stat-value ${s.tone === "warn" ? "is-warn" : ""}`}>
                {s.value}{s.suffix && <span className="qhdr-stat-suffix">{s.suffix}</span>}
              </div>
              {s.trend != null && (
                <span className={`qhdr-trend ${s.trend > 0 ? "up" : "dn"}`}>
                  {s.trend > 0 ? "↑" : "↓"}{Math.abs(s.trend)}
                </span>
              )}
            </div>
            <div className="qhdr-stat-hint">{s.hint}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LaunchRow = ({ launch, onOpen, isActive }) => {
  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <button 
      className={`lrow ${isActive ? "is-active" : ""}`} 
      onClick={() => onOpen(launch.id)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="lrow-risk"><RiskDot level={launch.risk}/></div>

      <div className="lrow-id">
        <div className="lrow-code">{launch.code}</div>
        <div className="lrow-pillar">{launch.pillar}</div>
      </div>

      <div className="lrow-name">
        <div className="lrow-title text-truncate">{launch.name}</div>
        <div className="lrow-owners">
          <span className="text-truncate"><span className="lrow-owner-tag">PM</span>{launch.owner.pm}</span>
          <span className="text-truncate"><span className="lrow-owner-tag">PMM</span>{launch.owner.pmm}</span>
        </div>
      </div>

      <div className="lrow-env"><EnvBadge env={launch.env}/></div>

      <div className="lrow-readiness">
        <div className="lrow-bar">
          <div className="lrow-bar-fill" style={{ width: `${launch.readiness}%` }}/>
        </div>
        <div className="lrow-readiness-num">
          {launch.readiness}<span>%</span>
          {launch.delta !== 0 && (
            <span className={`lrow-delta ${launch.delta > 0 ? "up" : "dn"}`}>
              {launch.delta > 0 ? "+" : ""}{launch.delta}
            </span>
          )}
        </div>
        {showTooltip && (
          <div className="readiness-tooltip">
            <div className="readiness-tooltip-header">
              <strong>{launch.readiness}% Ready to Ship</strong>
            </div>
            <div className="readiness-tooltip-breakdown">
              <div className="readiness-breakdown-item">
                <span>Engineering:</span>
                <span className="readiness-breakdown-value">{launch.eng}%</span>
              </div>
              <div className="readiness-breakdown-item">
                <span>GTM:</span>
                <span className="readiness-breakdown-value">{launch.gtm}%</span>
              </div>
            </div>
            <div className="readiness-tooltip-hint">
              Blended score of technical and go-to-market readiness
            </div>
          </div>
        )}
      </div>

      <div className="lrow-blockers">
        {launch.blockers > 0 ? (
          <Pill tone={launch.blockers > 1 ? "danger" : "warn"} icon="alert">
            {launch.blockers} blocker{launch.blockers > 1 ? "s" : ""}
          </Pill>
        ) : (
          <Pill tone="ghost">clear</Pill>
        )}
      </div>

      <div className="lrow-target">
        <div className="lrow-target-date">{launch.target}</div>
        <div className="lrow-target-rel">in {launch.daysToShip}d</div>
      </div>

      <div className="lrow-arrow"><Icon name="chevron-right" size={14}/></div>
    </button>
  );
};

// Quarter timeline — horizontal Gantt of all launches
const QuarterTimeline = ({ launches, onOpen, density }) => {
  // Calendar: weeks from May 4 (W1) through Jun 28 (W9)
  const weeks = [
    "May 4", "May 11", "May 18", "May 25",
    "Jun 1", "Jun 8", "Jun 15", "Jun 22"
  ];
  // Simple positions per launch: [startWeek, durationWeeks, freezeWeek]
  const placements = {
    "lnch-glide":  { start: 0, dur: 1.3, freeze: 0.7 },
    "lnch-atlas":  { start: 0.4, dur: 2.5, freeze: 1.5 },
    "lnch-nimbus": { start: 1.2, dur: 2.6, freeze: 2.3 },
    "lnch-marble": { start: 1.8, dur: 2.2, freeze: 3.4 },
    "lnch-orbit":  { start: 3.4, dur: 2.4, freeze: 5.2 },
    "lnch-pebble": { start: 4.6, dur: 2.7, freeze: 6.6 },
  };
  const today = 0.4; // 0..weeks.length-1 — "today" marker
  const colW = `minmax(0,1fr)`;

  return (
    <div className={`tl ${density === "compact" ? "is-compact" : ""}`}>
      <div className="tl-head" style={{ gridTemplateColumns: `220px repeat(${weeks.length}, ${colW})` }}>
        <div className="tl-corner">Cross-functional timeline</div>
        {weeks.map((w, i) => (
          <div key={i} className="tl-week">
            <div className="tl-week-label">W{i+1}</div>
            <div className="tl-week-date">{w}</div>
          </div>
        ))}
      </div>

      <div className="tl-body" style={{ gridTemplateColumns: `220px repeat(${weeks.length}, ${colW})` }}>
        {/* today line spanning all rows */}
        <div className="tl-today" style={{ left: `calc(220px + ${(today / weeks.length) * 100}% * (1 - 220px / 100%))` }}/>
        {launches.map((l, idx) => {
          const p = placements[l.id] || { start: 0, dur: 1, freeze: 0.5 };
          const leftPct = (p.start / weeks.length) * 100;
          const widthPct = (p.dur / weeks.length) * 100;
          const freezePct = (p.freeze / weeks.length) * 100;
          return (
            <React.Fragment key={l.id}>
              <button className="tl-rowlabel" onClick={() => onOpen(l.id)}>
                <RiskDot level={l.risk} size={7}/>
                <span className="tl-rowlabel-name">{l.name.split(" — ")[0]}</span>
                <span className="tl-rowlabel-pillar">{l.pillar}</span>
              </button>
              <div className="tl-rowtrack" style={{ gridColumn: `2 / span ${weeks.length}` }}>
                {/* vertical week separators */}
                {weeks.map((_, i) => (
                  <div key={i} className="tl-rowtrack-tick" style={{ left: `${(i / weeks.length) * 100}%` }}/>
                ))}
                {/* freeze line */}
                <div className="tl-freeze" style={{ left: `${freezePct}%` }} title={`Freeze ${l.freeze}`}>
                  <Icon name="snowflake" size={10}/>
                </div>
                {/* bar */}
                <button
                  className={`tl-bar tl-bar-${l.risk}`}
                  style={{ left: `${leftPct}%`, width: `${widthPct}%`, animationDelay: `${idx * 0.08}s` }}
                  onClick={(e) => { e.stopPropagation(); onOpen(l.id); }}
                  title={l.name}
                >
                  <span className="tl-bar-name">{l.name}</span>
                  <span className="tl-bar-readiness">{l.readiness}%</span>
                  <span className="tl-bar-end" title="Ship target"/>
                </button>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="tl-legend">
        <span className="tl-legend-item"><span className="tl-legend-bar tl-bar-green"/>On track</span>
        <span className="tl-legend-item"><span className="tl-legend-bar tl-bar-yellow"/>At risk</span>
        <span className="tl-legend-item"><span className="tl-legend-bar tl-bar-red"/>Blocked</span>
        <span className="tl-legend-item"><Icon name="snowflake" size={11}/>UI freeze date</span>
        <span className="tl-legend-item"><span className="tl-legend-today-dot"/>Today · May 6</span>
      </div>
    </div>
  );
};

const Dashboard = ({ launches, onOpen, density, view }) => {
  const { state, dispatch } = useStateContext();

  const handleViewChange = (newView) => {
    dispatch({ type: "SET_LOADING", payload: { isLoading: true, message: "Switching view..." } });
    setTimeout(() => {
      dispatch({ type: "SET_VIEW", payload: newView });
      dispatch({ type: "SET_LOADING", payload: { isLoading: false } });
    }, 300);
  };

  return (
    <div className="dash">
      {state.isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <LoadingSpinner size="large"/>
            <div className="loading-text">{state.loadingMessage || "Loading..."}</div>
          </div>
        </div>
      )}
      {state.error && (
        <div className="error-banner">
          <Icon name="alert" size={16}/>
          <span className="error-message">{state.errorMessage || "An error occurred"}</span>
          <button className="error-close" onClick={() => dispatch({ type: "CLEAR_ERROR" })}>
            <Icon name="x" size={14}/>
          </button>
        </div>
      )}
      <QuarterHeader launches={launches}/>

      <div className="dash-tabs">
        <div className="dash-pillars">
          {window.SP_DATA.PILLARS.map(p => (
            <button
              key={p}
              className={`dash-pillar ${state.filterPillar === p ? "is-active" : ""}`}
              onClick={() => dispatch({ type: "SET_FILTER_PILLAR", payload: p })}
            >
              {p}
              {p !== "All" && (
                <span className="dash-pillar-count">{launches.filter(l => l.pillar === p).length}</span>
              )}
            </button>
          ))}
        </div>
        <div className="dash-tabs-right">
          <div className="view-switch">
            <button 
              className={view === "list" ? "is-active" : ""} 
              onClick={() => handleViewChange("list")}
              title="Table view"
            >
              <Icon name="list" size={14}/>
            </button>
            <button 
              className={view === "board" ? "is-active" : ""} 
              onClick={() => handleViewChange("board")}
              title="Kanban board"
            >
              <Icon name="layout" size={14}/>
            </button>
            <button 
              className={view === "timeline" ? "is-active" : ""} 
              onClick={() => handleViewChange("timeline")}
              title="Timeline view"
            >
              <Icon name="timeline" size={14}/>
            </button>
          </div>
          <div className="dash-view-hint">
            <Icon name="dot" size={10}/> Live · Jira · Linear · Asana · Figma · GitHub
          </div>
        </div>
      </div>

      {view === "list" && (
        <div className="ltable">
          <div className="ltable-head">
            <div></div>
            <div>ID</div>
            <div>Launch</div>
            <div>Environment</div>
            <div>Readiness</div>
            <div>Status</div>
            <div>Target</div>
            <div></div>
          </div>
          {launches.length === 0 ? (
            <div className="ltable-empty">
              <Icon name="search" size={32} style={{ color: "var(--fg-3)" }}/>
              <div className="ltable-empty-title">No launches found</div>
              <div className="ltable-empty-sub">Try adjusting your filters or search query</div>
            </div>
          ) : (
            launches.map(l => (
              <LaunchRow key={l.id} launch={l} onOpen={onOpen}/>
            ))
          )}
        </div>
      )}

      {view === "timeline" && (
        <>
          {launches.length === 0 ? (
            <div className="view-empty">
              <Icon name="timeline" size={32} style={{ color: "var(--fg-3)" }}/>
              <div className="view-empty-title">No launches to display</div>
              <div className="view-empty-sub">Try adjusting your filters or search query</div>
            </div>
          ) : (
            <QuarterTimeline launches={launches} onOpen={onOpen} density={density}/>
          )}
        </>
      )}

      {view === "board" && (
        <>
          {launches.length === 0 ? (
            <div className="view-empty">
              <Icon name="layout" size={32} style={{ color: "var(--fg-3)" }}/>
              <div className="view-empty-title">No launches to display</div>
              <div className="view-empty-sub">Try adjusting your filters or search query</div>
            </div>
          ) : (
            <KanbanBoard launches={launches} onOpen={onOpen}/>
          )}
        </>
      )}
    </div>
  );
};

const KanbanBoard = ({ launches, onOpen }) => {
  const { dispatch } = useStateContext();
  const cols = [
    { id: "Local", label: "Local" },
    { id: "Staging", label: "Staging" },
    { id: "Canary", label: "Canary" },
    { id: "Production", label: "Production" },
  ];

  const handleDragStart = (e, launchId) => {
    e.dataTransfer.setData('launchId', launchId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetEnv) => {
    e.preventDefault();
    const launchId = e.dataTransfer.getData('launchId');
    if (launchId) {
      dispatch({ 
        type: "UPDATE_LAUNCH", 
        payload: { id: launchId, updates: { env: targetEnv } } 
      });
    }
  };

  const KanbanCard = ({ launch, onOpen }) => {
    const [showTooltip, setShowTooltip] = React.useState(false);

    return (
      <div style={{ position: 'relative' }}>
        <button 
          className="kb-card" 
          onClick={() => onOpen(launch.id)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          draggable
          onDragStart={(e) => handleDragStart(e, launch.id)}
        >
          <div className="kb-card-top">
            <RiskDot level={launch.risk} size={7}/>
            <span className="kb-card-code">{launch.code}</span>
            <span className="kb-card-pillar">{launch.pillar}</span>
          </div>
          <div className="kb-card-title text-truncate-2">{launch.name}</div>
          <div className="kb-card-bar"><div style={{ width: `${launch.readiness}%` }}/></div>
          <div className="kb-card-foot">
            <span>{launch.readiness}% ready</span>
            <span>{launch.target}</span>
          </div>
        </button>
        {showTooltip && (
          <div className="readiness-tooltip" style={{ bottom: 'auto', top: 'calc(100% + 8px)' }}>
            <div className="readiness-tooltip-header">
              <strong>{launch.readiness}% Ready to Ship</strong>
            </div>
            <div className="readiness-tooltip-breakdown">
              <div className="readiness-breakdown-item">
                <span>Engineering:</span>
                <span className="readiness-breakdown-value">{launch.eng}%</span>
              </div>
              <div className="readiness-breakdown-item">
                <span>GTM:</span>
                <span className="readiness-breakdown-value">{launch.gtm}%</span>
              </div>
            </div>
            <div className="readiness-tooltip-hint">
              Blended score of technical and go-to-market readiness
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="kb">
      {cols.map(col => {
        const items = launches.filter(l => l.env === col.id);
        return (
          <div 
            key={col.id} 
            className="kb-col"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="kb-col-head">
              <EnvBadge env={col.id}/>
              <span className="kb-col-count">{items.length}</span>
            </div>
            <div className="kb-col-body">
              {items.map(l => (
                <KanbanCard key={l.id} launch={l} onOpen={onOpen}/>
              ))}
              {items.length === 0 && <div className="kb-empty">—</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

Object.assign(window, { Dashboard });
