import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Clock, AlertTriangle, Search, Filter } from 'lucide-react';

export const TabAuditTrail = ({ invocations, plans, delegations }) => {
  const [selectedStatuses, setSelectedStatuses] = useState(['ALLOWED', 'BLOCKED', 'EXPIRED', 'ERROR']);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleStatus = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const filteredInvocations = (invocations || []).filter((inv) => {
    const matchesStatus = selectedStatuses.includes(inv.status);
    const matchesSearch =
      !searchQuery ||
      inv.agent_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.tool_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.status?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ALLOWED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            ALLOWED
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-3.5 h-3.5" />
            BLOCKED
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            EXPIRED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5" /> Filter by Status:
          </span>
          {['ALLOWED', 'BLOCKED', 'EXPIRED', 'ERROR'].map((st) => {
            const isSelected = selectedStatuses.includes(st);
            return (
              <button
                key={st}
                onClick={() => toggleStatus(st)}
                className={`px-3 py-1 text-xs rounded-lg font-medium border transition-colors cursor-pointer ${
                  isSelected
                    ? st === 'ALLOWED'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : st === 'BLOCKED'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : st === 'EXPIRED'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : 'bg-slate-900 text-slate-500 border-slate-800 opacity-60'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tool, agent, reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Main Invocations Table */}
      <div className="bg-[#0e1422] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-slate-200 text-sm">Live Invocations Log</h3>
            <p className="text-xs text-slate-400">Cryptographically enforced runtime decision trail</p>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
            {filteredInvocations.length} records
          </span>
        </div>

        <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 sticky top-0 border-b border-slate-800 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Agent ID</th>
                <th className="py-2.5 px-3">Tool Name</th>
                <th className="py-2.5 px-3">Reason / Scope Check</th>
                <th className="py-2.5 px-3">TTL Rem.</th>
                <th className="py-2.5 px-3">Arguments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredInvocations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                    No matching tool invocations recorded.
                  </td>
                </tr>
              ) : (
                filteredInvocations.map((inv) => (
                  <tr
                    key={inv.id}
                    className={`hover:bg-slate-800/30 transition-colors ${
                      inv.status === 'ALLOWED'
                        ? 'bg-emerald-500/5'
                        : inv.status === 'BLOCKED'
                        ? 'bg-rose-500/5'
                        : inv.status === 'EXPIRED'
                        ? 'bg-amber-500/5'
                        : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(inv.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap font-sans">{getStatusBadge(inv.status)}</td>
                    <td className="py-2.5 px-3 text-indigo-300 font-medium whitespace-nowrap">{inv.agent_id}</td>
                    <td className="py-2.5 px-3 text-slate-200 font-semibold whitespace-nowrap">{inv.tool_name}</td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans text-xs max-w-xs truncate" title={inv.reason}>
                      {inv.reason}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {inv.ttl_remaining !== undefined ? `${inv.ttl_remaining}s` : 'N/A'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 max-w-xs truncate text-[11px]" title={JSON.stringify(inv.args)}>
                      {JSON.stringify(inv.args)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Captured Plans & Issued Delegation Tokens Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plans */}
        <div className="bg-[#0e1422] border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h3 className="font-semibold text-slate-200 text-sm">Captured Plans (capture_plan)</h3>
            <p className="text-xs text-slate-400">Canonical user intents declared prior to delegation</p>
          </div>
          <div className="overflow-x-auto max-h-60 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 sticky top-0 border-b border-slate-800 font-semibold">
                <tr>
                  <th className="py-2 px-3">Plan ID</th>
                  <th className="py-2 px-3">Intent Description</th>
                  <th className="py-2 px-3">Declared Tools</th>
                  <th className="py-2 px-3">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {!plans || plans.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-500 font-sans">
                      No plans recorded.
                    </td>
                  </tr>
                ) : (
                  plans.map((p) => (
                    <tr key={p.plan_id} className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 text-indigo-400 whitespace-nowrap">{p.plan_id}</td>
                      <td className="py-2 px-3 text-slate-300 font-sans text-xs max-w-xs truncate" title={p.description}>
                        {p.description}
                      </td>
                      <td className="py-2 px-3 text-slate-400 max-w-xs truncate" title={JSON.stringify(p.declared_tools)}>
                        {JSON.stringify(p.declared_tools)}
                      </td>
                      <td className="py-2 px-3 text-slate-400 whitespace-nowrap">{p.user_email}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delegations */}
        <div className="bg-[#0e1422] border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h3 className="font-semibold text-slate-200 text-sm">Issued Delegation Tokens (delegate)</h3>
            <p className="text-xs text-slate-400">Cryptographically signed HMAC tokens per sub-agent keypair</p>
          </div>
          <div className="overflow-x-auto max-h-60 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 sticky top-0 border-b border-slate-800 font-semibold">
                <tr>
                  <th className="py-2 px-3">Token ID</th>
                  <th className="py-2 px-3">Agent</th>
                  <th className="py-2 px-3">Scope</th>
                  <th className="py-2 px-3">TTL</th>
                  <th className="py-2 px-3">Issuer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {!delegations || delegations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-slate-500 font-sans">
                      No delegation tokens recorded.
                    </td>
                  </tr>
                ) : (
                  delegations.map((d) => (
                    <tr key={d.delegation_id} className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 text-emerald-400 whitespace-nowrap">{d.delegation_id}</td>
                      <td className="py-2 px-3 text-indigo-300 whitespace-nowrap">{d.agent_id}</td>
                      <td className="py-2 px-3 text-slate-300 max-w-xs truncate" title={JSON.stringify(d.scope)}>
                        {JSON.stringify(d.scope)}
                      </td>
                      <td className="py-2 px-3 text-slate-400 whitespace-nowrap">{d.ttl_seconds}s</td>
                      <td className="py-2 px-3 text-slate-400 whitespace-nowrap">{d.issued_by}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
