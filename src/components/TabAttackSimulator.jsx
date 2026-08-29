import React, { useState } from 'react';
import { ShieldAlert, Zap, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { TerminalView } from './TerminalView.jsx';

export const TabAttackSimulator = ({ onAttackCompleted }) => {
  const [selectedAttack, setSelectedAttack] = useState('Scope Violation (Rogue Tool Call)');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState({ status: null, message: '' });
  const [logs, setLogs] = useState([]);

  const attackOptions = [
    {
      id: 'Scope Violation (Rogue Tool Call)',
      title: '1. Scope Violation (Rogue Tool Call)',
      desc: 'Sub-agent attempts to invoke an unauthorized tool (e.g. "checkout") outside its delegated permissions array.'
    },
    {
      id: 'Token Expiry Attempt',
      title: '2. Token Expiry Attempt',
      desc: 'Sub-agent attempts an operation using a delegation token whose TTL timestamp has already lapsed.'
    },
    {
      id: 'Forged HMAC Signature Attack',
      title: '3. Forged HMAC Signature Attack',
      desc: 'Adversary tampers with the token payload and attaches a forged signature; ArmorIQ cryptographic verification fails.'
    }
  ];

  const handleSimulate = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch('/api/attack/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attackType: selectedAttack })
      });
      const data = await resp.json();
      setResult({
        status: data.resultStatus,
        message: data.message
      });
      if (data.logs) {
        setLogs(data.logs);
      }
      if (onAttackCompleted) onAttackCompleted();
    } catch (err) {
      setResult({
        status: 'SUCCESS_ATTACK',
        message: `Simulation error: ${err.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert className="w-4 h-4 text-indigo-400" />
          <h3 className="font-semibold text-slate-200 text-sm">
            Interactive Security Attack & Governance Simulator
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Test ArmorIQ's runtime enforcement engine directly by simulating attacks against sub-agent tokens in real time.
        </p>

        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Select Attack Scenario to Simulate:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {attackOptions.map((opt) => {
              const isSelected = selectedAttack === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedAttack(opt.id)}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-950/50 text-slate-100'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-slate-200">{opt.title}</span>
                    <input
                      type="radio"
                      checked={isSelected}
                      onChange={() => setSelectedAttack(opt.id)}
                      className="accent-indigo-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{opt.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handleSimulate}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Simulating Attack...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Execute Attack Simulation</span>
              </>
            )}
          </button>
        </div>

        {/* Live Attack Outcome Callout */}
        {result.status && (
          <div className="mt-5">
            {result.status === 'BLOCKED' && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-xl flex items-start gap-3 text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-xs text-emerald-200">ATTACK BLOCKED BY ARMORIQ!</div>
                  <p className="text-xs mt-1 font-mono text-emerald-300/90">{result.message}</p>
                  <p className="text-[11px] text-slate-400 mt-2">
                    The zero-trust governance layer validated the tool call at runtime and rejected it before execution.
                  </p>
                </div>
              </div>
            )}

            {result.status === 'EXPIRED' && (
              <div className="p-4 bg-amber-950/40 border border-amber-500/50 rounded-xl flex items-start gap-3 text-amber-300">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-xs text-amber-200">EXPIRED TOKEN REJECTED BY ARMORIQ!</div>
                  <p className="text-xs mt-1 font-mono text-amber-300/90">{result.message}</p>
                  <p className="text-[11px] text-slate-400 mt-2">
                    The cryptographic token exceeded its assigned TTL validity window and was discarded.
                  </p>
                </div>
              </div>
            )}

            {result.status === 'SUCCESS_ATTACK' && (
              <div className="p-4 bg-rose-950/40 border border-rose-500/50 rounded-xl flex items-start gap-3 text-rose-300">
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-xs text-rose-200">Attack Succeeded (Security Failure)</div>
                  <p className="text-xs mt-1 font-mono text-rose-300/90">{result.message}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Terminal Output */}
      <TerminalView logs={logs} title="Red-Team Attack Execution Log" />
    </div>
  );
};
