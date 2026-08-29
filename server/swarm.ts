import { ArmorIQClient, ArmorIQPermissionError } from './armoriq.js';
import { executeMcpTool } from './mcp.js';
import { auditLogger } from './audit.js';

export interface LogItem {
  type: 'info' | 'success' | 'warn' | 'error' | 'header' | 'sub';
  text: string;
  timestamp: string;
}

export async function runSwarmDemo(userPrompt?: string, shoppingTtlSeconds: number = 10) {
  const prompt = userPrompt || 'Book me a flight to Delhi, clear my schedule on Thursday, and reorder headphones.';
  const logs: LogItem[] = [];

  const addLog = (type: LogItem['type'], text: string) => {
    logs.push({ type, text, timestamp: new Date().toLocaleTimeString() });
  };

  addLog('header', '=========================================================');
  addLog('header', 'AUTHORCHAIN COORDINATOR (ARMORIQ MULTI-AGENT SWARM)');
  addLog('header', '=========================================================');
  addLog('info', `USER INTENT: "${prompt}"`);
  addLog('info', '[Coordinator] Parsing intent into sub-tasks (Mock LLM)...');

  const coordinator = new ArmorIQClient('coordinator-root');

  // 1. Capture Plan
  const planId = coordinator.capturePlan(
    prompt,
    ['search_flights', 'book_flight', 'read_events', 'delete_event', 'search_items', 'add_to_cart'],
    'judge@microsoft.com'
  );

  addLog('info', `[ArmorIQ] Plan Captured: ${planId}`);
  addLog('info', `[ArmorIQ] Declared Tools: ["search_flights", "book_flight", "read_events", "delete_event", "search_items", "add_to_cart"]`);

  // 2. Delegate tokens
  const flightToken = coordinator.delegate(
    planId,
    'agent-flight-001',
    ['search_flights', 'book_flight'],
    300
  );
  addLog('success', `[Coordinator] Delegated Flight Token (TTL: 300s, Scope: ["search_flights", "book_flight"])`);

  const calendarToken = coordinator.delegate(
    planId,
    'agent-calendar-002',
    ['read_events', 'delete_event'],
    300
  );
  addLog('success', `[Coordinator] Delegated Calendar Token (TTL: 300s, Scope: ["read_events", "delete_event"])`);

  const shoppingToken = coordinator.delegate(
    planId,
    'agent-shopping-003',
    ['search_items', 'add_to_cart'],
    shoppingTtlSeconds
  );
  addLog('success', `[Coordinator] Delegated Shopping Token (TTL: ${shoppingTtlSeconds}s, Scope: ["search_items", "add_to_cart"])`);

  // 3. Run Sub-Agents
  // ── Agent 1: Flight Agent ──
  addLog('header', '================ Running agents/flight_agent ================');
  const flightAgent = new ArmorIQClient('agent-flight-001');
  try {
    addLog('info', '[Flight Agent] Booting up...');
    addLog('info', '[Flight Agent] Executing invoke(search_flights, origin="BOM", destination="DEL")...');
    const searchRes = flightAgent.invoke(
      flightToken,
      'search_flights',
      { origin: 'BOM', destination: 'DEL' },
      executeMcpTool
    );
    const flightId = searchRes.flights?.[0]?.id || 'AI302';
    addLog('success', `[Flight Agent] Found ${searchRes.flights?.length || 4} flights. Best flight: ${flightId} (${searchRes.flights?.[0]?.airline} - ₹${searchRes.flights?.[0]?.price})`);

    addLog('info', `[Flight Agent] Executing invoke(book_flight, flight_id="${flightId}", passenger="Hackathon Judge")...`);
    const bookRes = flightAgent.invoke(
      flightToken,
      'book_flight',
      { flight_id: flightId, passenger_name: 'Hackathon Judge' },
      executeMcpTool
    );
    addLog('success', `[Flight Agent] Flight booked! Status: ${bookRes.status}, PNR: ${bookRes.booking_ref}, Seat: ${bookRes.seat}`);
  } catch (err: any) {
    addLog('error', `[Flight Agent] Error: ${err.message}`);
  }

  // ── Agent 2: Calendar Agent ──
  addLog('header', '================ Running agents/calendar_agent ================');
  const calendarAgent = new ArmorIQClient('agent-calendar-002');
  try {
    addLog('info', '[Calendar Agent] Booting up...');
    addLog('info', '[Calendar Agent] Executing invoke(read_events, day="Thursday")...');
    const calRes = calendarAgent.invoke(
      calendarToken,
      'read_events',
      { day: 'Thursday' },
      executeMcpTool
    );
    addLog('success', `[Calendar Agent] Found ${calRes.count || calRes.events?.length} events on Thursday: ${calRes.events?.map((e: any) => e.title).join(', ')}`);

    const conflictEvent = calRes.events?.find((e: any) => e.title.includes('Flight') || e.title.includes('CONFLICT')) || calRes.events?.[1] || { id: 'evt-005' };
    addLog('info', `[Calendar Agent] Executing invoke(delete_event, event_id="${conflictEvent.id}")...`);
    const delRes = calendarAgent.invoke(
      calendarToken,
      'delete_event',
      { event_id: conflictEvent.id },
      executeMcpTool
    );
    addLog('success', `[Calendar Agent] Conflict removed! ${delRes.message}`);
  } catch (err: any) {
    addLog('error', `[Calendar Agent] Error: ${err.message}`);
  }

  // ── Agent 3: Shopping Agent ──
  addLog('header', '================ Running agents/shopping_agent ================');
  const shoppingAgent = new ArmorIQClient('agent-shopping-003');
  try {
    addLog('info', '[Shopping Agent] Booting up...');
    addLog('info', '[Shopping Agent] Executing invoke(search_items, query="headphones")...');
    const itemRes = shoppingAgent.invoke(
      shoppingToken,
      'search_items',
      { query: 'headphones' },
      executeMcpTool
    );
    const item = itemRes.results?.[0] || { id: 'itm-01', name: 'Sony WH-1000XM5 Headphones' };
    addLog('success', `[Shopping Agent] Found: ${item.name} ($${item.price})`);

    addLog('info', `[Shopping Agent] Executing invoke(add_to_cart, item_id="${item.id}", qty=1)...`);
    const cartRes = shoppingAgent.invoke(
      shoppingToken,
      'add_to_cart',
      { item_id: item.id, qty: 1 },
      executeMcpTool
    );
    addLog('success', `[Shopping Agent] Added to cart! Cart total: $${cartRes.cart?.total}`);

    // Scope Violation Attempt
    addLog('warn', '[Shopping Agent] Attempting unauthorized operation: invoke(checkout)... (EXPECTED TO FAIL)');
    try {
      shoppingAgent.invoke(
        shoppingToken,
        'checkout',
        { cart_id: 'cart-99' },
        executeMcpTool
      );
      addLog('error', '[Shopping Agent] Security failure: checkout succeeded!');
    } catch (pe: any) {
      addLog('error', `[ArmorIQ Security] 🚨 BLOCKED: ${pe.message}`);
      addLog('success', '[Shopping Agent] Checkout was blocked as expected by ArmorIQ Zero-Trust Scope Enforcement.');
    }

    // Token Expiry Demonstration
    addLog('warn', `[Shopping Agent] Simulating fast token expiration (${shoppingTtlSeconds}s TTL)...`);
    addLog('info', `[Shopping Agent] Attempting another invoke(search_items, query="cable") after simulated expiration...`);

    // We can simulate an expired token or immediate check with expired token
    const expiredPayload = {
      delegation_id: 'del-expired-demo',
      plan_id: planId,
      agent_id: 'agent-shopping-003',
      issued_by: 'coordinator-root',
      scope: ['search_items', 'add_to_cart'],
      iat: Math.floor(Date.now() / 1000) - (shoppingTtlSeconds + 5),
      exp: Math.floor(Date.now() / 1000) - 2 // expired 2 seconds ago
    };
    const crypto = await import('crypto');
    const secret = process.env.ARMORIQ_SHARED_SECRET || 'argus-demo-secret-2026';
    const payloadB64 = Buffer.from(JSON.stringify(expiredPayload)).toString('base64url');
    const sig = crypto.createHmac('sha256', secret).update(payloadB64).digest('hex');
    const expiredToken = `${payloadB64}.${sig}`;

    try {
      shoppingAgent.invoke(
        expiredToken,
        'search_items',
        { query: 'cable' },
        executeMcpTool
      );
      addLog('error', '[Shopping Agent] Expiry check failed: expired token was accepted!');
    } catch (pe: any) {
      addLog('warn', `[ArmorIQ Security] ⏰ EXPIRED: ${pe.message}`);
      addLog('success', '[Shopping Agent] Token expired as expected and rejected by ArmorIQ TTL validation.');
    }
  } catch (err: any) {
    addLog('error', `[Shopping Agent] Error: ${err.message}`);
  }

  addLog('header', '=========================================================');
  addLog('header', 'Demo Complete. All decisions recorded in Audit Log.');
  addLog('header', '=========================================================');

  return {
    success: true,
    logs,
    rawOutput: logs.map((l) => `[${l.timestamp}] ${l.text}`).join('\n'),
    stats: auditLogger.getStats()
  };
}

