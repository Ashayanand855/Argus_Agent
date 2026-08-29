export interface PlanRecord {
  plan_id: string;
  timestamp: string;
  description: string;
  declared_tools: string[];
  user_email: string;
  coordinator: string;
}

export interface DelegationRecord {
  delegation_id: string;
  plan_id: string;
  agent_id: string;
  scope: string[];
  ttl_seconds: number;
  issued_by: string;
  issued_at: string;
  expires_at: string;
}

export interface InvocationRecord {
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

class AuditStore {
  private plans: PlanRecord[] = [];
  private delegations: DelegationRecord[] = [];
  private invocations: InvocationRecord[] = [];
  private nextInvocationId = 1;

  constructor() {
    this.seedDemoData();
  }

  public seedDemoData() {
    // Initial sample data so the dashboard is immediately informative
    if (this.plans.length === 0) {
      const now = new Date();
      const planId = 'plan-init9281';
      this.plans.push({
        plan_id: planId,
        timestamp: new Date(now.getTime() - 60000).toISOString(),
        description: 'Book me a flight to Delhi, clear my schedule on Thursday, and reorder headphones.',
        declared_tools: ['search_flights', 'book_flight', 'read_events', 'delete_event', 'search_items', 'add_to_cart'],
        user_email: 'judge@microsoft.com',
        coordinator: 'coordinator-root'
      });

      this.delegations.push({
        delegation_id: 'del-flt8492',
        plan_id: planId,
        agent_id: 'agent-flight-001',
        scope: ['search_flights', 'book_flight'],
        ttl_seconds: 300,
        issued_by: 'coordinator-root',
        issued_at: new Date(now.getTime() - 55000).toISOString(),
        expires_at: new Date(now.getTime() + 245000).toISOString()
      });

      this.delegations.push({
        delegation_id: 'del-cal3921',
        plan_id: planId,
        agent_id: 'agent-calendar-002',
        scope: ['read_events', 'delete_event'],
        ttl_seconds: 300,
        issued_by: 'coordinator-root',
        issued_at: new Date(now.getTime() - 54000).toISOString(),
        expires_at: new Date(now.getTime() + 246000).toISOString()
      });

      this.delegations.push({
        delegation_id: 'del-shp1029',
        plan_id: planId,
        agent_id: 'agent-shopping-003',
        scope: ['search_items', 'add_to_cart'],
        ttl_seconds: 10,
        issued_by: 'coordinator-root',
        issued_at: new Date(now.getTime() - 53000).toISOString(),
        expires_at: new Date(now.getTime() - 43000).toISOString()
      });

      this.invocations.push(
        {
          id: this.nextInvocationId++,
          timestamp: new Date(now.getTime() - 50000).toISOString(),
          agent_id: 'agent-flight-001',
          tool_name: 'search_flights',
          args: { origin: 'BOM', destination: 'DEL' },
          status: 'ALLOWED',
          reason: 'Scope and TTL valid',
          plan_id: planId,
          delegation_id: 'del-flt8492',
          scope: ['search_flights', 'book_flight'],
          ttl_remaining: 295.0
        },
        {
          id: this.nextInvocationId++,
          timestamp: new Date(now.getTime() - 48000).toISOString(),
          agent_id: 'agent-flight-001',
          tool_name: 'book_flight',
          args: { flight_id: 'AI302', passenger_name: 'Hackathon Judge' },
          status: 'ALLOWED',
          reason: 'Scope and TTL valid',
          plan_id: planId,
          delegation_id: 'del-flt8492',
          scope: ['search_flights', 'book_flight'],
          ttl_remaining: 293.0
        },
        {
          id: this.nextInvocationId++,
          timestamp: new Date(now.getTime() - 45000).toISOString(),
          agent_id: 'agent-calendar-002',
          tool_name: 'read_events',
          args: { day: 'Thursday' },
          status: 'ALLOWED',
          reason: 'Scope and TTL valid',
          plan_id: planId,
          delegation_id: 'del-cal3921',
          scope: ['read_events', 'delete_event'],
          ttl_remaining: 291.0
        },
        {
          id: this.nextInvocationId++,
          timestamp: new Date(now.getTime() - 43000).toISOString(),
          agent_id: 'agent-calendar-002',
          tool_name: 'delete_event',
          args: { event_id: 'evt-005' },
          status: 'ALLOWED',
          reason: 'Scope and TTL valid',
          plan_id: planId,
          delegation_id: 'del-cal3921',
          scope: ['read_events', 'delete_event'],
          ttl_remaining: 289.0
        },
        {
          id: this.nextInvocationId++,
          timestamp: new Date(now.getTime() - 40000).toISOString(),
          agent_id: 'agent-shopping-003',
          tool_name: 'search_items',
          args: { query: 'headphones' },
          status: 'ALLOWED',
          reason: 'Scope and TTL valid',
          plan_id: planId,
          delegation_id: 'del-shp1029',
          scope: ['search_items', 'add_to_cart'],
          ttl_remaining: 8.5
        },
        {
          id: this.nextInvocationId++,
          timestamp: new Date(now.getTime() - 38000).toISOString(),
          agent_id: 'agent-shopping-003',
          tool_name: 'add_to_cart',
          args: { item_id: 'itm-01', qty: 1 },
          status: 'ALLOWED',
          reason: 'Scope and TTL valid',
          plan_id: planId,
          delegation_id: 'del-shp1029',
          scope: ['search_items', 'add_to_cart'],
          ttl_remaining: 6.5
        },
        {
          id: this.nextInvocationId++,
          timestamp: new Date(now.getTime() - 36000).toISOString(),
          agent_id: 'agent-shopping-003',
          tool_name: 'checkout',
          args: { cart_id: 'cart-99' },
          status: 'BLOCKED',
          reason: "SCOPE VIOLATION — 'checkout' not in delegated scope ['search_items', 'add_to_cart']. Delegated by: coordinator-root",
          plan_id: planId,
          delegation_id: 'del-shp1029',
          scope: ['search_items', 'add_to_cart'],
          ttl_remaining: 4.5
        },
        {
          id: this.nextInvocationId++,
          timestamp: new Date(now.getTime() - 25000).toISOString(),
          agent_id: 'agent-shopping-003',
          tool_name: 'search_items',
          args: { query: 'cable' },
          status: 'EXPIRED',
          reason: 'Delegation token expired 6.5s ago — re-delegation required',
          plan_id: planId,
          delegation_id: 'del-shp1029',
          scope: ['search_items', 'add_to_cart'],
          ttl_remaining: -6.5
        }
      );
    }
  }

