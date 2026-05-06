// State Management with React Context
// Centralized state for launches, navigation, search, filters, and UI state

const StateContext = React.createContext(null);

const initialState = {
  // Data
  launches: window.SP_DATA.LAUNCHES,
  
  // Navigation
  activeNav: "home",
  openLaunchId: null,
  view: "list", // list, board, timeline
  
  // Search & Filters
  searchQuery: "",
  filterPillar: "All",
  filterRisk: null, // null, "green", "yellow", "red"
  filterEnv: null,  // null, "Local", "Staging", "Canary", "Production"
  
  // UI State
  commandPaletteOpen: false,
  newLaunchModalOpen: false,
  isLoading: false,
  loadingMessage: "",
  error: null,
  errorMessage: "",
  
  // Real-time sync simulation
  lastSyncTime: new Date(),
  syncStatus: "connected", // connected, syncing, error
};

function stateReducer(state, action) {
  switch (action.type) {
    // Navigation
    case "SET_ACTIVE_NAV":
      return { ...state, activeNav: action.payload, openLaunchId: null };
    
    case "SET_OPEN_LAUNCH":
      return { ...state, openLaunchId: action.payload };
    
    case "CLOSE_LAUNCH":
      return { ...state, openLaunchId: null };
    
    case "SET_VIEW":
      return { ...state, view: action.payload };
    
    // Search & Filters
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    
    case "SET_FILTER_PILLAR":
      return { ...state, filterPillar: action.payload };
    
    case "SET_FILTER_RISK":
      return { ...state, filterRisk: action.payload };
    
    case "SET_FILTER_ENV":
      return { ...state, filterEnv: action.payload };
    
    case "CLEAR_FILTERS":
      return { 
        ...state, 
        filterPillar: "All", 
        filterRisk: null, 
        filterEnv: null 
      };
    
    // Launch Data Updates
    case "UPDATE_LAUNCH":
      return {
        ...state,
        launches: state.launches.map(l => 
          l.id === action.payload.id ? { ...l, ...action.payload.updates } : l
        )
      };
    
    case "ADD_LAUNCH":
      return {
        ...state,
        launches: [...state.launches, action.payload]
      };
    
    case "UPDATE_LAUNCH_DEPENDENCY":
      return {
        ...state,
        launches: state.launches.map(l => {
          if (l.id !== action.payload.launchId) return l;
          return {
            ...l,
            deps: l.deps.map(d =>
              d.id === action.payload.depId
                ? { ...d, status: action.payload.status }
                : d
            )
          };
        })
      };
    
    case "UPDATE_LAUNCH_ASSET":
      return {
        ...state,
        launches: state.launches.map(l => {
          if (l.id !== action.payload.launchId) return l;
          return {
            ...l,
            assets: l.assets.map(a =>
              a.id === action.payload.assetId
                ? { ...a, status: action.payload.status }
                : a
            )
          };
        })
      };
    
    case "ADD_ACTIVITY":
      return {
        ...state,
        launches: state.launches.map(l => {
          if (l.id !== action.payload.launchId) return l;
          return {
            ...l,
            activity: [action.payload.activity, ...l.activity]
          };
        })
      };
    
    // UI State
    case "OPEN_COMMAND_PALETTE":
      return { ...state, commandPaletteOpen: true };
    
    case "CLOSE_COMMAND_PALETTE":
      return { ...state, commandPaletteOpen: false };
    
    case "OPEN_NEW_LAUNCH_MODAL":
      return { ...state, newLaunchModalOpen: true };
    
    case "CLOSE_NEW_LAUNCH_MODAL":
      return { ...state, newLaunchModalOpen: false };
    
    case "SET_LOADING":
      return { ...state, isLoading: action.payload.isLoading, loadingMessage: action.payload.message || "" };
    
    case "SET_ERROR":
      return { ...state, error: action.payload.error, errorMessage: action.payload.message || "" };
    
    case "CLEAR_ERROR":
      return { ...state, error: null, errorMessage: "" };
    
    // Sync Status
    case "SET_SYNC_STATUS":
      return { ...state, syncStatus: action.payload };
    
    case "UPDATE_LAST_SYNC":
      return { ...state, lastSyncTime: action.payload };
    
    default:
      return state;
  }
}

