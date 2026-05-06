// Filter Panel — dropdown for filtering launches by risk and environment

const FilterPanel = ({ isOpen, onClose }) => {
  const { state, dispatch } = useStateContext();
  const panelRef = React.useRef(null);

  // Close when clicking outside
  React.useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleRiskFilter = (risk) => {
    dispatch({ type: "SET_FILTER_RISK", payload: risk });
  };

  const handleEnvFilter = (env) => {
    dispatch({ type: "SET_FILTER_ENV", payload: env });
  };

  const clearAllFilters = () => {
    dispatch({ type: "CLEAR_FILTERS" });
  };

  const hasActiveFilters = state.filterPillar !== "All" || state.filterRisk || state.filterEnv;

  if (!isOpen) return null;

  return (
    <div className="filter-panel-backdrop" onClick={onClose}>
      <div ref={panelRef} className="filter-panel" onClick={e => e.stopPropagation()}>
        <div className="filter-panel-header">
          <h3>Filters</h3>
          <button className="filter-panel-close" onClick={onClose}>
            <Icon name="x" size={14}/>
          </button>
        </div>

        <div className="filter-panel-section">
          <div className="filter-section-title">Pillar</div>
          <div className="filter-chips">
            {window.SP_DATA.PILLARS.map(p => (
              <button
                key={p}
                className={`filter-chip ${state.filterPillar === p ? "is-active" : ""}`}
                onClick={() => dispatch({ type: "SET_FILTER_PILLAR", payload: p })}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-panel-section">
          <div className="filter-section-title">Risk Level</div>
          <div className="filter-chips">
            <button
              className={`filter-chip ${state.filterRisk === null ? "is-active" : ""}`}
              onClick={() => handleRiskFilter(null)}
            >
              All
            </button>
            <button
              className={`filter-chip ${state.filterRisk === "green" ? "is-active" : ""}`}
              onClick={() => handleRiskFilter("green")}
            >
              <RiskDot level="green" size={6}/> On track
            </button>
            <button
              className={`filter-chip ${state.filterRisk === "yellow" ? "is-active" : ""}`}
              onClick={() => handleRiskFilter("yellow")}
            >
              <RiskDot level="yellow" size={6}/> At risk
            </button>
            <button
              className={`filter-chip ${state.filterRisk === "red" ? "is-active" : ""}`}
              onClick={() => handleRiskFilter("red")}
            >
              <RiskDot level="red" size={6}/> Blocked
            </button>
          </div>
        </div>

        <div className="filter-panel-section">
          <div className="filter-section-title">Environment</div>
          <div className="filter-chips">
            <button
              className={`filter-chip ${state.filterEnv === null ? "is-active" : ""}`}
              onClick={() => handleEnvFilter(null)}
            >
              All
            </button>
            {["Local", "Staging", "Canary", "Production"].map(env => (
              <button
                key={env}
                className={`filter-chip ${state.filterEnv === env ? "is-active" : ""}`}
                onClick={() => handleEnvFilter(env)}
              >
                <EnvBadge env={env}/>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-panel-footer">
          <span className="filter-count">
            {hasActiveFilters ? "Filters active" : "No filters applied"}
          </span>
          {hasActiveFilters && (
            <button className="sp-btn sp-btn-ghost" onClick={clearAllFilters}>
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { FilterPanel });