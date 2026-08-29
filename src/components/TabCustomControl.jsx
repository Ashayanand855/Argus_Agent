import React, { useState } from 'react';
import { Plane, Calendar, ShoppingCart, ShieldCheck, Play, Loader2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { TerminalView } from './TerminalView.jsx';

const ALL_AVAILABLE_TOOLS = [
  'search_flights',
  'book_flight',
  'cancel_flight',
  'read_events',
  'create_event',
  'delete_event',
  'update_event',
  'search_items',
  'add_to_cart',
  'checkout',
  'track_order',
  'send_email',
  'schedule_meeting',
  'make_payment'
];

export const TabCustomControl = ({ onScenarioCompleted }) => {
  const [prompt, setPrompt] = useState(
    'Book me a flight to Tokyo, schedule a meeting with the team, and order a new laptop'
  );
  const [userEmail, setUserEmail] = useState('demo@company.com');
  const [availableTools, setAvailableTools] = useState([
    'search_flights',
    'book_flight',
    'read_events',
    'delete_event',
    'search_items',
    'add_to_cart'
  ]);

  // Flight Agent state
  const [flightScope, setFlightScope] = useState(['search_flights', 'book_flight']);
  const [flightTtl, setFlightTtl] = useState(300);
  const [flightOrigin, setFlightOrigin] = useState('NYC');
  const [flightDest, setFlightDest] = useState('TOK');
  const [flightPassenger, setFlightPassenger] = useState('Demo User');

  // Calendar Agent state
  const [calendarScope, setCalendarScope] = useState(['read_events', 'delete_event']);
  const [calendarTtl, setCalendarTtl] = useState(300);
  const [calendarTitle, setCalendarTitle] = useState('Team Meeting');
  const [calendarDate, setCalendarDate] = useState('Thursday');

  // Shopping Agent state
  const [shoppingScope, setShoppingScope] = useState(['search_items', 'add_to_cart']);
  const [shoppingTtl, setShoppingTtl] = useState(15);
  const [shoppingQuery, setShoppingQuery] = useState('wireless headphones');
  const [shoppingMaxPrice, setShoppingMaxPrice] = useState(200);

  // Security flags
  const [testScopeViolation, setTestScopeViolation] = useState(true);
  const [testTokenExpiry, setTestTokenExpiry] = useState(true);
  const [includeUnauthorizedTools, setIncludeUnauthorizedTools] = useState(false);
  const [simulateAttacks, setSimulateAttacks] = useState(false);

  // Accordion expands
  const [expandFlight, setExpandFlight] = useState(true);
  const [expandCalendar, setExpandCalendar] = useState(true);
  const [expandShopping, setExpandShopping] = useState(true);
  const [expandPresets, setExpandPresets] = useState(false);

  // Execution state
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [rawOutput, setRawOutput] = useState('');

  const toggleTool = (tool) => {
    setAvailableTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const applyPreset = (preset) => {
    if (preset === 1) {
      setPrompt('Book me a flight to Paris and clear my schedule');
      setFlightScope(['search_flights', 'book_flight']);
      setCalendarScope(['read_events', 'delete_event']);
      setShoppingScope([]);
      setTestScopeViolation(false);
      setTestTokenExpiry(false);
    } else if (preset === 2) {
      setPrompt('Find and buy headphones under $100');
      setFlightScope([]);
      setCalendarScope([]);
      setShoppingScope(['search_items', 'add_to_cart']);
      setTestScopeViolation(true);
      setTestTokenExpiry(false);
    } else if (preset === 3) {
      setPrompt('Complete travel and shopping for business trip');
      setFlightScope(['search_flights', 'book_flight']);
      setCalendarScope(['read_events', 'create_event', 'delete_event']);
      setShoppingScope(['search_items', 'add_to_cart', 'checkout']);
      setTestScopeViolation(false);
      setTestTokenExpiry(false);
    } else if (preset === 4) {
      setPrompt('Reorder office supplies with strict 5-second TTL');
      setShoppingScope(['search_items', 'add_to_cart']);
      setShoppingTtl(5);
      setTestTokenExpiry(true);
    }
  };

  const handleRunCustom = async () => {
    setIsLoading(true);
    try {
      const config = {
        user_intent: prompt,
        user_email: userEmail,
        available_tools: availableTools,
        agents: {
          flight: {
            scope: flightScope,
            ttl: flightTtl,
            args: { origin: flightOrigin, destination: flightDest, passenger_name: flightPassenger }
          },
          calendar: {
            scope: calendarScope,
            ttl: calendarTtl,
            args: { event_title: calendarTitle, event_date: calendarDate }
          },
          shopping: {
            scope: shoppingScope,
            ttl: shoppingTtl,
            args: { search_query: shoppingQuery, max_price: shoppingMaxPrice }
          }
        },
        security_tests: {
          scope_violation: testScopeViolation,
          token_expiry: testTokenExpiry,
          unauthorized_tools: includeUnauthorizedTools,
          simulate_attacks: simulateAttacks
        }
      };

      const resp = await fetch('/api/custom-swarm/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await resp.json();
      if (data.logs) {
        setLogs(data.logs);
      }
      if (data.rawOutput) {
        setRawOutput(data.rawOutput);
      }
      if (onScenarioCompleted) onScenarioCompleted();
    } catch (err) {
      setLogs([{ type: 'error', text: `Execution failed: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Start Presets */}
      <div className="bg-[#0e1422] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <button
          onClick={() => setExpandPresets(!expandPresets)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-200">Quick Start Demo Scenarios</span>
          </div>
          {expandPresets ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {expandPresets && (
          <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={() => applyPreset(1)}
              className="p-3 bg-slate-900/80 hover:bg-slate-800 text-left rounded-xl border border-slate-800 hover:border-indigo-500/40 transition-all text-xs cursor-pointer"
            >
              <div className="font-semibold text-slate-200 mb-1">1. Basic Travel Planning</div>
              <p className="text-[11px] text-slate-400">Flight + Calendar agents with standard delegation tokens.</p>
            </button>

            <button
              onClick={() => applyPreset(2)}
              className="p-3 bg-slate-900/80 hover:bg-slate-800 text-left rounded-xl border border-slate-800 hover:border-indigo-500/40 transition-all text-xs cursor-pointer"
            >
              <div className="font-semibold text-slate-200 mb-1">2. Shopping Security Test</div>
              <p className="text-[11px] text-slate-400">Restricts checkout scope & tests runtime policy block.</p>
            </button>

            <button
              onClick={() => applyPreset(3)}
              className="p-3 bg-slate-900/80 hover:bg-slate-800 text-left rounded-xl border border-slate-800 hover:border-indigo-500/40 transition-all text-xs cursor-pointer"
            >
              <div className="font-semibold text-slate-200 mb-1">3. Full Permissions Test</div>
              <p className="text-[11px] text-slate-400">Grants broad authorized scopes across all sub-agents.</p>
            </button>

            <button
              onClick={() => applyPreset(4)}
              className="p-3 bg-slate-900/80 hover:bg-slate-800 text-left rounded-xl border border-slate-800 hover:border-indigo-500/40 transition-all text-xs cursor-pointer"
            >
              <div className="font-semibold text-slate-200 mb-1">4. Token Expiry Demo</div>
              <p className="text-[11px] text-slate-400">Short 5s TTL token testing automatic timeout rejection.</p>
            </button>
          </div>
        )}
      </div>

      {/* User Intent & Email */}
      <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Custom User Intent</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-slate-300 mb-1">Command / Prompt:</label>
            <textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">User Email:</label>
            <input
              type="text"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Global Available Tools */}
        <div className="pt-2">
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Global Declared Tools Scope:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ALL_AVAILABLE_TOOLS.map((t) => {
              const active = availableTools.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTool(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                    active
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 font-semibold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-400'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Individual Agent Configuration Accordions */}
      <div className="space-y-4">
        {/* Flight Agent */}
        <div className="bg-[#0e1422] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div
            onClick={() => setExpandFlight(!expandFlight)}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors border-b border-slate-800"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg">
                <Plane className="w-4 h-4" />
              </div>
              <span className="font-semibold text-slate-200 text-xs">Flight Agent Configuration</span>
            </div>
            {expandFlight ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>

          {expandFlight && (
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Permissions Scope:</label>
                <div className="flex flex-wrap gap-1.5">
                  {['search_flights', 'book_flight', 'cancel_flight'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() =>
                        setFlightScope((prev) =>
                          prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                        )
                      }
                      className={`px-2 py-0.5 rounded text-[11px] font-mono border cursor-pointer ${
                        flightScope.includes(t)
                          ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-medium text-slate-300 mb-1">TTL (seconds):</label>
                <input
                  type="number"
                  value={flightTtl}
                  onChange={(e) => setFlightTtl(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-medium text-slate-400 text-[11px] mb-1">Origin:</label>
                  <input
                    type="text"
                    value={flightOrigin}
                    onChange={(e) => setFlightOrigin(e.target.value)}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-400 text-[11px] mb-1">Dest:</label>
                  <input
                    type="text"
                    value={flightDest}
                    onChange={(e) => setFlightDest(e.target.value)}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-400 text-[11px] mb-1">Passenger:</label>
                  <input
                    type="text"
                    value={flightPassenger}
                    onChange={(e) => setFlightPassenger(e.target.value)}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Calendar Agent */}
        <div className="bg-[#0e1422] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div
            onClick={() => setExpandCalendar(!expandCalendar)}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors border-b border-slate-800"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="font-semibold text-slate-200 text-xs">Calendar Agent Configuration</span>
            </div>
            {expandCalendar ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>

          {expandCalendar && (
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Permissions Scope:</label>
                <div className="flex flex-wrap gap-1.5">
                  {['read_events', 'create_event', 'delete_event'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() =>
                        setCalendarScope((prev) =>
                          prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                        )
                      }
                      className={`px-2 py-0.5 rounded text-[11px] font-mono border cursor-pointer ${
                        calendarScope.includes(t)
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-medium text-slate-300 mb-1">TTL (seconds):</label>
                <input
                  type="number"
                  value={calendarTtl}
                  onChange={(e) => setCalendarTtl(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-400 text-[11px] mb-1">Event Title:</label>
                  <input
                    type="text"
                    value={calendarTitle}
                    onChange={(e) => setCalendarTitle(e.target.value)}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-400 text-[11px] mb-1">Event Date:</label>
                  <input
                    type="text"
                    value={calendarDate}
                    onChange={(e) => setCalendarDate(e.target.value)}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Shopping Agent */}
        <div className="bg-[#0e1422] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div
            onClick={() => setExpandShopping(!expandShopping)}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors border-b border-slate-800"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <span className="font-semibold text-slate-200 text-xs">Shopping Agent Configuration</span>
            </div>
            {expandShopping ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>

          {expandShopping && (
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Permissions Scope (checkout optional):</label>
                <div className="flex flex-wrap gap-1.5">
                  {['search_items', 'add_to_cart', 'checkout', 'track_order'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() =>
                        setShoppingScope((prev) =>
                          prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                        )
                      }
                      className={`px-2 py-0.5 rounded text-[11px] font-mono border cursor-pointer ${
                        shoppingScope.includes(t)
                          ? t === 'checkout'
                            ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                            : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-medium text-slate-300 mb-1">TTL (seconds):</label>
                <input
                  type="number"
                  value={shoppingTtl}
                  onChange={(e) => setShoppingTtl(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-400 text-[11px] mb-1">Query:</label>
                  <input
                    type="text"
                    value={shoppingQuery}
                    onChange={(e) => setShoppingQuery(e.target.value)}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-400 text-[11px] mb-1">Max Price ($):</label>
                  <input
                    type="number"
                    value={shoppingMaxPrice}
                    onChange={(e) => setShoppingMaxPrice(Number(e.target.value))}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Testing Options */}
      <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          Security Testing Checks
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <label className="flex items-center gap-2.5 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={testScopeViolation}
              onChange={(e) => setTestScopeViolation(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700"
            />
            <div>
              <span className="font-medium text-slate-200">🚨 Test Scope Violation</span>
              <p className="text-[11px] text-slate-400">Shopping agent attempts checkout even if omitted from token scope</p>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={testTokenExpiry}
              onChange={(e) => setTestTokenExpiry(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700"
            />
            <div>
              <span className="font-medium text-slate-200">⏰ Test Token Expiry</span>
              <p className="text-[11px] text-slate-400">Simulates sub-agent attempting calls after delegation TTL expires</p>
            </div>
          </label>
        </div>

        <div className="mt-5">
          <button
            onClick={handleRunCustom}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Executing Custom Scenario...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run Custom Agent Scenario</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Terminal View */}
      <TerminalView logs={logs} rawOutput={rawOutput} title="Custom Scenario Execution Log" />
    </div>
  );
};
