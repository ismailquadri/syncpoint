// AI Service — Mock LLM integration for the Bridge feature
// This demonstrates how to integrate with real AI APIs (OpenAI, Anthropic, etc.)

const AIService = {
  // Configuration for different AI providers
  config: {
    provider: "openai", // Options: openai, anthropic, custom
    apiKey: "your-api-key-here", // In production, store securely
    model: "gpt-4", // or claude-3-opus-20240229, etc.
    maxTokens: 500,
    temperature: 0.7
  },

  // Mock AI response generation
  async summarizePRD(prdContent, options = {}) {
    // In real implementation:
    // const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${this.config.apiKey}`
    //   },
    //   body: JSON.stringify({
    //     model: this.config.model,
    //     messages: [
    //       {
    //         role: 'system',
    //         content: 'You are a product marketing specialist. Summarize technical PRDs into 3-5 bullet points highlighting user value.'
    //       },
    //       {
    //         role: 'user',
    //         content: prdContent
    //       }
    //     ],
    //     max_tokens: this.config.maxTokens,
    //     temperature: this.config.temperature
    //   })
    // });
    // const data = await response.json();
    // return data.choices[0].message.content;

    // Mock response with realistic delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return [
      "Customers can configure automatic failover between US-East and EU-West with sub-90s RTO.",
      "Removes the manual escalation step that the support team currently runs during outages.",
      "Enterprise tier only — surfaces a new 'Failover' tab inside the Reliability dashboard.",
      "Pricing page gets a new comparison row; sales decks need an updated SLA slide.",
      "No public API changes; SDKs unaffected this release."
    ];
  },

  async generateAssetSuggestions(codeChanges, context = {}) {
    // In real implementation, analyze code changes and suggest screenshots/videos
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      {
        type: "Screenshot",
        title: "Failover dashboard — empty state",
        source: "src/reliability/Failover.tsx",
        priority: "high"
      },
      {
        type: "Screenshot", 
        title: "Region switcher — active",
        source: "src/reliability/RegionPicker.tsx",
        priority: "high"
      },
      {
        type: "Loom",
        title: "End-to-end failover walkthrough (90s)",
        source: "src/reliability/*",
        priority: "medium"
      },
      {
        type: "Screenshot",
        title: "Audit log — failover event row",
        source: "src/audit/EventRow.tsx",
        priority: "medium"
      },
      {
        type: "Hero image",
        title: "Marketing hero — globe with two pins",
        source: "design",
        priority: "low"
      }
    ];
  },

  async generateMarketingCopy(summary, tone = "enterprise") {
    // Generate different variations of marketing copy
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const toneGuides = {
      enterprise: "Professional, feature-focused, suitable for B2B",
      casual: "Friendly, approachable, suitable for social media",
      technical: "Detailed, implementation-focused, suitable for developers"
    };

    return {
      headline: "Enterprise-Grade Multi-Region Failover, Now Automated",
      subheading: "Reduce downtime from hours to seconds with intelligent failover between US-East and EU-West regions.",
      body: [
        "Our new automated failover system ensures your critical services stay online, even during regional outages.",
        "Configure once, and let our intelligent health probes handle the rest—no manual intervention required.",
        "Designed for enterprise workloads with comprehensive audit trails and SLA guarantees."
      ],
      cta: "Request Early Access",
      tone: tone,
      toneGuide: toneGuides[tone]
    };
  },

  async analyzeConflicts(launchData) {
    // AI-powered conflict detection between engineering and GTM timelines
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const conflicts = [];
    
    // Check for common conflict patterns
    launchData.deps?.forEach(dep => {
      if (dep.hard && dep.status !== "done") {
        const daysToShip = launchData.daysToShip;
        if (daysToShip < 7 && dep.status === "todo") {
          conflicts.push({
            type: "timeline",
            severity: "high",
            message: `${dep.label} is not started but launch is in ${daysToShip} days`,
            suggestion: "Consider delaying launch or prioritizing this dependency"
          });
        }
      }
    });

    return {
      hasConflicts: conflicts.length > 0,
      conflicts,
      confidence: 0.85 // AI confidence score
    };
  }
};

