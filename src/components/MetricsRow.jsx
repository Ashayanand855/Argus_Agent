import React from 'react';
import { ShieldCheck, ShieldAlert, Clock, Layers } from 'lucide-react';

export const MetricsRow = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1 */}
      <div className="bg-gradient-to-b from-[#131b2e] to-[#0f1626] border border-slate-800 rounded-xl p-4 shadow-md flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">Total Tool Invocations</p>
          <p className="text-2xl font-bold text-slate-100 mt-1 font-mono">{stats.total}</p>
        </div>
        <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
          <Layers className="w-5 h-5" />
        </div>
      </div>

      {/* Metric 2 */}
      <div className="bg-gradient-to-b from-[#131b2e] to-[#0f1626] border border-slate-800 rounded-xl p-4 shadow-md flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">Authorized (ALLOWED)</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{stats.allowed}</p>
        </div>
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </div>

      {/* Metric 3 */}
      <div className="bg-gradient-to-b from-[#131b2e] to-[#0f1626] border border-slate-800 rounded-xl p-4 shadow-md flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">Blocked (Scope Violation)</p>
          <p className="text-2xl font-bold text-rose-400 mt-1 font-mono">{stats.blocked}</p>
        </div>
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
          <ShieldAlert className="w-5 h-5" />
        </div>
      </div>

      {/* Metric 4 */}
      <div className="bg-gradient-to-b from-[#131b2e] to-[#0f1626] border border-slate-800 rounded-xl p-4 shadow-md flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">Expired (TTL Timeout)</p>
          <p className="text-2xl font-bold text-amber-400 mt-1 font-mono">{stats.expired}</p>
        </div>
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
          <Clock className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