export async function runCustomScenario(config: any) {
  const logs: LogItem[] = [];
  const addLog = (type: LogItem['type'], text: string) => {
    logs.push({ type, text, timestamp: new Date().toLocaleTimeString() });
  };

  addLog('header', '=========================================================');
  addLog('header', 'ARGUS CUSTOM AGENT CONTROL SYSTEM');
  addLog('header', '=========================================================');
  addLog('info', `USER INTENT: "${config.user_intent}"`);
  addLog('info', `USER EMAIL: ${config.user_email}`);
  addLog('info', `AVAILABLE TOOLS: ${config.available_tools?.join(', ')}`);
  addLog('header', '=========================================================');

  const coordinator = new ArmorIQClient('coordinator-gui');

  const planId = coordinator.capturePlan(
    config.user_intent || 'Custom Intent',
    config.available_tools || [],
    config.user_email || 'demo@company.com'
  );
  addLog('info', `[Coordinator] Captured Plan: ${planId}`);

  const tokens: Record<string, string> = {};
  const agents = config.agents || {};

  for (const [agentName, agentConfig] of Object.entries<any>(agents)) {
    if (agentConfig.scope && agentConfig.scope.length > 0) {
      const agentId = `agent-${agentName}-gui`;
      tokens[agentName] = coordinator.delegate(
        planId,
        agentId,
        agentConfig.scope,
        agentConfig.ttl || 300
      );
      addLog('success', `Created token for ${agentName.toUpperCase()} agent: [${agentConfig.scope.join(', ')}] (TTL: ${agentConfig.ttl || 300}s)`);
    }
  }

  // Execute agents
  for (const [agentName, agentConfig] of Object.entries<any>(agents)) {
    const token = tokens[agentName];
    if (!token || !agentConfig.scope || agentConfig.scope.length === 0) continue;

    addLog('header', `\n================ Executing ${agentName.toUpperCase()} Agent ================`);
    const agentClient = new ArmorIQClient(`agent-${agentName}-gui`);

    for (const tool of agentConfig.scope) {
      try {
        addLog('info', `[${agentName.toUpperCase()} Agent] Attempting invoke("${tool}")...`);
        const result = agentClient.invoke(
          token,
          tool,
          agentConfig.args || {},
          executeMcpTool
        );
        addLog('success', `[${agentName.toUpperCase()} Agent] ${tool} succeeded: ${JSON.stringify(result)}`);
      } catch (err: any) {
        addLog('error', `[${agentName.toUpperCase()} Agent] ${tool} failed: ${err.message}`);
      }
    }

    // Security test: Scope violation on shopping agent
    if (config.security_tests?.scope_violation && agentName === 'shopping') {
      addLog('warn', `[Shopping Agent] 🚨 SECURITY TEST: Attempting unauthorized 'checkout'...`);
      try {
        agentClient.invoke(
          token,
          'checkout',
          { cart_id: 'test-cart' },
          executeMcpTool
        );
        addLog('error', `[Shopping Agent] Security test FAILED — unauthorized checkout succeeded!`);
      } catch (err: any) {
        addLog('success', `[Shopping Agent] Security test PASSED — unauthorized checkout blocked by ArmorIQ: ${err.message}`);
      }
    }

    // Security test: Token expiry
    if (config.security_tests?.token_expiry && agentName === 'shopping') {
      addLog('warn', `[Shopping Agent] ⏰ SECURITY TEST: Testing expired token rejection...`);
      const crypto = await import('crypto');
      const secret = process.env.ARMORIQ_SHARED_SECRET || 'argus-demo-secret-2026';
      const expiredPayload = {
        delegation_id: 'del-custom-exp',
        plan_id: planId,
        agent_id: `agent-shopping-gui`,
        issued_by: 'coordinator-gui',
        scope: agentConfig.scope,
        iat: Math.floor(Date.now() / 1000) - 100,
        exp: Math.floor(Date.now() / 1000) - 10
      };
      const payloadB64 = Buffer.from(JSON.stringify(expiredPayload)).toString('base64url');
      const sig = crypto.createHmac('sha256', secret).update(payloadB64).digest('hex');
      const expiredToken = `${payloadB64}.${sig}`;

      try {
        agentClient.invoke(
          expiredToken,
          agentConfig.scope[0] || 'search_items',
          {},
          executeMcpTool
        );
        addLog('error', `[Shopping Agent] Expiry test FAILED — expired token was accepted!`);
      } catch (err: any) {
        addLog('success', `[Shopping Agent] Expiry test PASSED — expired token rejected by ArmorIQ: ${err.message}`);
      }
    }
  }

  addLog('header', '=========================================================');
  addLog('header', 'CUSTOM SCENARIO EXECUTION COMPLETE');
  addLog('header', '=========================================================');

  return {
    success: true,
    logs,
    rawOutput: logs.map((l) => `[${l.timestamp}] ${l.text}`).join('\n'),
    stats: auditLogger.getStats()
  };
}