// React hook for using AI services
const useAIService = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const summarizePRD = React.useCallback(async (prdContent, options) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await AIService.summarizePRD(prdContent, options);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const generateAssetSuggestions = React.useCallback(async (codeChanges, context) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await AIService.generateAssetSuggestions(codeChanges, context);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const generateMarketingCopy = React.useCallback(async (summary, tone) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await AIService.generateMarketingCopy(summary, tone);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const analyzeConflicts = React.useCallback(async (launchData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await AIService.analyzeConflicts(launchData);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  return {
    isLoading,
    error,
    summarizePRD,
    generateAssetSuggestions,
    generateMarketingCopy,
    analyzeConflicts,
    AIService
  };
};

// Enhanced AIBridge component that uses real AI service
const AIBridgeWithAI = ({ launch }) => {
  const { dispatch } = useStateContext();
  const { summarizePRD, isLoading, error } = useAIService();
  const [phase, setPhase] = React.useState("idle");
  const [summary, setSummary] = React.useState(null);
  const [approved, setApproved] = React.useState(false);

  const handleGenerate = async () => {
    setPhase("streaming");
    setSummary(null);
    setApproved(false);
    
    try {
      // In real implementation, you'd fetch the actual PRD content
      const mockPRDContent = `
        PRD-204: Multi-region failover
        This feature enables automatic failover between US-East and EU-West regions.
        Key capabilities:
        - Health probe with exponential backoff
        - Automatic state machine for failover logic
        - Audit logging for compliance
        - Enterprise tier only
        - No API changes required
      `;
      
      const result = await summarizePRD(mockPRDContent);
      setSummary(result);
      setPhase("done");
      
      // Add to launch data
      dispatch({
        type: "UPDATE_LAUNCH",
        payload: {
          id: launch.id,
          updates: { summary: result }
        }
      });
      
      // Add activity log
      dispatch({
        type: "ADD_ACTIVITY",
        payload: {
          launchId: launch.id,
          activity: {
            t: "Just now",
            who: "AI Bridge",
            what: "generated marketing summary from PRD-204"
          }
        }
      });
    } catch (err) {
      setPhase("error");
      console.error("AI generation failed:", err);
    }
  };

  const handleApprove = () => {
    setApproved(true);
    dispatch({
      type: "ADD_ACTIVITY",
      payload: {
        launchId: launch.id,
        activity: {
          t: "Just now",
          who: "Marcus L.",
          what: "approved AI-generated summary"
        }
      }
    });
  };

  return (
    <Section
      kicker="The Bridge"
      title="AI Knowledge Extraction"
      action={
        <div className="bridge-actions">
          {phase === "idle" && (
            <button className="sp-btn sp-btn-primary" onClick={handleGenerate} disabled={isLoading}>
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
              <button className="sp-btn sp-btn-ghost" onClick={handleGenerate}>
                <Icon name="sparkle" size={12}/>Regenerate
              </button>
              <button className="sp-btn sp-btn-primary" onClick={handleApprove}>
                <Icon name="check" size={13}/> Approve as copy
              </button>
            </>
          )}
          {approved && <Pill tone="ok" icon="check">Approved by Marcus L.</Pill>}
        </div>
      }
    >
      <div className="bridge">
        <div className="bridge-source">
          <Icon name="doc" size={13}/>
          <span><b>Source:</b> PRD-204 · v1.4 · last edited by Priya S. 2d ago</span>
          <a href="#" className="bridge-source-link">Open<Icon name="external" size={11}/></a>
        </div>

        <div className={`bridge-out ${phase === "idle" ? "is-empty" : ""} ${approved ? "is-approved" : ""}`}>
          <div className="bridge-out-head">
            <div className="bridge-out-title">
              {approved ? "Approved copy — User value" : "Draft — User value"}
            </div>
            <Pill tone={approved ? "ok" : "warn"}>
              {approved ? "Approved" : "Draft · awaiting review"}
            </Pill>
          </div>

          {phase === "idle" ? (
            <div className="bridge-empty">
              <Icon name="sparkle" size={18}/>
              <div>
                <div className="bridge-empty-title">No summary yet</div>
                <div className="bridge-empty-sub">The Bridge will turn PRD-204 into 3–5 marketing-ready bullets. You stay in control — drafts are never auto-published.</div>
              </div>
            </div>
          ) : phase === "error" ? (
            <div className="bridge-error">
              <Icon name="alert" size={18}/>
              <div>
                <div className="bridge-error-title">Generation failed</div>
                <div className="bridge-error-sub">{error || "Unable to connect to AI service. Please try again."}</div>
              </div>
            </div>
          ) : (
            <ul className="bridge-bullets">
              {(summary || launch.summary || []).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          )}
        </div>

        {phase === "done" && (
          <div className="bridge-meta">
            <span><Icon name="git-merge" size={12}/> Inferred from <b>4 commits</b> on <b>main</b></span>
            <span><Icon name="dot" size={9}/> Tone: <b>Plain · enterprise</b></span>
            <span><Icon name="dot" size={9}/> Reading level: <b>Grade 9</b></span>
          </div>
        )}
      </div>
    </Section>
  );
};

Object.assign(window, { AIService, useAIService, AIBridgeWithAI });