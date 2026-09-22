import { describe, it, expect } from 'vitest';
import { asi01GoalHijack } from '../src/checks/asi01-goal-hijack.js';
import { asi02ToolMisuse } from '../src/checks/asi02-tool-misuse.js';
import { asi03IdentityPrivilege } from '../src/checks/asi03-identity-privilege.js';
import { asi04SupplyChain } from '../src/checks/asi04-supply-chain.js';
import { asi05CodeExecution } from '../src/checks/asi05-code-execution.js';
import { asi06MemoryPoisoning } from '../src/checks/asi06-memory-poisoning.js';
import { asi07InterAgentComm } from '../src/checks/asi07-inter-agent-comm.js';
import { asi08CascadingFailures } from '../src/checks/asi08-cascading-failures.js';
import { asi09HumanAgentTrust } from '../src/checks/asi09-human-agent-trust.js';
import { asi10RogueAgents } from '../src/checks/asi10-rogue-agents.js';
import { toxicTriadCheck } from '../src/checks/toxic-triad.js';
import type { AgentCapabilityManifest } from '../src/core/types.js';

describe('ASI01 - Goal Hijack', () => {
  it('should detect unvalidated user-controllable goals', () => {
    const manifest: AgentCapabilityManifest = {
      metadata: { name: 'test', version: '1.0.0' },
      goals: [{ id: 'g1', description: 'test', user_controlled: true }],
      tools: [],
      memory: { type: 'ephemeral', trusted_sources_only: true },
      autonomy: { level: 'supervised' },
    };

    const findings = asi01GoalHijack.run(manifest);
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('high');
    expect(findings[0].asi_category).toBe('ASI01');
  });

  it('should pass when goals have validation', () => {
    const manifest: AgentCapabilityManifest = {
      metadata: { name: 'test', version: '1.0.0' },
      goals: [
        { id: 'g1', description: 'test', user_controlled: true, validation: 'schema-based' },
      ],
      tools: [],
      memory: { type: 'ephemeral', trusted_sources_only: true },
      autonomy: { level: 'supervised' },
    };

    const findings = asi01GoalHijack.run(manifest);
    expect(findings).toHaveLength(0);
  });
});

describe('ASI02 - Tool Misuse', () => {
  it('should detect side-effecting tools without approval', () => {
    const manifest: AgentCapabilityManifest = {
      metadata: { name: 'test', version: '1.0.0' },
      goals: [],
      tools: [
        {
          id: 't1',
          name: 'delete_file',
          description: 'Delete files',
          side_effects: true,
          requires_approval: false,
        },
      ],
      memory: { type: 'ephemeral', trusted_sources_only: true },
      autonomy: { level: 'supervised' },
    };

    const findings = asi02ToolMisuse.run(manifest);
    expect(findings.some((f) => f.severity === 'critical')).toBe(true);
    expect(findings[0].asi_category).toBe('ASI02');
  });
});

describe('ASI03 - Identity & Privilege', () => {
  it('should detect plaintext credential storage', () => {
    const manifest: AgentCapabilityManifest = {
      metadata: { name: 'test', version: '1.0.0' },
      goals: [],
      tools: [],
      memory: { type: 'ephemeral', trusted_sources_only: true },
      auth: { method: 'api_key', credential_storage: 'plaintext', least_privilege: false },
      autonomy: { level: 'supervised' },
    };

    const findings = asi03IdentityPrivilege.run(manifest);
    expect(findings.some((f) => f.id === 'ASI03-001-3')).toBe(true);
    expect(findings.some((f) => f.severity === 'critical')).toBe(true);
  });

  it('should detect lack of least privilege', () => {
    const manifest: AgentCapabilityManifest = {
      metadata: { name: 'test', version: '1.0.0' },
      goals: [],
      tools: [],
      memory: { type: 'ephemeral', trusted_sources_only: true },
      auth: { method: 'oauth', credential_storage: 'encrypted', least_privilege: false },
      autonomy: { level: 'supervised' },
    };

    const findings = asi03IdentityPrivilege.run(manifest);
    expect(findings.some((f) => f.id === 'ASI03-001-4')).toBe(true);
  });
});