function StateProvider({ children }) {
  const [state, dispatch] = React.useReducer(stateReducer, initialState);
  
  // Derived values
  const filteredLaunches = React.useMemo(() => {
    let result = state.launches;
    
    // Search filter - enhanced to include more fields
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      result = result.filter(l => 
        l.name.toLowerCase().includes(query) ||
        l.code.toLowerCase().includes(query) ||
        l.pillar.toLowerCase().includes(query) ||
        l.owner.pm.toLowerCase().includes(query) ||
        l.owner.pmm.toLowerCase().includes(query) ||
        l.owner.eng.toLowerCase().includes(query) ||
        l.target.toLowerCase().includes(query) ||
        (l.summary && l.summary.some(s => s.toLowerCase().includes(query))) ||
        (l.tickets && l.tickets.some(t => 
          t.title.toLowerCase().includes(query) ||
          t.id.toLowerCase().includes(query)
        )) ||
        (l.assets && l.assets.some(a => 
          a.title.toLowerCase().includes(query) ||
          a.source.toLowerCase().includes(query)
        ))
      );
    }
    
    // Pillar filter
    if (state.filterPillar !== "All") {
      result = result.filter(l => l.pillar === state.filterPillar);
    }
    
    // Risk filter
    if (state.filterRisk) {
      result = result.filter(l => l.risk === state.filterRisk);
    }
    
    // Environment filter
    if (state.filterEnv) {
      result = result.filter(l => l.env === state.filterEnv);
    }
    
    return result;
  }, [state.launches, state.searchQuery, state.filterPillar, state.filterRisk, state.filterEnv]);
  
  const openLaunch = React.useMemo(() => 
    state.launches.find(l => l.id === state.openLaunchId) || null,
    [state.launches, state.openLaunchId]
  );
  
  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // Command palette: Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch({ type: state.commandPaletteOpen ? "CLOSE_COMMAND_PALETTE" : "OPEN_COMMAND_PALETTE" });
      }
      
      // New Launch: Cmd+N or Ctrl+N
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        dispatch({ type: "OPEN_NEW_LAUNCH_MODAL" });
      }
      
      // Focus search: / (when not in input)
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        const searchInput = document.querySelector('.sp-search input');
        if (searchInput) searchInput.focus();
      }
      
      // Escape to close modals
      if (e.key === 'Escape') {
        if (state.commandPaletteOpen) {
          dispatch({ type: "CLOSE_COMMAND_PALETTE" });
        }
        if (state.newLaunchModalOpen) {
          dispatch({ type: "CLOSE_NEW_LAUNCH_MODAL" });
        }
        if (state.openLaunchId) {
          dispatch({ type: "CLOSE_LAUNCH" });
        }
      }
      
      // View switching: Cmd+1, Cmd+2, Cmd+3
      if ((e.metaKey || e.ctrlKey) && e.key === '1') {
        e.preventDefault();
        dispatch({ type: "SET_VIEW", payload: "list" });
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '2') {
        e.preventDefault();
        dispatch({ type: "SET_VIEW", payload: "board" });
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '3') {
        e.preventDefault();
        dispatch({ type: "SET_VIEW", payload: "timeline" });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.commandPaletteOpen, state.newLaunchModalOpen, state.openLaunchId]);

  // Real-time sync simulation
  React.useEffect(() => {
    const simulateSync = () => {
      dispatch({ type: "SET_SYNC_STATUS", payload: "syncing" });
      
      // Simulate random updates to launches
      setTimeout(() => {
        const randomLaunchIndex = Math.floor(Math.random() * state.launches.length);
        const launch = state.launches[randomLaunchIndex];
        
        // Randomly update readiness, risk, or environment
        const updateType = Math.random();
        let updates = {};
        
        if (updateType < 0.4) {
          // Update readiness
          const readinessChange = Math.floor(Math.random() * 10) - 3; // -3 to +6
          updates.readiness = Math.max(0, Math.min(100, launch.readiness + readinessChange));
          updates.delta = readinessChange;
        } else if (updateType < 0.7) {
          // Update risk
          const risks = ["green", "yellow", "red"];
          updates.risk = risks[Math.floor(Math.random() * risks.length)];
        } else {
          // Update environment
          const envs = ["Local", "Staging", "Canary", "Production"];
          updates.env = envs[Math.floor(Math.random() * envs.length)];
        }
        
        dispatch({ type: "UPDATE_LAUNCH", payload: { id: launch.id, updates } });
        dispatch({ type: "UPDATE_LAST_SYNC", payload: new Date() });
        dispatch({ type: "SET_SYNC_STATUS", payload: "connected" });
      }, 1000);
    };

    // Sync every 30 seconds
    const syncInterval = setInterval(simulateSync, 30000);
    
    // Initial sync after 5 seconds
    const initialSync = setTimeout(simulateSync, 5000);
    
    return () => {
      clearInterval(syncInterval);
      clearTimeout(initialSync);
    };
  }, [state.launches]);
  
  const value = {
    state,
    dispatch,
    filteredLaunches,
    openLaunch,
  };
  
  return (
    <StateContext.Provider value={value}>
      {children}
    </StateContext.Provider>
  );
}

function useStateContext() {
  const context = React.useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within StateProvider");
  }
  return context;
}

Object.assign(window, { StateProvider, useStateContext });