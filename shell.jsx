// Sidebar + topbar — app shell

const Sidebar = ({ active, onNav }) => {
  return (
    <aside className="sp-sidebar">
      <div className="sp-brand">
        <div className="sp-logo" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="8" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="16" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 12h8" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </div>
        <div className="sp-brand-text">
          <div className="sp-brand-name">SyncPoint</div>
          <div className="sp-brand-org">Lattice · Q2</div>
        </div>
        <button className="sp-cmd" title="Command palette (⌘K)">
          <Icon name="command" size={12}/>
        </button>
      </div>

      <nav className="sp-nav">
        {window.SP_DATA.NAV.map(item => (
          <button
            key={item.id}
            className={`sp-nav-item ${active === item.id ? "is-active" : ""}`}
            onClick={() => onNav(item.id)}
          >
            <Icon name={item.icon} size={15} stroke={1.6}/>
            <span>{item.label}</span>
            {item.badge ? (
              <span className="sp-nav-badge">{item.badge}</span>
            ) : null}
          </button>
        ))}
      </nav>

      <div className="sp-side-section">
        <div className="sp-side-h">Pinned launches</div>
        {window.SP_DATA.LAUNCHES.filter(l => l.pinned || l.risk !== "green").slice(0,4).map(l => (
          <button key={l.id} className="sp-side-launch" onClick={() => onNav("home", l.id)}>
            <RiskDot level={l.risk} size={7}/>
            <span className="sp-side-launch-name">{l.name.split(" — ")[0]}</span>
            <span className="sp-side-launch-date">{l.target}</span>
          </button>
        ))}
      </div>

      <div className="sp-side-foot">
        <div className="sp-side-user">
          <div className="sp-avatar" style={{ background: "linear-gradient(135deg,#7B6FF0,#3B82F6)" }}>ML</div>
          <div className="sp-side-user-meta">
            <div className="sp-side-user-name">Marcus Lee</div>
            <div className="sp-side-user-role">Product Marketer</div>
          </div>
          <button className="sp-icon-btn" title="Notifications">
            <Icon name="bell" size={14}/>
            <span className="sp-bell-dot"/>
          </button>
        </div>
      </div>
    </aside>
  );
};

const TopBar = ({ launch, onBack }) => (
  <div className="sp-topbar">
    <div className="sp-crumbs">
      <button className="sp-crumb" onClick={onBack}>Launches</button>
      <Icon name="chevron-right" size={12} style={{ color: "var(--fg-4)" }}/>
      <span className="sp-crumb is-current">{launch ? launch.name : "All"}</span>
    </div>
    <div className="sp-top-actions">
      <div className="sp-search">
        <Icon name="search" size={13}/>
        <input placeholder="Search launches, tickets, assets…"/>
        <Kbd>⌘K</Kbd>
      </div>
      <button className="sp-btn sp-btn-ghost"><Icon name="filter" size={13}/>Filter</button>
      <button className="sp-btn sp-btn-primary"><Icon name="plus" size={13}/>New launch</button>
    </div>
  </div>
);

Object.assign(window, { Sidebar, TopBar });
