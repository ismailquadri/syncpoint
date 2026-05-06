// Dedicated Navigation Pages — AI Bridge, Dependencies, Activity

const AIBridgePage = () => {
  const { state, dispatch } = useStateContext();
  
  const handleViewInLaunch = (launchId) => {
    dispatch({ type: "SET_OPEN_LAUNCH", payload: launchId });
    dispatch({ type: "SET_ACTIVE_NAV", payload: "home" });
  };
  
  return (
    <div className="dedicated-page">
      <div className="page-header">
        <h1>AI Bridge</h1>
        <p className="page-sub">AI-powered knowledge extraction from technical specs</p>
      </div>
      
      <div className="page-content">
        <div className="bridge-grid-native">
          {state.launches.filter(l => l.summary && l.summary.length > 0).map((launch, index) => (
            <div key={launch.id} className="bridge-card-native animate-fade" style={{ animationDelay: `${index * 0.08}s` }}>
              <div className="bridge-card-header-native">
                <div className="bridge-card-icon"><Icon name="rocket" size={24}/></div>
                <div className="bridge-card-title">{launch.name}</div>
                <Pill tone="ghost">{launch.code}</Pill>
              </div>
              <div className="bridge-card-body-native">
                <ul className="bridge-bullets-native">
                  {launch.summary.map((point, i) => (
                    <li key={i} className="bridge-bullet-native animate-slide">
                      <span className="bridge-bullet-icon"><Icon name="dot" size={6}/></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bridge-card-footer-native">
                <button 
                  className="sp-btn sp-btn-ghost"
                  onClick={() => handleViewInLaunch(launch.id)}
                >
                  View in launch <Icon name="arrow-right" size={12}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DependenciesPage = () => {
  const { state } = useStateContext();
  const tones = { done: "ok", "in-progress": "warn", blocked: "danger", todo: "neutral" };
  const labels = { done: "Done", "in-progress": "In progress", blocked: "Blocked", todo: "Not started" };
  
  return (
    <div className="dedicated-page">
      <div className="page-header">
        <h1>Dependencies</h1>
        <p className="page-sub">Cross-functional dependencies across all launches</p>
      </div>
      
      <div className="page-content">
        <div className="deps-overview">
          {state.launches.map(launch => (
            <div key={launch.id} className="deps-launch-card">
              <div className="deps-launch-header">
                <div>
                  <div className="deps-launch-title">{launch.name}</div>
                  <Pill tone="ghost">{launch.code}</Pill>
                </div>
                <RiskDot level={launch.risk}/>
              </div>
              
              {launch.deps && launch.deps.length > 0 ? (
                <div className="deps-list">
                  {launch.deps.map(dep => (
                    <div key={dep.id} className={`dep-item dep-${dep.status}`}>
                      <div className="dep-item-main">
                        <div className="dep-item-label">{dep.label}</div>
                        <div className="dep-item-meta">
                          <span>{dep.owner}</span>
                          {dep.hard && <Pill tone="ghost" icon="lock">hard block</Pill>}
                        </div>
                      </div>
                      <Pill tone={tones[dep.status]}>{labels[dep.status]}</Pill>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="deps-empty">No dependencies</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ActivityPage = () => {
  const { state } = useStateContext();
  
  // Flatten all activity across all launches and sort by time
  const allActivity = React.useMemo(() => {
    const activities = [];
    state.launches.forEach(launch => {
      launch.activity.forEach(act => {
        activities.push({
          ...act,
          launchName: launch.name,
          launchId: launch.id,
          launchCode: launch.code
        });
      });
    });
    return activities.sort((a, b) => {
      // Simple sort - in real app would parse time strings
      return 0;
    });
  }, [state.launches]);
  
  return (
    <div className="dedicated-page">
      <div className="page-header">
        <h1>Activity Feed</h1>
        <p className="page-sub">Recent activity across all launches</p>
      </div>
      
      <div className="page-content">
        <div className="activity-feed-page">
          {allActivity.length > 0 ? (
            allActivity.map((act, i) => (
              <div key={i} className="activity-feed-item">
                <div className="activity-feed-dot"><Icon name="dot" size={9}/></div>
                <div className="activity-feed-body">
                  <div className="activity-feed-line">
                    <b>{act.who}</b> {act.what}
                  </div>
                  <div className="activity-feed-meta">
                    <span className="activity-feed-launch">{act.launchName}</span>
                    <span className="activity-feed-time">{act.t}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="activity-empty">No recent activity</div>
          )}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { AIBridgePage, DependenciesPage, ActivityPage });