import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import { auditLogger } from './server/audit.js';
import { runSwarmDemo, runCustomScenario, runAttackSimulation } from './server/swarm.js';
import { executeMcpTool } from './server/mcp.js';
import { ArmorIQClient } from './server/armoriq.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ── API ROUTES ──

// Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: process.env.ARMORIQ_MODE || 'mock',
    cloudConnected: Boolean(process.env.ARMORIQ_API_KEY && process.env.ARMORIQ_API_KEY.startsWith('ak_')),
    uptime: process.uptime()
  });
});

// Audit stats
app.get('/api/audit/stats', (req, res) => {
  res.json(auditLogger.getStats());
});

// Audit invocations
app.get('/api/audit/invocations', (req, res) => {
  res.json(auditLogger.getInvocations());
});

// Audit plans
app.get('/api/audit/plans', (req, res) => {
  res.json(auditLogger.getPlans());
});

// Audit delegations
app.get('/api/audit/delegations', (req, res) => {
  res.json(auditLogger.getDelegations());
});

// Clear audit logs
app.post('/api/audit/clear', (req, res) => {
  auditLogger.clear();
  res.json({ status: 'cleared', stats: auditLogger.getStats() });
});

// Reset / Seed demo data
app.post('/api/audit/seed', (req, res) => {
  auditLogger.seedDemoData();
  res.json({ status: 'seeded', stats: auditLogger.getStats() });
});

// Run standard Swarm Demo
app.post('/api/swarm/run', async (req, res) => {
  try {
    const { prompt, shoppingTtl } = req.body;
    const result = await runSwarmDemo(prompt, shoppingTtl ? Number(shoppingTtl) : 10);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Run custom scenario
app.post('/api/custom-swarm/run', async (req, res) => {
  try {
    const result = await runCustomScenario(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Run red-team attack simulation
app.post('/api/attack/simulate', async (req, res) => {
  try {
    const { attackType } = req.body;
    const result = await runAttackSimulation(attackType);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Direct tool execution endpoint (simulating MCP tool call with optional token)
app.post('/api/tools/call', (req, res) => {
  try {
    const { tool_name, args, token } = req.body;
    if (token) {
      const client = new ArmorIQClient('api-caller');
      const result = client.invoke(token, tool_name, args || {}, executeMcpTool);
      return res.json({ status: 'ok', result });
    }
    const result = executeMcpTool(tool_name, args || {});
    res.json(result);
  } catch (err: any) {
    res.status(403).json({ error: err.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Argus] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
