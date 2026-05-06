// Command Palette — ⌘K triggered quick actions and navigation

const CommandPalette = ({ isOpen, onClose }) => {
  const { state, dispatch, filteredLaunches } = useStateContext();
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef(null);
  const listRef = React.useRef(null);

  // Focus input when opened
  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset state when closed
  React.useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      const filteredItems = getFilteredItems();
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredItems.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredItems[selectedIndex]) {
            executeItem(filteredItems[selectedIndex]);
          }
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, query]);

  // Scroll selected item into view
  React.useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const items = listRef.current.querySelectorAll('.command-item');
      if (items[selectedIndex]) {
        items[selectedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const getFilteredItems = () => {
    const items = [];
    const q = query.toLowerCase();

    // Add launches
    filteredLaunches.forEach(launch => {
      if (!q || launch.name.toLowerCase().includes(q) || launch.code.toLowerCase().includes(q)) {
        items.push({
          type: 'launch',
          id: launch.id,
          title: launch.name,
          subtitle: launch.code,
          icon: 'rocket',
          action: () => {
            dispatch({ type: "SET_OPEN_LAUNCH", payload: launch.id });
            onClose();
          }
        });
      }
    });

    // Add commands
    const commands = [
      { title: 'Go to Dashboard', icon: 'home', action: () => { dispatch({ type: "SET_ACTIVE_NAV", payload: "home" }); onClose(); }},
      { title: 'View Timeline', icon: 'timeline', action: () => { dispatch({ type: "SET_ACTIVE_NAV", payload: "timeline" }); onClose(); }},
      { title: 'Clear Filters', icon: 'filter', action: () => { dispatch({ type: "CLEAR_FILTERS" }); onClose(); }},
      { title: 'New Launch', icon: 'plus', action: () => { dispatch({ type: "OPEN_NEW_LAUNCH_MODAL" }); onClose(); }},
    ];

    commands.forEach(cmd => {
      if (!q || cmd.title.toLowerCase().includes(q)) {
        items.push({
          type: 'command',
          title: cmd.title,
          icon: cmd.icon,
          action: cmd.action
        });
      }
    });

    return items;
  };

  const executeItem = (item) => {
    if (item.action) {
      item.action();
    }
  };

  const filteredItems = getFilteredItems();

  if (!isOpen) return null;

  return (
    <div className="command-palette-backdrop" onClick={onClose}>
      <div className="command-palette" onClick={e => e.stopPropagation()}>
        <div className="command-header">
          <Icon name="search" size={16} style={{ color: "var(--fg-3)" }}/>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search launches, commands…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="command-input"
          />
          <Kbd>ESC</Kbd>
        </div>
        
        <div ref={listRef} className="command-list">
          {filteredItems.length === 0 ? (
            <div className="command-empty">
              <Icon name="search" size={24} style={{ color: "var(--fg-3)" }}/>
              <div>No results found</div>
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <button
                key={`${item.type}-${item.id || index}`}
                className={`command-item ${index === selectedIndex ? 'is-selected' : ''}`}
                onClick={() => executeItem(item)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <Icon name={item.icon} size={16} style={{ color: "var(--fg-2)" }}/>
                <div className="command-item-content">
                  <div className="command-item-title">{item.title}</div>
                  {item.subtitle && (
                    <div className="command-item-subtitle">{item.subtitle}</div>
                  )}
                </div>
                {index === selectedIndex && <Icon name="chevron-right" size={14} style={{ color: "var(--fg-3)" }}/>}
              </button>
            ))
          )}
        </div>

        <div className="command-footer">
          <div className="command-footer-hint">
            <Kbd>↑↓</Kbd> to navigate
            <Kbd>↵</Kbd> to select
            <Kbd>ESC</Kbd> to close
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { CommandPalette });