  public logPlan(planId: string, description: string, tools: string[], userEmail: string, coordinator: string) {
    const record: PlanRecord = {
      plan_id: planId,
      timestamp: new Date().toISOString(),
      description,
      declared_tools: tools,
      user_email: userEmail,
      coordinator
    };
    this.plans.unshift(record);
    return record;
  }

  public logDelegation(delegationId: string, planId: string, agentId: string, scope: string[], ttlSeconds: number, issuedBy: string) {
    const issuedAt = new Date();
    const expiresAt = new Date(issuedAt.getTime() + ttlSeconds * 1000);
    const record: DelegationRecord = {
      delegation_id: delegationId,
      plan_id: planId,
      agent_id: agentId,
      scope,
      ttl_seconds: ttlSeconds,
      issued_by: issuedBy,
      issued_at: issuedAt.toISOString(),
      expires_at: expiresAt.toISOString()
    };
    this.delegations.unshift(record);
    return record;
  }

  public logInvoke(
    agentId: string,
    toolName: string,
    args: Record<string, any>,
    status: 'ALLOWED' | 'BLOCKED' | 'EXPIRED' | 'ERROR',
    reason: string,
    planId: string | null = null,
    delegationId: string | null = null,
    scope: string[] = [],
    ttlRemaining: number = 0
  ) {
    const record: InvocationRecord = {
      id: this.nextInvocationId++,
      timestamp: new Date().toISOString(),
      agent_id: agentId,
      tool_name: toolName,
      args,
      status,
      reason,
      plan_id: planId,
      delegation_id: delegationId,
      scope,
      ttl_remaining: Math.round(ttlRemaining * 100) / 100
    };
    this.invocations.unshift(record);
    return record;
  }

  public getPlans() {
    return [...this.plans];
  }

  public getDelegations() {
    return [...this.delegations];
  }

  public getInvocations() {
    return [...this.invocations];
  }

  public getStats() {
    const total = this.invocations.length;
    const allowed = this.invocations.filter((i) => i.status === 'ALLOWED').length;
    const blocked = this.invocations.filter((i) => i.status === 'BLOCKED').length;
    const expired = this.invocations.filter((i) => i.status === 'EXPIRED').length;
    const error = this.invocations.filter((i) => i.status === 'ERROR').length;
    return { total, allowed, blocked, expired, error };
  }

  public clear() {
    this.plans = [];
    this.delegations = [];
    this.invocations = [];
    this.nextInvocationId = 1;
  }
}

export const auditLogger = new AuditStore();
