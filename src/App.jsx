import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar.jsx';
import { HeroBanner } from './components/HeroBanner.jsx';
import { MetricsRow } from './components/MetricsRow.jsx';
import { TabAuditTrail } from './components/TabAuditTrail.jsx';
import { TabSwarmDemo } from './components/TabSwarmDemo.jsx';
import { TabCustomControl } from './components/TabCustomControl.jsx';
import { TabAttackSimulator } from './components/TabAttackSimulator.jsx';
import { ArchitectureCard } from './components/ArchitectureCard.jsx';

export function App() {
  const [activeTab, setActiveTab] = useState('audit');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [cloudConnected, setCloudConnected] = useState(false);
  const [mode, setMode] = useState('mock');

  const [stats, setStats] = useState({
    total: 0,
    allowed: 0,
    blocked: 0,
    expired: 0
  });

  const [invocations, setInvocations] = useState([]);
  const [plans, setPlans] = useState([]);
  const [delegations, setDelegations] = useState([]);

  const fetchAuditData = useCallback(async () => {
    try {
      const [statsRes, invRes, plansRes, delRes] = await Promise.all([
        fetch('/api/audit/stats'),
        fetch('/api/audit/invocations'),
        fetch('/api/audit/plans'),
        fetch('/api/audit/delegations')
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (invRes.ok) setInvocations(await invRes.json());
      if (plansRes.ok) setPlans(await plansRes.json());
      if (delRes.ok) setDelegations(await delRes.json());
    } catch (err) {
      console.error('Failed to fetch audit data', err);
    }
  }, []);

  const fetchHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setCloudConnected(data.cloudConnected);
        setMode(data.mode || 'mock');
      }
    } catch (err) {
      console.error('Health check failed', err);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    fetchAuditData();
  }, [fetchHealth, fetchAuditData]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchAuditData();
    }, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchAuditData]);

  const handleClearLogs = async () => {
    try {
      await fetch('/api/audit/clear', { method: 'POST' });
      fetchAuditData();
    } catch (err) {
      console.error('Clear failed', err);
    }
  };

  const handleSeedLogs = async () => {
    try {
      await fetch('/api/audit/seed', { method: 'POST' });
      fetchAuditData();
    } catch (err) {
      console.error('Seed failed', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
        onManualRefresh={fetchAuditData}
        onClearLogs={handleClearLogs}
        onSeedLogs={handleSeedLogs}
        cloudConnected={cloudConnected}
        mode={mode}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 overflow-y-auto">
        {/* Hero Banner */}
        <HeroBanner />

        {/* Live Metrics Row */}
        <MetricsRow stats={stats} />

        {/* Tab Navigation */}
        <div className="bg-[#0e1422] p-1.5 rounded-xl border border-slate-800 flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            Real-Time Audit Trail
          </button>
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'demo'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            Run Swarm Demo
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            Custom Agent Control
          </button>
          <button
            onClick={() => setActiveTab('attack')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'attack'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            Red-Team Attack Simulator
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'audit' && (
          <TabAuditTrail
            invocations={invocations}
            plans={plans}
            delegations={delegations}
          />
        )}

        {activeTab === 'demo' && (
          <TabSwarmDemo onSwarmCompleted={fetchAuditData} />
        )}

        {activeTab === 'custom' && (
          <TabCustomControl onScenarioCompleted={fetchAuditData} />
        )}

        {activeTab === 'attack' && (
          <TabAttackSimulator onAttackCompleted={fetchAuditData} />
        )}

        {/* Architecture & Security Model Footer Card */}
        <ArchitectureCard />
      </main>
    </div>
  );
}

export default App;
