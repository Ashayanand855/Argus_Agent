"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_path = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_vite = require("vite");

// server/audit.ts
var AuditStore = class {
  plans = [];
  delegations = [];
  invocations = [];
  nextInvocationId = 1;
  constructor() {
    this.seedDemoData();
  }
  seedDemoData() {
    if (this.plans.length === 0) {
      const now = /* @__PURE__ */ new Date();
      const planId = "plan-init9281";
      this.plans.push({
        plan_id: planId,
        timestamp: new Date(now.getTime() - 6e4).toISOString(),
        description: "Book me a flight to Delhi, clear my schedule on Thursday, and reorder headphones.",
        declared_tools: ["search_flights", "book_flight", "read_events", "delete_event", "search_items", "add_to_cart"],
        user_email: "judge@microsoft.com",
        coordinator: "coordinator-root"
      });
      this.delegations.push({
        delegation_id: "del-flt8492",
        plan_id: planId,
        agent_id: "agent-flight-001",
        scope: ["search_flights", "book_flight"],
        ttl_seconds: 300,
        issued_by: "coordinator-root",
        issued_at: new Date(now.getTime() - 55e3).toISOString(),
        expires_at: new Date(now.getTime() + 245e3).toISOString()
      });
      this.delegations.push({
        delegation_id: "del-cal3921",
        plan_id: planId,
        agent_id: "agent-calendar-002",
        scope: ["read_events", "delete_event"],
        ttl_seconds: 300,
        issued_by: "coordinator-root",
        issued_at: new Date(now.getTime() - 54e3).toISOString(),
        expires_at: new Date(now.getTime() + 246e3).toISOString()
      });
      this.delegations.push({
        delegation_id: "del-shp1029",
        plan_id: planId,
        agent_id: "agent-shopping-003",
        scope: ["search_items", "add_to_cart"],
        ttl_seconds: 10,
        issued_by: "coordinator-root",
        issued_at: new Date(now.getTime() - 53e3).toISOString(),
        expires_at: new Date(now.getTime() - 43e3).toISOString()
      });
      this.invocations.push(
        {
          id: this.nextInvocationId++,
          timestamp: new Date(now.getTime() - 5e4).toISOString(),
          agent_id: "agent-flight-001",
          tool_name: "search_flights",
          args: { origin: "BOM", destination: "DEL" },
          status: "ALLOWED",
          reason: "Scope and TTL valid",
          plan_id: planId,
          delegation_id: "del-flt8492",
          scope: ["search_flights", "book_flight"],
          ttl_remaining: 295
        },
        {
          id: this.nextInvocationId++,
          timestamp: new Date(now.getTime() - 48e3).toISOString(),
          agent_id: "agent-flight-001",
          tool_name: "book_flight",
          args: { flight_id: "AI302", passenger_name: "Hackathon Judge" },
          status: "ALLOWED",
          reason: "Scope and TTL valid",
          plan_id: planId,
          delegation_id: "del-flt8492",
          scope: ["search_flights", "book_flight"],
          ttl_remaining: 293
        },
        {
          id: this.nextInvocationId++,
          timestamp: new Date(now.getTime() - 45e3).toISOString(),
          agent_id: "agent-calendar-002",
          tool_name: "read_events",
          args: { day: "Thursday" },
          status: "ALLOWED",
          reason: "Scope and TTL valid",
          plan_id: planId,
          delegation_id: "del-cal3921",
          scope: ["read_events", "delete_event"],
          ttl_remaining: 291
        },
        {
          id: this.nextInvocationId++,
          timestamp: new Date(now.getTime() - 43e3).toISOString(),
          agent_id: "agent-calendar-002",
          tool_name: "delete_event",
          args: { event_id: "evt-005" },
          status: "ALLOWED",
          reason: "Scope and TTL valid",
          plan_id: planId,
          delegation_id: "del-cal3921",
          scope: ["read_events", "delete_event"],
          ttl_remaining: 289
        },
        {
          id: this.nextInvocationId++,
          timestamp: new Date(now.getTime() - 4e4).toISOString(),
          agent_id: "agent-shopping-003",
          tool_name: "search_items",
          args: { query: "headphones" },
          status: "ALLOWED",
          reason: "Scope and TTL valid",
          plan_id: planId,
          delegation_id: "del-shp1029",
          scope: ["search_items", "add_to_cart"],
          ttl_remaining: 8.5
        },
        {
          id: this.nextInvocationId++,
          timestamp: new Date(now.getTime() - 38e3).toISOString(),
          agent_id: "agent-shopping-003",
          tool_name: "add_to_cart",
          args: { item_id: "itm-01", qty: 1 },
          status: "ALLOWED",
          reason: "Scope and TTL valid",
          plan_id: planId,
          delegation_id: "del-shp1029",
          scope: ["search_items", "add_to_cart"],
          ttl_remaining: 6.5
        },
        {
          id: this.nextInvocationId++,
          timestamp: new Date(now.getTime() - 36e3).toISOString(),
          agent_id: "agent-shopping-003",
          tool_name: "checkout",
          args: { cart_id: "cart-99" },
          status: "BLOCKED",
          reason: "SCOPE VIOLATION \u2014 'checkout' not in delegated scope ['search_items', 'add_to_cart']. Delegated by: coordinator-root",
          plan_id: planId,
          delegation_id: "del-shp1029",
          scope: ["search_items", "add_to_cart"],
          ttl_remaining: 4.5
        },
        {
          id: this.nextInvocationId++,
          timestamp: new Date(now.getTime() - 25e3).toISOString(),
          agent_id: "agent-shopping-003",
          tool_name: "search_items",
          args: { query: "cable" },
          status: "EXPIRED",
          reason: "Delegation token expired 6.5s ago \u2014 re-delegation required",
          plan_id: planId,
          delegation_id: "del-shp1029",
          scope: ["search_items", "add_to_cart"],
          ttl_remaining: -6.5
        }
      );
    }
  }
  logPlan(planId, description, tools, userEmail, coordinator) {
    const record = {
      plan_id: planId,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      description,
      declared_tools: tools,
      user_email: userEmail,
      coordinator
    };
    this.plans.unshift(record);
    return record;
  }
  logDelegation(delegationId, planId, agentId, scope, ttlSeconds, issuedBy) {
    const issuedAt = /* @__PURE__ */ new Date();
    const expiresAt = new Date(issuedAt.getTime() + ttlSeconds * 1e3);
    const record = {
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
  logInvoke(agentId, toolName, args, status, reason, planId = null, delegationId = null, scope = [], ttlRemaining = 0) {
    const record = {
      id: this.nextInvocationId++,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
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
  getPlans() {
    return [...this.plans];
  }
  getDelegations() {
    return [...this.delegations];
  }
  getInvocations() {
    return [...this.invocations];
  }
  getStats() {
    const total = this.invocations.length;
    const allowed = this.invocations.filter((i) => i.status === "ALLOWED").length;
    const blocked = this.invocations.filter((i) => i.status === "BLOCKED").length;
    const expired = this.invocations.filter((i) => i.status === "EXPIRED").length;
    const error = this.invocations.filter((i) => i.status === "ERROR").length;
    return { total, allowed, blocked, expired, error };
  }
  clear() {
    this.plans = [];
    this.delegations = [];
    this.invocations = [];
    this.nextInvocationId = 1;
  }
};
var auditLogger = new AuditStore();

// server/armoriq.ts
var import_crypto = __toESM(require("crypto"), 1);
var ArmorIQPermissionError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ArmorIQPermissionError";
  }
};
var ArmorIQClient = class {
  agentId;
  apiKey;
  mode;
  secret;
  constructor(agentId, apiKey) {
    this.agentId = agentId;
    this.apiKey = apiKey || process.env.ARMORIQ_API_KEY || "";
    this.mode = (process.env.ARMORIQ_MODE || "mock").trim().toLowerCase();
    this.secret = process.env.ARMORIQ_SHARED_SECRET || "argus-demo-secret-2026";
  }
  capturePlan(description, tools, userEmail = "user@demo.com") {
    const planId = `plan-${import_crypto.default.randomBytes(5).toString("hex")}`;
    auditLogger.logPlan(planId, description, tools, userEmail, this.agentId);
    return planId;
  }
  delegate(planId, subAgentId, scope, ttlSeconds = 300) {
    const delegationId = `del-${import_crypto.default.randomBytes(5).toString("hex")}`;
    const issuedAt = Math.floor(Date.now() / 1e3);
    const expiresAt = issuedAt + ttlSeconds;
    const payload = {
      delegation_id: delegationId,
      plan_id: planId,
      agent_id: subAgentId,
      issued_by: this.agentId,
      scope,
      iat: issuedAt,
      exp: expiresAt
    };
    const payloadJson = JSON.stringify(payload);
    const payloadB64 = Buffer.from(payloadJson).toString("base64url");
    const signature = import_crypto.default.createHmac("sha256", this.secret).update(payloadB64).digest("hex");
    const token = `${payloadB64}.${signature}`;
    auditLogger.logDelegation(delegationId, planId, subAgentId, scope, ttlSeconds, this.agentId);
    return token;
  }
  invoke(token, toolName, args, executeFn) {
    const { payload, status } = this.verifyToken(token);
    const nowSec = Date.now() / 1e3;
    if (status === "INVALID_SIGNATURE" || !payload) {
      const reason = "Token HMAC signature verification failed";
      auditLogger.logInvoke(
        this.agentId,
        toolName,
        args,
        "BLOCKED",
        reason,
        null,
        null,
        [],
        0
      );
      throw new ArmorIQPermissionError(`ArmorIQ BLOCKED: ${reason}`);
    }
    if (status === "EXPIRED") {
      const ttlRemaining2 = payload.exp - nowSec;
      const reason = `Delegation token expired ${Math.abs(ttlRemaining2).toFixed(1)}s ago \u2014 re-delegation required`;
      auditLogger.logInvoke(
        payload.agent_id,
        toolName,
        args,
        "EXPIRED",
        reason,
        payload.plan_id,
        payload.delegation_id,
        payload.scope || [],
        ttlRemaining2
      );
      throw new ArmorIQPermissionError(`ArmorIQ EXPIRED: ${reason}`);
    }
    const allowedScope = payload.scope || [];
    const ttlRemaining = payload.exp - nowSec;
    if (!allowedScope.includes(toolName)) {
      const reason = `SCOPE VIOLATION \u2014 '${toolName}' not in delegated scope [${allowedScope.map((s) => `'${s}'`).join(", ")}]. Delegated by: ${payload.issued_by}  plan: ${payload.plan_id}`;
      auditLogger.logInvoke(
        payload.agent_id,
        toolName,
        args,
        "BLOCKED",
        reason,
        payload.plan_id,
        payload.delegation_id,
        allowedScope,
        ttlRemaining
      );
      throw new ArmorIQPermissionError(`ArmorIQ SCOPE VIOLATION: '${toolName}' not authorised`);
    }
    try {
      const result = executeFn(toolName, args);
      auditLogger.logInvoke(
        payload.agent_id,
        toolName,
        args,
        "ALLOWED",
        "Scope and TTL valid",
        payload.plan_id,
        payload.delegation_id,
        allowedScope,
        ttlRemaining
      );
      return result;
    } catch (err) {
      if (err instanceof ArmorIQPermissionError) {
        throw err;
      }
      auditLogger.logInvoke(
        payload.agent_id,
        toolName,
        args,
        "ERROR",
        err?.message || "Tool execution failure",
        payload.plan_id,
        payload.delegation_id,
        allowedScope,
        ttlRemaining
      );
      throw err;
    }
  }
  verifyToken(token) {
    try {
      const lastDot = token.lastIndexOf(".");
      if (lastDot === -1) {
        return { payload: null, status: "INVALID_SIGNATURE" };
      }
      const payloadB64 = token.substring(0, lastDot);
      const signature = token.substring(lastDot + 1);
      const expectedSig = import_crypto.default.createHmac("sha256", this.secret).update(payloadB64).digest("hex");
      if (signature !== expectedSig) {
        return { payload: null, status: "INVALID_SIGNATURE" };
      }
      const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf8");
      const payload = JSON.parse(payloadJson);
      const nowSec = Date.now() / 1e3;
      if (nowSec > payload.exp) {
        return { payload, status: "EXPIRED" };
      }
      return { payload, status: "VALID" };
    } catch {
      return { payload: null, status: "INVALID_SIGNATURE" };
    }
  }
};

// server/mcp.ts
var CALENDAR = {
  Monday: [{ id: "evt-001", title: "Team standup", time: "09:00", duration: "30m" }],
  Tuesday: [{ id: "evt-002", title: "Sprint planning", time: "10:00", duration: "60m" }],
  Wednesday: [{ id: "evt-003", title: "1:1 with manager", time: "14:00", duration: "30m" }],
  Thursday: [
    { id: "evt-004", title: "Client demo", time: "11:00", duration: "90m" },
    { id: "evt-005", title: "Flight to Delhi (CONFLICT)", time: "15:30", duration: "120m" }
  ],
  Friday: [{ id: "evt-006", title: "Team retrospective", time: "16:00", duration: "60m" }]
};
var INVENTORY = [
  { id: "itm-01", name: "Sony WH-1000XM5 Headphones", price: 350, stock: 14 },
  { id: "itm-02", name: "USB-C to USB-C Cable 2m", price: 15, stock: 105 },
  { id: "itm-03", name: "Logitech MX Master 3S", price: 99, stock: 22 },
  { id: "itm-04", name: "Apple MacBook Air M3", price: 1099, stock: 8 },
  { id: "itm-05", name: "Noise-Canceling Wireless Earbuds", price: 79.99, stock: 45 }
];
var CART = {
  "cart-99": { items: [], total: 0 }
};
function executeMcpTool(toolName, args) {
  if (toolName === "search_flights") {
    const origin = args.origin || "BOM";
    const destination = args.destination || "DEL";
    const date = args.date || "2026-09-01";
    return {
      status: "ok",
      from: origin,
      to: destination,
      date,
      flights: [
        { id: "AI302", airline: "Air India", dep: "08:30", arr: "10:45", price: 4500, seats: 12 },
        { id: "6E101", airline: "IndiGo", dep: "14:15", arr: "16:20", price: 3200, seats: 5 },
        { id: "SG443", airline: "SpiceJet", dep: "20:00", arr: "22:10", price: 2800, seats: 23 },
        { id: "UK987", airline: "Vistara", dep: "06:50", arr: "08:55", price: 5100, seats: 8 }
      ]
    };
  }
  if (toolName === "book_flight") {
    const flightId = args.flight_id || "FL001";
    const passenger = args.passenger_name || "Hackathon User";
    const ref = `BK${Math.floor(1e5 + Math.random() * 9e5)}`;
    return {
      status: "CONFIRMED",
      booking_ref: ref,
      flight_id: flightId,
      passenger,
      seat: `${Math.floor(1 + Math.random() * 30)}${["A", "B", "C", "D", "E", "F"][Math.floor(Math.random() * 6)]}`,
      message: `Flight ${flightId} booked for ${passenger}. PNR: ${ref}`
    };
  }
  if (toolName === "cancel_flight") {
    return {
      status: "CANCELLED",
      flight_id: args.flight_id || "FL001",
      message: `Flight reservation cancelled successfully. Refund initiated.`
    };
  }
  if (toolName === "read_events") {
    const day = (args.day || args.date || "Thursday").toString();
    const dayTitle = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
    const events = CALENDAR[dayTitle] || [
      { id: "evt-999", title: "Ad-hoc Sync", time: "14:00", duration: "45m" }
    ];
    return {
      status: "ok",
      day: dayTitle,
      events,
      count: events.length
    };
  }
  if (toolName === "delete_event") {
    const eventId = args.event_id || "evt-005";
    for (const [day, events] of Object.entries(CALENDAR)) {
      const idx = events.findIndex((e) => e.id === eventId);
      if (idx !== -1) {
        const removed = events.splice(idx, 1)[0];
        return {
          status: "DELETED",
          event_id: eventId,
          title: removed.title,
          day,
          message: `Event '${removed.title}' on ${day} at ${removed.time} has been removed`
        };
      }
    }
    return {
      status: "DELETED",
      event_id: eventId,
      title: "Scheduled Conflict",
      day: "Thursday",
      message: `Event ${eventId} removed from calendar`
    };
  }
  if (toolName === "create_event" || toolName === "schedule_meeting") {
    const title = args.title || "New Meeting";
    const date = args.date || "Thursday";
    const id = `evt-${Math.floor(100 + Math.random() * 900)}`;
    return {
      status: "CREATED",
      event_id: id,
      title,
      date,
      message: `Successfully scheduled '${title}' on ${date}`
    };
  }
  if (toolName === "search_items") {
    const query = (args.query || "").toLowerCase();
    const results = INVENTORY.filter((i) => !query || i.name.toLowerCase().includes(query));
    return {
      status: "ok",
      query: args.query || "",
      results: results.length > 0 ? results : INVENTORY.slice(0, 2)
    };
  }
  if (toolName === "add_to_cart") {
    const itemId = args.item_id || "itm-01";
    const qty = Number(args.qty || args.quantity || 1);
    const item = INVENTORY.find((i) => i.id === itemId) || INVENTORY[0];
    if (!CART["cart-99"]) {
      CART["cart-99"] = { items: [], total: 0 };
    }
    CART["cart-99"].items.push({ item: item.name, qty });
    CART["cart-99"].total += item.price * qty;
    return {
      status: "ADDED",
      cart: CART["cart-99"]
    };
  }
  if (toolName === "checkout") {
    const cartId = args.cart_id || "cart-99";
    const cart = CART[cartId] || { items: [{ item: "Headphones", qty: 1 }], total: 350 };
    const total = cart.total > 0 ? cart.total : 350;
    CART[cartId] = { items: [], total: 0 };
    return {
      status: "PURCHASE_COMPLETE",
      amount_charged: total,
      message: `Successfully charged $${total.toFixed(2)} to saved payment method.`
    };
  }
  if (toolName === "track_order") {
    return {
      status: "SHIPPED",
      order_id: args.order_id || "ORD-9821",
      eta: "Tomorrow by 4:00 PM",
      carrier: "FedEx Express"
    };
  }
  if (toolName === "send_email") {
    return {
      status: "SENT",
      to: args.to || "recipient@company.com",
      subject: args.subject || "Follow-up",
      message: "Email delivered successfully."
    };
  }
  if (toolName === "make_payment" || toolName === "transfer_funds") {
    return {
      status: "TRANSFERRED",
      amount: args.amount || 100,
      recipient: args.to || "vendor",
      reference: `TXN-${Math.floor(1e5 + Math.random() * 9e5)}`
    };
  }
  return {
    status: "ok",
    tool: toolName,
    args,
    message: `Executed tool '${toolName}' successfully.`
  };
}

// server/swarm.ts
async function runSwarmDemo(userPrompt, shoppingTtlSeconds = 10) {
  const prompt = userPrompt || "Book me a flight to Delhi, clear my schedule on Thursday, and reorder headphones.";
  const logs = [];
  const addLog = (type, text) => {
    logs.push({ type, text, timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString() });
  };
  addLog("header", "=========================================================");
  addLog("header", "AUTHORCHAIN COORDINATOR (ARMORIQ MULTI-AGENT SWARM)");
  addLog("header", "=========================================================");
  addLog("info", `USER INTENT: "${prompt}"`);
  addLog("info", "[Coordinator] Parsing intent into sub-tasks (Mock LLM)...");
  const coordinator = new ArmorIQClient("coordinator-root");
  const planId = coordinator.capturePlan(
    prompt,
    ["search_flights", "book_flight", "read_events", "delete_event", "search_items", "add_to_cart"],
    "judge@microsoft.com"
  );
  addLog("info", `[ArmorIQ] Plan Captured: ${planId}`);
  addLog("info", `[ArmorIQ] Declared Tools: ["search_flights", "book_flight", "read_events", "delete_event", "search_items", "add_to_cart"]`);
  const flightToken = coordinator.delegate(
    planId,
    "agent-flight-001",
    ["search_flights", "book_flight"],
    300
  );
  addLog("success", `[Coordinator] Delegated Flight Token (TTL: 300s, Scope: ["search_flights", "book_flight"])`);
  const calendarToken = coordinator.delegate(
    planId,
    "agent-calendar-002",
    ["read_events", "delete_event"],
    300
  );
  addLog("success", `[Coordinator] Delegated Calendar Token (TTL: 300s, Scope: ["read_events", "delete_event"])`);
  const shoppingToken = coordinator.delegate(
    planId,
    "agent-shopping-003",
    ["search_items", "add_to_cart"],
    shoppingTtlSeconds
  );
  addLog("success", `[Coordinator] Delegated Shopping Token (TTL: ${shoppingTtlSeconds}s, Scope: ["search_items", "add_to_cart"])`);
  addLog("header", "================ Running agents/flight_agent ================");
  const flightAgent = new ArmorIQClient("agent-flight-001");
  try {
    addLog("info", "[Flight Agent] Booting up...");
    addLog("info", '[Flight Agent] Executing invoke(search_flights, origin="BOM", destination="DEL")...');
    const searchRes = flightAgent.invoke(
      flightToken,
      "search_flights",
      { origin: "BOM", destination: "DEL" },
      executeMcpTool
    );
    const flightId = searchRes.flights?.[0]?.id || "AI302";
    addLog("success", `[Flight Agent] Found ${searchRes.flights?.length || 4} flights. Best flight: ${flightId} (${searchRes.flights?.[0]?.airline} - \u20B9${searchRes.flights?.[0]?.price})`);
    addLog("info", `[Flight Agent] Executing invoke(book_flight, flight_id="${flightId}", passenger="Hackathon Judge")...`);
    const bookRes = flightAgent.invoke(
      flightToken,
      "book_flight",
      { flight_id: flightId, passenger_name: "Hackathon Judge" },
      executeMcpTool
    );
    addLog("success", `[Flight Agent] Flight booked! Status: ${bookRes.status}, PNR: ${bookRes.booking_ref}, Seat: ${bookRes.seat}`);
  } catch (err) {
    addLog("error", `[Flight Agent] Error: ${err.message}`);
  }
  addLog("header", "================ Running agents/calendar_agent ================");
  const calendarAgent = new ArmorIQClient("agent-calendar-002");
  try {
    addLog("info", "[Calendar Agent] Booting up...");
    addLog("info", '[Calendar Agent] Executing invoke(read_events, day="Thursday")...');
    const calRes = calendarAgent.invoke(
      calendarToken,
      "read_events",
      { day: "Thursday" },
      executeMcpTool
    );
    addLog("success", `[Calendar Agent] Found ${calRes.count || calRes.events?.length} events on Thursday: ${calRes.events?.map((e) => e.title).join(", ")}`);
    const conflictEvent = calRes.events?.find((e) => e.title.includes("Flight") || e.title.includes("CONFLICT")) || calRes.events?.[1] || { id: "evt-005" };
    addLog("info", `[Calendar Agent] Executing invoke(delete_event, event_id="${conflictEvent.id}")...`);
    const delRes = calendarAgent.invoke(
      calendarToken,
      "delete_event",
      { event_id: conflictEvent.id },
      executeMcpTool
    );
    addLog("success", `[Calendar Agent] Conflict removed! ${delRes.message}`);
  } catch (err) {
    addLog("error", `[Calendar Agent] Error: ${err.message}`);
  }
  addLog("header", "================ Running agents/shopping_agent ================");
  const shoppingAgent = new ArmorIQClient("agent-shopping-003");
  try {
    addLog("info", "[Shopping Agent] Booting up...");
    addLog("info", '[Shopping Agent] Executing invoke(search_items, query="headphones")...');
    const itemRes = shoppingAgent.invoke(
      shoppingToken,
      "search_items",
      { query: "headphones" },
      executeMcpTool
    );
    const item = itemRes.results?.[0] || { id: "itm-01", name: "Sony WH-1000XM5 Headphones" };
    addLog("success", `[Shopping Agent] Found: ${item.name} ($${item.price})`);
    addLog("info", `[Shopping Agent] Executing invoke(add_to_cart, item_id="${item.id}", qty=1)...`);
    const cartRes = shoppingAgent.invoke(
      shoppingToken,
      "add_to_cart",
      { item_id: item.id, qty: 1 },
      executeMcpTool
    );
    addLog("success", `[Shopping Agent] Added to cart! Cart total: $${cartRes.cart?.total}`);
    addLog("warn", "[Shopping Agent] Attempting unauthorized operation: invoke(checkout)... (EXPECTED TO FAIL)");
    try {
      shoppingAgent.invoke(
        shoppingToken,
        "checkout",
        { cart_id: "cart-99" },
        executeMcpTool
      );
      addLog("error", "[Shopping Agent] Security failure: checkout succeeded!");
    } catch (pe) {
      addLog("error", `[ArmorIQ Security] \u{1F6A8} BLOCKED: ${pe.message}`);
      addLog("success", "[Shopping Agent] Checkout was blocked as expected by ArmorIQ Zero-Trust Scope Enforcement.");
    }
    addLog("warn", `[Shopping Agent] Simulating fast token expiration (${shoppingTtlSeconds}s TTL)...`);
    addLog("info", `[Shopping Agent] Attempting another invoke(search_items, query="cable") after simulated expiration...`);
    const expiredPayload = {
      delegation_id: "del-expired-demo",
      plan_id: planId,
      agent_id: "agent-shopping-003",
      issued_by: "coordinator-root",
      scope: ["search_items", "add_to_cart"],
      iat: Math.floor(Date.now() / 1e3) - (shoppingTtlSeconds + 5),
      exp: Math.floor(Date.now() / 1e3) - 2
      // expired 2 seconds ago
    };
    const crypto2 = await import("crypto");
    const secret = process.env.ARMORIQ_SHARED_SECRET || "argus-demo-secret-2026";
    const payloadB64 = Buffer.from(JSON.stringify(expiredPayload)).toString("base64url");
    const sig = crypto2.createHmac("sha256", secret).update(payloadB64).digest("hex");
    const expiredToken = `${payloadB64}.${sig}`;
    try {
      shoppingAgent.invoke(
        expiredToken,
        "search_items",
        { query: "cable" },
        executeMcpTool
      );
      addLog("error", "[Shopping Agent] Expiry check failed: expired token was accepted!");
    } catch (pe) {
      addLog("warn", `[ArmorIQ Security] \u23F0 EXPIRED: ${pe.message}`);
      addLog("success", "[Shopping Agent] Token expired as expected and rejected by ArmorIQ TTL validation.");
    }
  } catch (err) {
    addLog("error", `[Shopping Agent] Error: ${err.message}`);
  }
  addLog("header", "=========================================================");
  addLog("header", "Demo Complete. All decisions recorded in Audit Log.");
  addLog("header", "=========================================================");
  return {
    success: true,
    logs,
    rawOutput: logs.map((l) => `[${l.timestamp}] ${l.text}`).join("\n"),
    stats: auditLogger.getStats()
  };
}
async function runCustomScenario(config) {
  const logs = [];
  const addLog = (type, text) => {
    logs.push({ type, text, timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString() });
  };
  addLog("header", "=========================================================");
  addLog("header", "ARGUS CUSTOM AGENT CONTROL SYSTEM");
  addLog("header", "=========================================================");
  addLog("info", `USER INTENT: "${config.user_intent}"`);
  addLog("info", `USER EMAIL: ${config.user_email}`);
  addLog("info", `AVAILABLE TOOLS: ${config.available_tools?.join(", ")}`);
  addLog("header", "=========================================================");
  const coordinator = new ArmorIQClient("coordinator-gui");
  const planId = coordinator.capturePlan(
    config.user_intent || "Custom Intent",
    config.available_tools || [],
    config.user_email || "demo@company.com"
  );
  addLog("info", `[Coordinator] Captured Plan: ${planId}`);
  const tokens = {};
  const agents = config.agents || {};
  for (const [agentName, agentConfig] of Object.entries(agents)) {
    if (agentConfig.scope && agentConfig.scope.length > 0) {
      const agentId = `agent-${agentName}-gui`;
      tokens[agentName] = coordinator.delegate(
        planId,
        agentId,
        agentConfig.scope,
        agentConfig.ttl || 300
      );
      addLog("success", `Created token for ${agentName.toUpperCase()} agent: [${agentConfig.scope.join(", ")}] (TTL: ${agentConfig.ttl || 300}s)`);
    }
  }
  for (const [agentName, agentConfig] of Object.entries(agents)) {
    const token = tokens[agentName];
    if (!token || !agentConfig.scope || agentConfig.scope.length === 0) continue;
    addLog("header", `
================ Executing ${agentName.toUpperCase()} Agent ================`);
    const agentClient = new ArmorIQClient(`agent-${agentName}-gui`);
    for (const tool of agentConfig.scope) {
      try {
        addLog("info", `[${agentName.toUpperCase()} Agent] Attempting invoke("${tool}")...`);
        const result = agentClient.invoke(
          token,
          tool,
          agentConfig.args || {},
          executeMcpTool
        );
        addLog("success", `[${agentName.toUpperCase()} Agent] ${tool} succeeded: ${JSON.stringify(result)}`);
      } catch (err) {
        addLog("error", `[${agentName.toUpperCase()} Agent] ${tool} failed: ${err.message}`);
      }
    }
    if (config.security_tests?.scope_violation && agentName === "shopping") {
      addLog("warn", `[Shopping Agent] \u{1F6A8} SECURITY TEST: Attempting unauthorized 'checkout'...`);
      try {
        agentClient.invoke(
          token,
          "checkout",
          { cart_id: "test-cart" },
          executeMcpTool
        );
        addLog("error", `[Shopping Agent] Security test FAILED \u2014 unauthorized checkout succeeded!`);
      } catch (err) {
        addLog("success", `[Shopping Agent] Security test PASSED \u2014 unauthorized checkout blocked by ArmorIQ: ${err.message}`);
      }
    }
    if (config.security_tests?.token_expiry && agentName === "shopping") {
      addLog("warn", `[Shopping Agent] \u23F0 SECURITY TEST: Testing expired token rejection...`);
      const crypto2 = await import("crypto");
      const secret = process.env.ARMORIQ_SHARED_SECRET || "argus-demo-secret-2026";
      const expiredPayload = {
        delegation_id: "del-custom-exp",
        plan_id: planId,
        agent_id: `agent-shopping-gui`,
        issued_by: "coordinator-gui",
        scope: agentConfig.scope,
        iat: Math.floor(Date.now() / 1e3) - 100,
        exp: Math.floor(Date.now() / 1e3) - 10
      };
      const payloadB64 = Buffer.from(JSON.stringify(expiredPayload)).toString("base64url");
      const sig = crypto2.createHmac("sha256", secret).update(payloadB64).digest("hex");
      const expiredToken = `${payloadB64}.${sig}`;
      try {
        agentClient.invoke(
          expiredToken,
          agentConfig.scope[0] || "search_items",
          {},
          executeMcpTool
        );
        addLog("error", `[Shopping Agent] Expiry test FAILED \u2014 expired token was accepted!`);
      } catch (err) {
        addLog("success", `[Shopping Agent] Expiry test PASSED \u2014 expired token rejected by ArmorIQ: ${err.message}`);
      }
    }
  }
  addLog("header", "=========================================================");
  addLog("header", "CUSTOM SCENARIO EXECUTION COMPLETE");
  addLog("header", "=========================================================");
  return {
    success: true,
    logs,
    rawOutput: logs.map((l) => `[${l.timestamp}] ${l.text}`).join("\n"),
    stats: auditLogger.getStats()
  };
}
async function runAttackSimulation(attackType) {
  const logs = [];
  const addLog = (type, text) => {
    logs.push({ type, text, timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString() });
  };
  const simClient = new ArmorIQClient("attacker-subagent");
  let resultStatus = "BLOCKED";
  let message = "";
  if (attackType.includes("Scope Violation") || attackType === "scope_violation") {
    addLog("header", "\u26A1 Simulating Attack: Scope Violation (Rogue Tool Call)");
    const planId = simClient.capturePlan("Shopping intent", ["search_items", "add_to_cart"]);
    const token = simClient.delegate(planId, "attacker-subagent", ["search_items"], 300);
    addLog("info", 'Simulating unauthorized tool call: "checkout" (authorized scope: ["search_items"])...');
    try {
      simClient.invoke(token, "checkout", { cart_id: "c1" }, executeMcpTool);
      resultStatus = "SUCCESS_ATTACK";
      message = "Attack Succeeded (FAILED Security Check!)";
      addLog("error", message);
    } catch (pe) {
      resultStatus = "BLOCKED";
      message = `ATTACK BLOCKED BY ARMORIQ! ${pe.message}`;
      addLog("success", message);
    }
  } else if (attackType.includes("Token Expiry") || attackType === "token_expiry") {
    addLog("header", "\u26A1 Simulating Attack: Token Expiry Attempt");
    const planId = simClient.capturePlan("Short plan", ["search_items"]);
    const crypto2 = await import("crypto");
    const secret = process.env.ARMORIQ_SHARED_SECRET || "argus-demo-secret-2026";
    const expiredPayload = {
      delegation_id: "del-atk-exp",
      plan_id: planId,
      agent_id: "attacker-subagent",
      issued_by: "attacker-subagent",
      scope: ["search_items"],
      iat: Math.floor(Date.now() / 1e3) - 20,
      exp: Math.floor(Date.now() / 1e3) - 5
    };
    const payloadB64 = Buffer.from(JSON.stringify(expiredPayload)).toString("base64url");
    const sig = crypto2.createHmac("sha256", secret).update(payloadB64).digest("hex");
    const expiredToken = `${payloadB64}.${sig}`;
    addLog("info", "Executing invoke with an expired token (expired 5s ago)...");
    try {
      simClient.invoke(expiredToken, "search_items", {}, executeMcpTool);
      resultStatus = "SUCCESS_ATTACK";
      message = "Attack Succeeded (FAILED Expiry Check!)";
      addLog("error", message);
    } catch (pe) {
      resultStatus = "EXPIRED";
      message = `EXPIRED TOKEN REJECTED BY ARMORIQ! ${pe.message}`;
      addLog("warn", message);
    }
  } else {
    addLog("header", "\u26A1 Simulating Attack: Forged HMAC Signature Attack");
    const planId = "plan-fake";
    const validToken = simClient.delegate(planId, "attacker-subagent", ["search_items"], 300);
    const forgedToken = `${validToken.split(".")[0]}.fake_signature_abc123_forged`;
    addLog("info", "Attempting call with tampered HMAC signature...");
    try {
      simClient.invoke(forgedToken, "search_items", {}, executeMcpTool);
      resultStatus = "SUCCESS_ATTACK";
      message = "Attack Succeeded (FAILED Signature Check!)";
      addLog("error", message);
    } catch (pe) {
      resultStatus = "BLOCKED";
      message = `FORGED SIGNATURE REJECTED BY ARMORIQ! ${pe.message}`;
      addLog("success", message);
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

// server.ts
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use((0, import_cors.default)());
app.use(import_express.default.json());
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    mode: process.env.ARMORIQ_MODE || "mock",
    cloudConnected: Boolean(process.env.ARMORIQ_API_KEY && process.env.ARMORIQ_API_KEY.startsWith("ak_")),
    uptime: process.uptime()
  });
});
app.get("/api/audit/stats", (req, res) => {
  res.json(auditLogger.getStats());
});
app.get("/api/audit/invocations", (req, res) => {
  res.json(auditLogger.getInvocations());
});
app.get("/api/audit/plans", (req, res) => {
  res.json(auditLogger.getPlans());
});
app.get("/api/audit/delegations", (req, res) => {
  res.json(auditLogger.getDelegations());
});
app.post("/api/audit/clear", (req, res) => {
  auditLogger.clear();
  res.json({ status: "cleared", stats: auditLogger.getStats() });
});
app.post("/api/audit/seed", (req, res) => {
  auditLogger.seedDemoData();
  res.json({ status: "seeded", stats: auditLogger.getStats() });
});
app.post("/api/swarm/run", async (req, res) => {
  try {
    const { prompt, shoppingTtl } = req.body;
    const result = await runSwarmDemo(prompt, shoppingTtl ? Number(shoppingTtl) : 10);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/custom-swarm/run", async (req, res) => {
  try {
    const result = await runCustomScenario(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/attack/simulate", async (req, res) => {
  try {
    const { attackType } = req.body;
    const result = await runAttackSimulation(attackType);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/tools/call", (req, res) => {
  try {
    const { tool_name, args, token } = req.body;
    if (token) {
      const client = new ArmorIQClient("api-caller");
      const result2 = client.invoke(token, tool_name, args || {}, executeMcpTool);
      return res.json({ status: "ok", result: result2 });
    }
    const result = executeMcpTool(tool_name, args || {});
    res.json(result);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Argus] Server listening on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
