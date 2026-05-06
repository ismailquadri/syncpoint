// New Launch Modal — form for creating new launches

const NewLaunchModal = ({ isOpen, onClose }) => {
  const { dispatch } = useStateContext();
  const [formData, setFormData] = React.useState({
    name: "",
    code: "",
    pillar: "Growth",
    target: "",
    owner: { pm: "", pmm: "", eng: "" },
    description: ""
  });
  const [errors, setErrors] = React.useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleOwnerChange = (role, value) => {
    setFormData(prev => ({
      ...prev,
      owner: { ...prev.owner, [role]: value }
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.code.trim()) newErrors.code = "Code is required";
    if (!formData.target.trim()) newErrors.target = "Target date is required";
    if (!formData.owner.pm.trim()) newErrors.pm = "PM is required";
    if (!formData.owner.pmm.trim()) newErrors.pmm = "PMM is required";
    if (!formData.owner.eng.trim()) newErrors.eng = "Engineer is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Generate a unique ID
    const id = `lnch-${formData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    
    // Calculate days to ship
    const targetDate = new Date(formData.target);
    const today = new Date();
    const daysToShip = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));

    const newLaunch = {
      id,
      code: formData.code,
      name: formData.name,
      pillar: formData.pillar,
      owner: formData.owner,
      target: formData.target,
      daysToShip: Math.max(0, daysToShip),
      risk: "green",
      readiness: 0,
      eng: 0,
      gtm: 0,
      env: "Local",
      freeze: "",
      pinned: false,
      delta: 0,
      blockers: 0,
      summary: [],
      assets: [],
      tickets: [],
      deps: [],
      activity: [
        {
          t: "Just now",
          who: "You",
          what: `created launch ${formData.name}`
        }
      ]
    };

    dispatch({ type: "ADD_LAUNCH", payload: newLaunch });
    onClose();
    setFormData({
      name: "",
      code: "",
      pillar: "Growth",
      target: "",
      owner: { pm: "", pmm: "", eng: "" },
      description: ""
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Launch</h2>
          <button className="modal-close" onClick={onClose}>
            <Icon name="x" size={16}/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label className="form-label">Launch Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Atlas — Multi-region failover"
              value={formData.name}
              onChange={e => handleChange("name", e.target.value)}
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Code *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., L-204"
                value={formData.code}
                onChange={e => handleChange("code", e.target.value)}
              />
              {errors.code && <div className="form-error">{errors.code}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Pillar</label>
              <select
                className="form-input"
                value={formData.pillar}
                onChange={e => handleChange("pillar", e.target.value)}
              >
                {window.SP_DATA.PILLARS.filter(p => p !== "All").map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Target Date *</label>
            <input
              type="date"
              className="form-input"
              value={formData.target}
              onChange={e => handleChange("target", e.target.value)}
            />
            {errors.target && <div className="form-error">{errors.target}</div>}
          </div>

          <div className="form-section-title">Owners</div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">PM *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Product Manager"
                value={formData.owner.pm}
                onChange={e => handleOwnerChange("pm", e.target.value)}
              />
              {errors.pm && <div className="form-error">{errors.pm}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">PMM *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Product Marketer"
                value={formData.owner.pmm}
                onChange={e => handleOwnerChange("pmm", e.target.value)}
              />
              {errors.pmm && <div className="form-error">{errors.pmm}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Engineer *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Lead Engineer"
                value={formData.owner.eng}
                onChange={e => handleOwnerChange("eng", e.target.value)}
              />
              {errors.eng && <div className="form-error">{errors.eng}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Brief description of the launch..."
              rows={3}
              value={formData.description}
              onChange={e => handleChange("description", e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="sp-btn sp-btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="sp-btn sp-btn-primary">
              <Icon name="plus" size={13}/> Create Launch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

Object.assign(window, { NewLaunchModal });