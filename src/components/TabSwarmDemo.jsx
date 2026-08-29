import React, { useState } from 'react';
import { Play, Loader2, Sparkles, CheckCircle2, ShieldAlert, Clock } from 'lucide-react';
import { TerminalView } from './TerminalView.jsx';

export const TabSwarmDemo = ({ onSwarmCompleted }) => {
  const [prompt, setPrompt] = useState('Book me a flight to Delhi, clear my schedule on Thursday, and reorder headphones.');
  const [shoppingTtl, setShoppingTtl] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [rawOutput, setRawOutput] = useState('');
  const [completed, setCompleted] = useState(false);

  const handleLaunch = async () => {
    setIsLoading(true);
    setCompleted(false);
    try {
      const resp = await fetch('/api/swarm/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, shoppingTtl })
      });
      const data = await resp.json();
      if (data.logs) {
        setLogs(data.logs);
      }
      if (data.rawOutput) {
        setRawOutput(data.rawOutput);
      }
      setCompleted(true);
      if (onSwarmCompleted) onSwarmCompleted();
    } catch (err) {
      setLogs([
        { type: 'error', text: `Failed to execute swarm: ${err.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h3 className="font-semibold text-slate-200 text-sm">Execute Swarm Demo from GUI</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Run the full multi-agent pipeline: Coordinator &rarr; Flight Agent &rarr; Calendar Agent &rarr; Shopping Agent. Demonstrates plan capture, cryptographic token minting, runtime permission checks, and automatic audit trail emission.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              User Prompt Intent
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium text-slate-300">
                Shopping Agent TTL: <span className="text-indigo-400 font-mono">{shoppingTtl}s</span>
              </label>
            </div>
            <input
              type="range"
              min="2"
              max="30"
              value={shoppingTtl}
              onChange={(e) => setShoppingTtl(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={handleLaunch}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Executing Swarm Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Launch Multi-Agent Swarm Demo</span>
              </>
            )}
          </button>

          {completed && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-950/30 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
              <span>Demo Completed! Audit trail updated.</span>
            </div>
          )}
        </div>
      </div>

      {/* Highlights / Explanation Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            1. Authorized Executions
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Flight agent searches/books flight and Calendar agent reads/deletes events within granted scopes.
          </p>
        </div>

        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs">
          <div className="flex items-center gap-1.5 text-rose-400 font-semibold mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            2. Scope Violation Check
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Shopping agent attempts unauthorized <code className="text-rose-300">checkout</code> tool call &mdash; immediately blocked by ArmorIQ.
          </p>
        </div>

        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
            <Clock className="w-3.5 h-3.5" />
            3. Token Expiry Check
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Shopping agent attempts tool call with expired delegation token &mdash; rejected by ArmorIQ TTL engine.
          </p>
        </div>
      </div>

      {/* Terminal View */}
      <TerminalView logs={logs} rawOutput={rawOutput} title="Swarm Live Terminal Execution Log" />
    </div>
  );
};
