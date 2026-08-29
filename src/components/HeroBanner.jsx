import React from 'react';
import { Shield } from 'lucide-react';

export const HeroBanner = () => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-[#1e293b] to-indigo-950/80 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 border border-indigo-500/40 text-indigo-300">
            <Shield className="w-3.5 h-3.5" />
            Zero-Trust Multi-Agent Governance
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight">
          Argus <span className="text-indigo-400">Control Center</span> & Audit Dashboard
        </h1>

        <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-4xl">
          <strong className="text-slate-100">What it does:</strong> Argus coordinates AI agents and issues each one a scoped, cryptographically-signed token &mdash; so agents can only run approved tools, actions are enforced in real time, and every decision is logged and auditable.
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 text-xs text-slate-300">
          <li className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <strong className="text-indigo-300 block mb-0.5">1. Plan</strong>
            Coordinator records user intent before any sub-agent executes.
          </li>
          <li className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <strong className="text-indigo-300 block mb-0.5">2. Delegate</strong>
            Each sub-agent receives a short-lived, scoped HMAC token.
          </li>
          <li className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <strong className="text-indigo-300 block mb-0.5">3. Enforce</strong>
            Every tool call is validated for scope, signature, and expiry.
          </li>
          <li className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <strong className="text-indigo-300 block mb-0.5">4. Audit</strong>
            A tamper-evident ledger records ALLOWED, BLOCKED, and EXPIRED calls.
          </li>
        </ul>
      </div>
    </div>
  );
};