describe('ASI04 - Supply Chain', () => {
  it('should detect unpinned dependencies', () => {
    const manifest: AgentCapabilityManifest = {
      metadata: { name: 'test', version: '1.0.0' },
      goals: [],
      tools: [],
      memory: { type: 'ephemeral', trusted_sources_only: true },
      autonomy: { level: 'supervised' },
      supply_chain: {
        dependencies: [{ name: 'pkg', version: 'latest', type: 'library' }],
        pinned: false,
        integrity_checks: false,
      },
    };

    const findings = asi04SupplyChain.run(manifest);
    expect(findings.some((f) => f.id === 'ASI04-001-2')).toBe(true);
    expect(findings.some((f) => f.severity === 'critical')).toBe(true);
  });

  it('should detect missing integrity checks', () => {
    const manifest: AgentCapabilityManifest = {
      metadata: { name: 'test', version: '1.0.0' },
      goals: [],
      tools: [],
      memory: { type: 'ephemeral', trusted_sources_only: true },
      autonomy: { level: 'supervised' },
      supply_chain: {
        dependencies: [{ name: 'pkg', version: '1.0.0', type: 'library' }],
        pinned: true,
        integrity_checks: false,
      },
    };

    const findings = asi04SupplyChain.run(manifest);
    expect(findings.some((f) => f.id === 'ASI04-001-3')).toBe(true);
  });
});

describe('ASI05 - Code Execution', () => {
  it('should detect code execution tools without approval', () => {
    const manifest: AgentCapabilityManifest = {
      metadata: { name: 'test', version: '1.0.0' },
      goals: [],
      tools: [
        {
          id: 't1',
          name: 'eval',
          description: 'Execute code',
          side_effects: true,
          requires_approval: false,
          code_execution: true,
        },
      ],
      memory: { type: 'ephemeral', trusted_sources_only: true },
      autonomy: { level: 'supervised' },
    };

    const findings = asi05CodeExecution.run(manifest);
    expect(findings.some((f) => f.severity === 'critical')).toBe(true);
    expect(findings[0].asi_category).toBe('ASI05');
  });
});

describe('ASI06 - Memory Poisoning', () => {
  it('should detect memory accepting untrusted sources', () => {
    const manifest: AgentCapabilityManifest = {
      metadata: { name: 'test', version: '1.0.0' },
      goals: [],
      tools: [],
      memory: { type: 'persistent', trusted_sources_only: false },
      autonomy: { level: 'supervised' },
    };

    const findings = asi06MemoryPoisoning.run(manifest);
    expect(findings.some((f) => f.severity === 'critical')).toBe(true);
    expect(findings[0].asi_category).toBe('ASI06');
  });

  it('should detect missing sanitization', () => {
    const manifest: AgentCapabilityManifest = {
      metadata: { name: 'test', version: '1.0.0' },
      goals: [],
      tools: [],
      memory: { type: 'persistent', trusted_sources_only: true, sanitization: false },
      autonomy: { level: 'supervised' },
    };

    const findings = asi06MemoryPoisoning.run(manifest);
    expect(findings.some((f) => f.id === 'ASI06-001-3')).toBe(true);
  });
});

describe('ASI07 - Inter-Agent Communication', () => {
  it('should detect unauthenticated peer agents', () => {
    const manifest: AgentCapabilityManifest = {
      metadata: { name: 'test', version: '1.0.0' },
      goals: [],
      tools: [],
      memory: { type: 'ephemeral', trusted_sources_only: true },
      autonomy: { level: 'supervised' },
      peers: [
        {
          id: 'p1',
          name: 'peer',
          trust_level: 'trusted',
          authentication_required: false,
          communication_encrypted: true,
        },
      ],
    };

    const findings = asi07InterAgentComm.run(manifest);
    expect(findings.some((f) => f.severity === 'critical')).toBe(true);
    expect(findings[0].asi_category).toBe('ASI07');
  });
});

