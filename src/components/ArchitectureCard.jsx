import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Cpu, Lock } from 'lucide-react';

export const ArchitectureCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#0e1422] border border-slate-800 rounded-xl overflow-hidden shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-200 text-xs">
            Architecture & Security Model &mdash; How Argus enforces zero-trust governance
          </span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {isOpen && (
        <div className="p-5 pt-0 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl">
            <h4 className="font-semibold text-slate-200 text-xs flex items-center gap-1.5 mb-2.5">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              Key Innovations
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li>
                <strong className="text-indigo-300">Cryptographic Delegation Chain:</strong> Scoped, signed HMAC tokens per sub-agent keypair guaranteeing non-repudiation.
              </li>
              <li>
                <strong className="text-indigo-300">Runtime Enforcement (invoke):</strong> Cryptographically validates tool name, TTL, and signature before reaching tool endpoints.
              </li>
              <li>
                <strong className="text-indigo-300">ArmorIQ Cloud Integration:</strong> Optional Merkle step proof tokens via <code className="text-indigo-200">platform.armoriq.ai</code>.
              </li>
              <li>
                <strong className="text-indigo-300">Zero-Trust Audit Trail:</strong> Immutable structured ledger recording every ALLOWED, BLOCKED, and EXPIRED decision.
              </li>
            </ul>
          </div>

          <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl">
            <h4 className="font-semibold text-slate-200 text-xs flex items-center gap-1.5 mb-2.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              Technology Stack
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li>
                <strong className="text-indigo-300">Governance:</strong> ArmorIQ SDK cryptographic HMAC-SHA256 engine.
              </li>
              <li>
                <strong className="text-indigo-300">Backend:</strong> Node.js 22 + Express API server on Port 3000.
              </li>
              <li>
                <strong className="text-indigo-300">Audit Layer:</strong> High-performance thread-safe log store + live query filters.
              </li>
              <li>
                <strong className="text-indigo-300">Tool Ecosystem:</strong> Fast simulated MCP servers for Flight, Calendar, Shopping, and System tools.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
