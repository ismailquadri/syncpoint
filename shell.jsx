// Sidebar + topbar — app shell

const Sidebar = ({ active, onNav }) => {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);
  const { dispatch } = useStateContext();
  
  const openCommandPalette = () => {
    dispatch({ type: "OPEN_COMMAND_PALETTE" });
  };
  
  const handleNotificationClick = (launchId) => {
    dispatch({ type: "SET_OPEN_LAUNCH", payload: launchId });
    setShowNotifications(false);
  };
  
  const handleProfileAction = (action) => {
    setShowProfile(false);
    // In a real app, these would navigate to different pages
    console.log('Profile action:', action);
  };
  
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
        <button className="sp-cmd" title="Command palette (⌘K)" onClick={openCommandPalette}>
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
          <div style={{ position: 'relative' }}>
            <button 
              className="sp-avatar" 
              style={{ background: "linear-gradient(135deg,#7B6FF0,#3B82F6)" }}
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              title="Profile"
            >
              ML
            </button>
            
            {showProfile && (
              <div className="sp-dropdown sp-dropdown-profile">
                <div className="sp-dropdown-header">
                  <div className="sp-avatar" style={{ background: "linear-gradient(135deg,#7B6FF0,#3B82F6)", width: 32, height: 32 }}>ML</div>
                  <div>
                    <div className="sp-profile-name">Marcus Lee</div>
                    <div className="sp-profile-email">marcus@lattice.com</div>
                  </div>
                </div>
                <div className="sp-dropdown-body">
                  <button className="sp-dropdown-item" onClick={() => handleProfileAction('settings')}>
                    <Icon name="user" size={14}/>
                    <span>Profile settings</span>
                  </button>
                  <button className="sp-dropdown-item" onClick={() => handleProfileAction('preferences')}>
                    <Icon name="settings" size={14}/>
                    <span>Preferences</span>
                  </button>
                  <button className="sp-dropdown-item" onClick={() => handleProfileAction('help')}>
                    <Icon name="help" size={14}/>
                    <span>Help & support</span>
                  </button>
                </div>
                <div className="sp-dropdown-footer">
                  <button className="sp-dropdown-item sp-dropdown-item-danger" onClick={() => handleProfileAction('logout')}>
                    <Icon name="logout" size={14}/>
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="sp-side-user-meta">
            <div className="sp-side-user-name">Marcus Lee</div>
            <div className="sp-side-user-role">Product Marketer</div>
          </div>
          <div style={{ position: 'relative' }}>
            <button 
              className="sp-icon-btn" 
              title="Notifications"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
            >
              <Icon name="bell" size={14}/>
              <span className="sp-bell-dot"/>
            </button>
            
            {showNotifications && (
              <div className="sp-dropdown sp-dropdown-notifications">
                <div className="sp-dropdown-header">Notifications</div>
                <div className="sp-dropdown-body">
                  <div className="sp-notification-item" onClick={() => handleNotificationClick("lnch-glide")}>
                    <div className="sp-notification-icon" style={{ background: 'color-mix(in oklab, var(--risk-green) 15%, transparent)' }}>
                      <Icon name="check" size={12}/>
                    </div>
                    <div className="sp-notification-content">
                      <div className="sp-notification-title">Glide launched successfully</div>
                      <div className="sp-notification-time">2 hours ago</div>
                    </div>
                  </div>
                  <div className="sp-notification-item" onClick={() => handleNotificationClick("lnch-atlas")}>
                    <div className="sp-notification-icon" style={{ background: 'color-mix(in oklab, var(--risk-yellow) 15%, transparent)' }}>
                      <Icon name="alert" size={12}/>
                    </div>
                    <div className="sp-notification-content">
                      <div className="sp-notification-title">Atlas readiness dropped to 65%</div>
                      <div className="sp-notification-time">5 hours ago</div>
                    </div>
                  </div>
                  <div className="sp-notification-item" onClick={() => handleNotificationClick("lnch-nimbus")}>
                    <div className="sp-notification-icon" style={{ background: 'color-mix(in oklab, var(--accent) 15%, transparent)' }}>
                      <Icon name="sparkle" size={12}/>
                    </div>
                    <div className="sp-notification-content">
                      <div className="sp-notification-title">AI summary generated for Nimbus</div>
                      <div className="sp-notification-time">1 day ago</div>
                    </div>
                  </div>
                </div>
                <div className="sp-dropdown-footer">
                  <button className="sp-btn sp-btn-ghost sp-btn-sm">Mark all as read</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

const TopBar = ({ launch, onBack, onFilterClick, onNewLaunchClick }) => {
  const { state, dispatch } = useStateContext();
  
  const handleSearchChange = (e) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: e.target.value });
  };

  const clearSearch = () => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: "" });
  };

  return (
    <div className="sp-topbar">
      <div className="sp-crumbs">
        <button className="sp-crumb" onClick={onBack}>Launches</button>
        <Icon name="chevron-right" size={12} style={{ color: "var(--fg-4)" }}/>
        <span className="sp-crumb is-current">{launch ? launch.name : "All"}</span>
      </div>
      <div className="sp-top-actions">
        <div className="sp-search">
          <Icon name="search" size={13}/>
          <input 
            placeholder="Search launches, tickets, assets…"
            value={state.searchQuery}
            onChange={handleSearchChange}
          />
          {state.searchQuery && (
            <button className="sp-search-clear" onClick={clearSearch}>
              <Icon name="x" size={12}/>
            </button>
          )}
          <Kbd>⌘K</Kbd>
        </div>
        <button className="sp-btn sp-btn-ghost" onClick={onFilterClick}>
          <Icon name="filter" size={13}/>Filter
        </button>
        <button className="sp-btn sp-btn-primary" onClick={onNewLaunchClick}>
          <Icon name="plus" size={13}/>New launch
        </button>
      </div>
    </div>
  );
};

Object.assign(window, { Sidebar, TopBar });
