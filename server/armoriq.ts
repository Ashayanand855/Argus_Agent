import crypto from 'crypto';
import { auditLogger } from './audit.js';

export interface TokenPayload {
  delegation_id: string;
  plan_id: string;
  agent_id: string;
  issued_by: string;
  scope: string[];
  iat: number;
  exp: number;
}

export class ArmorIQPermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ArmorIQPermissionError';
  }
}

export class ArmorIQClient {
  public agentId: string;
  public apiKey: string;
  public mode: string;
  private secret: string;

  constructor(agentId: string, apiKey?: string) {
    this.agentId = agentId;
    this.apiKey = apiKey || process.env.ARMORIQ_API_KEY || '';
    this.mode = (process.env.ARMORIQ_MODE || 'mock').trim().toLowerCase();
    this.secret = process.env.ARMORIQ_SHARED_SECRET || 'argus-demo-secret-2026';
  }

  public capturePlan(description: string, tools: string[], userEmail: string = 'user@demo.com'): string {
    const planId = `plan-${crypto.randomBytes(5).toString('hex')}`;
    auditLogger.logPlan(planId, description, tools, userEmail, this.agentId);
    return planId;
  }

  public delegate(planId: string, subAgentId: string, scope: string[], ttlSeconds: number = 300): string {
    const delegationId = `del-${crypto.randomBytes(5).toString('hex')}`;
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = issuedAt + ttlSeconds;

    const payload: TokenPayload = {
      delegation_id: delegationId,
      plan_id: planId,
      agent_id: subAgentId,
      issued_by: this.agentId,
      scope,
      iat: issuedAt,
      exp: expiresAt
    };

    const payloadJson = JSON.stringify(payload);
    const payloadB64 = Buffer.from(payloadJson).toString('base64url');
    const signature = crypto.createHmac('sha256', this.secret).update(payloadB64).digest('hex');
    const token = `${payloadB64}.${signature}`;

    auditLogger.logDelegation(delegationId, planId, subAgentId, scope, ttlSeconds, this.agentId);
    return token;
  }

  public invoke<T = any>(
    token: string,
    toolName: string,
    args: Record<string, any>,
    executeFn: (toolName: string, args: Record<string, any>) => T
  ): T {
    const { payload, status } = this.verifyToken(token);
    const nowSec = Date.now() / 1000;

    // 1. Invalid signature
    if (status === 'INVALID_SIGNATURE' || !payload) {
      const reason = 'Token HMAC signature verification failed';
      auditLogger.logInvoke(
        this.agentId,
        toolName,
        args,
        'BLOCKED',
        reason,
        null,
        null,
        [],
        0
      );
      throw new ArmorIQPermissionError(`ArmorIQ BLOCKED: ${reason}`);
    }

    // 2. Expired token
    if (status === 'EXPIRED') {
      const ttlRemaining = payload.exp - nowSec;
      const reason = `Delegation token expired ${Math.abs(ttlRemaining).toFixed(1)}s ago — re-delegation required`;
      auditLogger.logInvoke(
        payload.agent_id,
        toolName,
        args,
        'EXPIRED',
        reason,
        payload.plan_id,
        payload.delegation_id,
        payload.scope || [],
        ttlRemaining
      );
      throw new ArmorIQPermissionError(`ArmorIQ EXPIRED: ${reason}`);
    }

    // 3. Scope check
    const allowedScope = payload.scope || [];
    const ttlRemaining = payload.exp - nowSec;

    if (!allowedScope.includes(toolName)) {
      const reason = `SCOPE VIOLATION — '${toolName}' not in delegated scope [${allowedScope.map((s) => `'${s}'`).join(', ')}]. Delegated by: ${payload.issued_by}  plan: ${payload.plan_id}`;
      auditLogger.logInvoke(
        payload.agent_id,
        toolName,
        args,
        'BLOCKED',
        reason,
        payload.plan_id,
        payload.delegation_id,
        allowedScope,
        ttlRemaining
      );
      throw new ArmorIQPermissionError(`ArmorIQ SCOPE VIOLATION: '${toolName}' not authorised`);
    }

    // 4. All checks pass — execute
    try {
      const result = executeFn(toolName, args);
      auditLogger.logInvoke(
        payload.agent_id,
        toolName,
        args,
        'ALLOWED',
        'Scope and TTL valid',
        payload.plan_id,
        payload.delegation_id,
        allowedScope,
        ttlRemaining
      );
      return result;
    } catch (err: any) {
      if (err instanceof ArmorIQPermissionError) {
        throw err;
      }
      auditLogger.logInvoke(
        payload.agent_id,
        toolName,
        args,
        'ERROR',
        err?.message || 'Tool execution failure',
        payload.plan_id,
        payload.delegation_id,
        allowedScope,
        ttlRemaining
      );
      throw err;
    }
  }

  public verifyToken(token: string): { payload: TokenPayload | null; status: 'VALID' | 'EXPIRED' | 'INVALID_SIGNATURE' } {
    try {
      const lastDot = token.lastIndexOf('.');
      if (lastDot === -1) {
        return { payload: null, status: 'INVALID_SIGNATURE' };
      }

      const payloadB64 = token.substring(0, lastDot);
      const signature = token.substring(lastDot + 1);

      const expectedSig = crypto.createHmac('sha256', this.secret).update(payloadB64).digest('hex');
      if (signature !== expectedSig) {
        return { payload: null, status: 'INVALID_SIGNATURE' };
      }

      const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf8');
      const payload: TokenPayload = JSON.parse(payloadJson);

      const nowSec = Date.now() / 1000;
      if (nowSec > payload.exp) {
        return { payload, status: 'EXPIRED' };
      }

      return { payload, status: 'VALID' };
    } catch {
      return { payload: null, status: 'INVALID_SIGNATURE' };
    }
  }
}