export async function runAttackSimulation(attackType: string) {
  const logs: LogItem[] = [];
  const addLog = (type: LogItem['type'], text: string) => {
    logs.push({ type, text, timestamp: new Date().toLocaleTimeString() });
  };

  const simClient = new ArmorIQClient('attacker-subagent');
  let resultStatus: 'BLOCKED' | 'EXPIRED' | 'SUCCESS_ATTACK' = 'BLOCKED';
  let message = '';

  if (attackType.includes('Scope Violation') || attackType === 'scope_violation') {
    addLog('header', '⚡ Simulating Attack: Scope Violation (Rogue Tool Call)');
    const planId = simClient.capturePlan('Shopping intent', ['search_items', 'add_to_cart']);
    const token = simClient.delegate(planId, 'attacker-subagent', ['search_items'], 300);

    addLog('info', 'Simulating unauthorized tool call: "checkout" (authorized scope: ["search_items"])...');
    try {
      simClient.invoke(token, 'checkout', { cart_id: 'c1' }, executeMcpTool);
      resultStatus = 'SUCCESS_ATTACK';
      message = 'Attack Succeeded (FAILED Security Check!)';
      addLog('error', message);
    } catch (pe: any) {
      resultStatus = 'BLOCKED';
      message = `ATTACK BLOCKED BY ARMORIQ! ${pe.message}`;
      addLog('success', message);
    }
  } else if (attackType.includes('Token Expiry') || attackType === 'token_expiry') {
    addLog('header', '⚡ Simulating Attack: Token Expiry Attempt');
    const planId = simClient.capturePlan('Short plan', ['search_items']);
    
    // Create an already-expired token
    const crypto = await import('crypto');
    const secret = process.env.ARMORIQ_SHARED_SECRET || 'argus-demo-secret-2026';
    const expiredPayload = {
      delegation_id: 'del-atk-exp',
      plan_id: planId,
      agent_id: 'attacker-subagent',
      issued_by: 'attacker-subagent',
      scope: ['search_items'],
      iat: Math.floor(Date.now() / 1000) - 20,
      exp: Math.floor(Date.now() / 1000) - 5
    };
    const payloadB64 = Buffer.from(JSON.stringify(expiredPayload)).toString('base64url');
    const sig = crypto.createHmac('sha256', secret).update(payloadB64).digest('hex');
    const expiredToken = `${payloadB64}.${sig}`;

    addLog('info', 'Executing invoke with an expired token (expired 5s ago)...');
    try {
      simClient.invoke(expiredToken, 'search_items', {}, executeMcpTool);
      resultStatus = 'SUCCESS_ATTACK';
      message = 'Attack Succeeded (FAILED Expiry Check!)';
      addLog('error', message);
    } catch (pe: any) {
      resultStatus = 'EXPIRED';
      message = `EXPIRED TOKEN REJECTED BY ARMORIQ! ${pe.message}`;
      addLog('warn', message);
    }
  } else {
    addLog('header', '⚡ Simulating Attack: Forged HMAC Signature Attack');
    const planId = 'plan-fake';
    const validToken = simClient.delegate(planId, 'attacker-subagent', ['search_items'], 300);
    const forgedToken = `${validToken.split('.')[0]}.fake_signature_abc123_forged`;

    addLog('info', 'Attempting call with tampered HMAC signature...');
    try {
      simClient.invoke(forgedToken, 'search_items', {}, executeMcpTool);
      resultStatus = 'SUCCESS_ATTACK';
      message = 'Attack Succeeded (FAILED Signature Check!)';
      addLog('error', message);
    } catch (pe: any) {
      resultStatus = 'BLOCKED';
      message = `FORGED SIGNATURE REJECTED BY ARMORIQ! ${pe.message}`;
      addLog('success', message);
    }
  }

  return {
    attackType,
    resultStatus,
    message,
    logs,
    stats: auditLogger.getStats()
  };
}
