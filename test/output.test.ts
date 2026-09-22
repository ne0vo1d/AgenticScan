import { describe, it, expect } from 'vitest';
import { toSarif } from '../src/output/sarif.js';
import { toMarkdown } from '../src/output/markdown.js';
import { createScanResult } from '../src/core/scanner.js';
import type { AgentCapabilityManifest, Finding } from '../src/core/types.js';

describe('SARIF Output', () => {
  it('should generate valid SARIF 2.1.0', () => {
    const manifest: AgentCapabilityManifest = {
      metadata: { name: 'test', version: '1.0.0' },
      goals: [],
      tools: [],
      memory: { type: 'ephemeral', trusted_sources_only: true },
      autonomy: { level: 'supervised' },
    };

    const findings: Finding[] = [
      {
        id: 'f1',
        check_id: 'C1',
        asi_category: 'ASI01',
        severity: 'critical',
        title: 'Test Finding',
        description: 'Test description',
        remediation: 'Fix it',
        confidence: 'high',
      },
    ];

    const result = createScanResult(manifest, findings, '0.1.0');
    const sarif = toSarif(result);

    expect(sarif.version).toBe('2.1.0');
    expect(sarif.$schema).toContain('sarif-2.1.0.json');
    expect(sarif.runs).toHaveLength(1);
    expect(sarif.runs[0].tool.driver.name).toBe('AgenticScan');
    expect(sarif.runs[0].results).toHaveLength(1);
    expect(sarif.runs[0].results[0].level).toBe('error');
  });
});

describe('Markdown Output', () => {
  it('should generate readable markdown', () => {
    const manifest: AgentCapabilityManifest = {
      metadata: { name: 'test', version: '1.0.0' },
      goals: [],
      tools: [],
      memory: { type: 'ephemeral', trusted_sources_only: true },
      autonomy: { level: 'supervised' },
    };

    const findings: Finding[] = [
      {
        id: 'f1',
        check_id: 'C1',
        asi_category: 'ASI01',
        severity: 'critical',
        title: 'Test Finding',
        description: 'Test description',
        remediation: 'Fix it',
        confidence: 'high',
      },
    ];

    const result = createScanResult(manifest, findings, '0.1.0');
    const markdown = toMarkdown(result);

    expect(markdown).toContain('# AgenticScan Results');
    expect(markdown).toContain('Test Finding');
    expect(markdown).toContain('Critical: 1');
    expect(markdown).toContain('ASI01');
  });

  it('should show success message when no findings', () => {
    const manifest: AgentCapabilityManifest = {
      metadata: { name: 'test', version: '1.0.0' },
      goals: [],
      tools: [],
      memory: { type: 'ephemeral', trusted_sources_only: true },
      autonomy: { level: 'supervised' },
    };

    const result = createScanResult(manifest, [], '0.1.0');
    const markdown = toMarkdown(result);

    expect(markdown).toContain('No findings detected');
  });
});
