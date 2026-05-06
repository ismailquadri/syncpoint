// Integration Services — Mock API patterns for external tool integrations
// This file demonstrates the structure for real integrations with Jira, Linear, Asana, etc.

// Mock Jira API Service
const JiraService = {
  // Configuration
  config: {
    baseUrl: "https://your-domain.atlassian.net",
    email: "syncpoint@yourcompany.com",
    apiToken: "your-api-token-here", // In production, this should be stored securely
    projectKey: "SYNC"
  },

  // Mock API methods
  async getTickets() {
    // In real implementation: 
    // const response = await fetch(`${this.config.baseUrl}/rest/api/3/search?jql=project=${this.config.projectKey}`, {
    //   headers: {
    //     'Authorization': `Basic ${btoa(`${this.config.email}:${this.config.apiToken}`)}`,
    //     'Accept': 'application/json'
    //   }
    // });
    // return response.json();
    
    // Mock response
    return [
      {
        id: "ENG-2241",
        title: "Region health probe — exponential backoff",
        status: "Done",
        environment: "Production",
        assignee: "Diego Alvarez",
        updated: "2026-05-06T14:30:00Z"
      },
      {
        id: "ENG-2244",
        title: "Failover state machine — write path",
        status: "Done",
        environment: "Canary",
        assignee: "Diego Alvarez",
        updated: "2026-05-06T12:15:00Z"
      },
      {
        id: "ENG-2247",
        title: "Audit log — failover event type",
        status: "In Review",
        environment: "Staging",
        assignee: "Sam Okafor",
        updated: "2026-05-06T10:45:00Z"
      }
    ];
  },

  async getTicket(ticketId) {
    // In real implementation, fetch specific ticket details
    return this.getTickets().then(tickets => 
      tickets.find(t => t.id === ticketId)
    );
  },

  async createTicket(ticketData) {
    // In real implementation: POST to Jira API
    console.log("Creating Jira ticket:", ticketData);
    return { id: "ENG-2299", ...ticketData };
  },

  async updateTicketStatus(ticketId, newStatus) {
    // In real implementation: PUT to Jira API
    console.log(`Updating ticket ${ticketId} to ${newStatus}`);
    return { success: true };
  }
};

// Mock Linear API Service
const LinearService = {
  config: {
    apiKey: "your-linear-api-key",
    teamId: "SYNC"
  },

  async getIssues() {
    // Mock response
    return [
      {
        id: "LIN-123",
        title: "Implement user authentication flow",
        status: "In Progress",
        priority: "High",
        assignee: "Yuki Tanaka",
        labels: ["feature", "security"]
      },
      {
        id: "LIN-124",
        title: "Add rate limiting to API endpoints",
        status: "Todo",
        priority: "Medium",
        assignee: null,
        labels: ["performance", "api"]
      }
    ];
  },

  async syncWithLaunch(launchId) {
    // Sync Linear issues with a specific launch
    console.log(`Syncing Linear issues for launch ${launchId}`);
    return { synced: 2, launchId };
  }
};

// Mock Asana API Service
const AsanaService = {
  config: {
    accessToken: "your-asana-access-token",
    workspaceId: "123456789",
    projectId: "987654321"
  },

  async getTasks() {
    // Mock response
    return [
      {
        id: "ASANA-1",
        name: "Create launch announcement email",
        status: "In Progress",
        assignee: "Marcus Lee",
        dueDate: "2026-05-10"
      },
      {
        id: "ASANA-2",
        name: "Update pricing page",
        status: "Todo",
        assignee: "Ana Park",
        dueDate: "2026-05-12"
      }
    ];
  },

  async createTask(taskData) {
    console.log("Creating Asana task:", taskData);
    return { id: "ASANA-3", ...taskData };
  }
};

// Unified Integration Manager
const IntegrationManager = {
  services: {
    jira: JiraService,
    linear: LinearService,
    asana: AsanaService
  },

  async syncAll() {
    const results = {};
    
    try {
      results.jira = await this.services.jira.getTickets();
      results.linear = await this.services.linear.getIssues();
      results.asana = await this.services.asana.getTasks();
      
      return {
        success: true,
        data: results,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  async syncService(serviceName) {
    const service = this.services[serviceName];
    if (!service) {
      throw new Error(`Unknown service: ${serviceName}`);
    }

    try {
      const data = await service.getTasks ? service.getTasks() : service.getIssues();
      return {
        success: true,
        service: serviceName,
        data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        service: serviceName,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // Map external tool statuses to internal states
  mapStatus(tool, externalStatus) {
    const statusMaps = {
      jira: {
        "Done": "Done",
        "In Review": "In review",
        "In Progress": "In progress",
        "To Do": "To do"
      },
      linear: {
        "Done": "Done",
        "In Progress": "In progress",
        "Todo": "To do",
        "Backlog": "To do"
      },
      asana: {
        "Complete": "Done",
        "In Progress": "In progress",
        "Todo": "To do"
      }
    };

    return statusMaps[tool]?.[externalStatus] || externalStatus;
  }
};

// Hook for using integrations in React components
const useIntegrations = () => {
  const [syncStatus, setSyncStatus] = React.useState("idle");
  const [lastSync, setLastSync] = React.useState(null);
  const [error, setError] = React.useState(null);

  const syncAll = React.useCallback(async () => {
    setSyncStatus("syncing");
    setError(null);
    
    try {
      const result = await IntegrationManager.syncAll();
      if (result.success) {
        setSyncStatus("connected");
        setLastSync(result.timestamp);
      } else {
        setSyncStatus("error");
        setError(result.error);
      }
      return result;
    } catch (err) {
      setSyncStatus("error");
      setError(err.message);
      throw err;
    }
  }, []);

  const syncService = React.useCallback(async (serviceName) => {
    setSyncStatus("syncing");
    setError(null);
    
    try {
      const result = await IntegrationManager.syncService(serviceName);
      if (result.success) {
        setSyncStatus("connected");
        setLastSync(result.timestamp);
      } else {
        setSyncStatus("error");
        setError(result.error);
      }
      return result;
    } catch (err) {
      setSyncStatus("error");
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    syncStatus,
    lastSync,
    error,
    syncAll,
    syncService,
    IntegrationManager
  };
};

Object.assign(window, { 
  JiraService, 
  LinearService, 
  AsanaService, 
  IntegrationManager, 
  useIntegrations 
});