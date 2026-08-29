import React from 'react';
import { ShieldCheck, RefreshCw, Zap, Trash2, Database, Key } from 'lucide-react';

export const Sidebar = ({
  autoRefresh,
  setAutoRefresh,
  onManualRefresh,
  onClearLogs,
  onSeedLogs,
  cloudConnected,
  mode
}) => {
  return (
    <aside className="w-full md:w-72 bg-[#0e1422] border-r border-slate-800 p-5 flex flex-col gap-6 shrink-0">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-600/20 border border-indigo-500/40 rounded-xl text-indigo-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-100 tracking-tight">Argus GUI</h2>
            <p className="text-xs text-slate-400">Cryptographic Governance</p>
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-800" />

      {/* Connection status */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">ArmorIQ Connection</h3>
        {cloudConnected ? (
          <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-400 font-medium text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>ArmorIQ Cloud Connected</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">platform.armoriq.ai</p>
          </div>
        ) : (
          <div className="p-3 bg-indigo-950/30 border border-indigo-500/30 rounded-xl">
            <div className="flex items-center gap-2 text-indigo-300 font-medium text-xs">
              <Key className="w-4 h-4" />
              <span>ArmorIQ Local Mock Mode</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">HMAC-SHA256 zero-trust verification active</p>
          </div>
        )}
      </div>

      <div className="h-px bg-slate-800" />

      {/* Quick settings */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Controls & Sync</h3>
        
        <label className="flex items-center justify-between p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2 text-xs text-slate-200">
            <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin text-indigo-400' : 'text-slate-400'}`} />
            <span>Auto-refresh (3s)</span>
          </div>
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
          />
        </label>

        <button
          onClick={onManualRefresh}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Now</span>
        </button>

        <button
          onClick={onSeedLogs}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-800/80 hover:bg-slate-700/80 text-indigo-300 text-xs font-medium rounded-xl border border-indigo-900/40 transition-colors"
        >
          <Database className="w-3.5 h-3.5" />
          <span>Seed Demo Logs</span>
        </button>

        <button
          onClick={onClearLogs}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 text-xs font-medium rounded-xl border border-rose-900/30 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Audit Trail</span>
        </button>
      </div>

      <div className="mt-auto pt-4 text-[11px] text-slate-500 border-t border-slate-800/60">
        <p>Argus Agent Swarm v1.0</p>
        <p className="text-slate-600">Zero-Trust Governance Core</p>
      </div>
    </aside>
  );
};
