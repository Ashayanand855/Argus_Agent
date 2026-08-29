import React, { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

export const TerminalView = ({ logs, rawOutput, title = 'Live Terminal Output' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = rawOutput || (logs ? logs.map((l) => l.text).join('\n') : '');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderLogLine = (log, index) => {
    switch (log.type) {
      case 'header':
        return <div key={index} className="text-indigo-400 font-bold">{log.text}</div>;
      case 'success':
        return <div key={index} className="text-emerald-400">{log.text}</div>;
      case 'warn':
        return <div key={index} className="text-amber-400">{log.text}</div>;
      case 'error':
        return <div key={index} className="text-rose-400 font-semibold">{log.text}</div>;
      case 'sub':
        return <div key={index} className="text-slate-400 pl-4">{log.text}</div>;
      default:
        return <div key={index} className="text-slate-300">{log.text}</div>;
    }
  };

  return (
    <div className="bg-[#050810] border border-indigo-500/30 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
      <div className="bg-slate-900/90 px-4 py-2 border-b border-indigo-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-300">
          <Terminal className="w-4 h-4" />
          <span className="font-semibold">{title}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy Log'}</span>
        </button>
      </div>

      <div className="p-4 max-h-96 overflow-y-auto space-y-1 text-slate-300 leading-relaxed font-mono selection:bg-indigo-500 selection:text-white">
        {logs && logs.length > 0 ? (
          logs.map((log, i) => renderLogLine(log, i))
        ) : rawOutput ? (
          <pre className="whitespace-pre-wrap">{rawOutput}</pre>
        ) : (
          <div className="text-slate-500 italic">Terminal ready. Run a scenario to view real-time logs.</div>
        )}
      </div>
    </div>
  );
};
