export interface Plan {
  plan_id: string;
  timestamp: string;
  description: string;
  declared_tools: string[];
  user_email: string;
  coordinator: string;
}

export interface Delegation {
  delegation_id: string;
  plan_id: string;
  agent_id: string;
  scope: string[];
  ttl_seconds: number;
  issued_by: string;
  issued_at: string;
  expires_at: string;
}

export interface Invocation {
  id: number;
  timestamp: string;
  agent_id: string;
  tool_name: string;
  args: Record<string, any>;
  status: 'ALLOWED' | 'BLOCKED' | 'EXPIRED' | 'ERROR';
  reason: string;
  plan_id?: string | null;
  delegation_id?: string | null;
  scope: string[];
  ttl_remaining: number;
}

export interface AuditStats {
  total: number;
  allowed: number;
  blocked: number;
  expired: number;
  error?: number;
}

export interface AgentConfig {
  scope: string[];
  ttl: number;
  args: Record<string, any>;
}

export interface CustomScenarioConfig {
  user_intent: string;
  user_email: string;
  available_tools: string[];
  agents: {
    flight: AgentConfig;
    calendar: AgentConfig;
    shopping: AgentConfig;
  };
  security_tests: {
    scope_violation: boolean;
    token_expiry: boolean;
    unauthorized_tools: boolean;
    simulate_attacks: boolean;
  };
}

export interface ExecutionLogEntry {
  type: 'info' | 'success' | 'warn' | 'error' | 'header' | 'sub';
  text: string;
  timestamp?: string;
}

export interface RunResult {
  success: boolean;
  logs: ExecutionLogEntry[];
  rawOutput: string;
  stats: AuditStats;
}