describe('ASI08 - Cascading Failures', () => {
  it('should detect missing circuit breaker', () => {
    const manifest: AgentCapabilityManifest = {
      metadata: { name: 'test', version: '1.0.0' },
      goals: [],
      tools: [],
      memory: { type: 'ephemeral', trusted_sources_only: true },
      autonomy: { level: 'fully-autonomous', circuit_breaker: false },
    };

    const findings = asi08CascadingFailures.run(manifest);
    expect(findings.some((f) => f.id === 'ASI08-001-1')).toBe(true);
    expect(findings[0].asi_category).toBe('ASI08');
  });

  it('should detect missing iteration limit', () => {
    const manifest: AgentCapabilityManifest = {
      metadata: { name: 'test', version: '1.0.0' },
      goals: [],
      tools: [],
      memory: { type: 'ephemeral', trusted_sources_only: true },
      autonomy: { level: 'fully-autonomous', circuit_breaker: true },
    };

    const findings = asi08CascadingFailures.run(manifest);
    expect(findings.some((f) => f.id === 'ASI08-001-2')).toBe(true);
  });
});

describe('ASI09 - Human-Agent Trust', () => {
  it('should detect fully autonomous agent without human gates', () => {
    const manifest: AgentCapabilityManifest = {
      metadata: { name: 'test', version: '1.0.0' },
      goals: [],
      tools: [],
      memory: { type: 'ephemeral', trusted_sources_only: true },
      autonomy: { level: 'fully-autonomous' },
    };

    const findings = asi09HumanAgentTrust.run(manifest);
    expect(findings.some((f) => f.severity === 'critical')).toBe(true);
    expect(findings[0].asi_category).toBe('ASI09');
  });
});

describe('ASI10 - Rogue Agents', () => {
  it('should detect fully autonomous agent without bounds', () => {
    const manifest: AgentCapabilityManifest = {
      metadata: { name: 'test', version: '1.0.0' },
      goals: [],
      tools: [],
      memory: { type: 'ephemeral', trusted_sources_only: true },
      autonomy: { level: 'fully-autonomous' },
    };

    const findings = asi10RogueAgents.run(manifest);
    expect(findings.some((f) => f.severity === 'critical')).toBe(true);
    expect(findings[0].asi_category).toBe('ASI10');
  });

  it('should detect high-risk tools without approval', () => {
    const manifest: AgentCapabilityManifest = {
      metadata: { name: 'test', version: '1.0.0' },
      goals: [],
      tools: [
        {
          id: 't1',
          name: 'exec',
          description: 'Execute commands',
          side_effects: true,
          requires_approval: false,
          code_execution: true,
        },
      ],
      memory: { type: 'ephemeral', trusted_sources_only: true },
      autonomy: { level: 'supervised' },
    };

    const findings = asi10RogueAgents.run(manifest);
    expect(findings.some((f) => f.id === 'ASI10-001-4')).toBe(true);
  });
});

describe('Toxic Triad Detection', () => {
  it('should detect toxic triad combination', () => {
    const manifest: AgentCapabilityManifest = {
      metadata: { name: 'test', version: '1.0.0' },
      goals: [],
      tools: [
        {
          id: 't1',
          name: 'write_file',
          description: 'Write files',
          side_effects: true,
          requires_approval: false,
          network_access: true,
        },
      ],
      memory: { type: 'ephemeral', trusted_sources_only: true },
      autonomy: { level: 'supervised' },
      content_sources: [{ id: 'cs1', type: 'web_scraping', trusted: false }],
    };

    const findings = toxicTriadCheck.run(manifest);
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('critical');
    expect(findings[0].id).toBe('TOXIC-001-1');
  });

  it('should not flag when content sources are trusted', () => {
    const manifest: AgentCapabilityManifest = {
      metadata: { name: 'test', version: '1.0.0' },
      goals: [],
      tools: [
        {
          id: 't1',
          name: 'write_file',
          description: 'Write files',
          side_effects: true,
          requires_approval: false,
          network_access: true,
        },
      ],
      memory: { type: 'ephemeral', trusted_sources_only: true },
      autonomy: { level: 'supervised' },
      content_sources: [{ id: 'cs1', type: 'database', trusted: true }],
    };

    const findings = toxicTriadCheck.run(manifest);
    expect(findings).toHaveLength(0);
  });
});
