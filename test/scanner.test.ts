import { describe, it, expect } from 'vitest';
import { createScanResult, hasHighSeverityFindings } from '../src/core/scanner.js';
import type { AgentCapabilityManifest, Finding } from '../src/core/types.js';

describe('Scanner', () => {
  it('should create scan result with correct summary', () => {
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
        title: 'Test',
        description: 'Test',
        confidence: 'high',
      },
      {
        id: 'f2',
        check_id: 'C2',
        asi_category: 'ASI02',
        severity: 'high',
        title: 'Test2',
        description: 'Test2',
        confidence: 'high',
      },
    ];

    const result = createScanResult(manifest, findings, '0.1.0');

    expect(result.summary.total).toBe(2);
    expect(result.summary.by_severity.critical).toBe(1);
    expect(result.summary.by_severity.high).toBe(1);
    expect(result.summary.by_category.ASI01).toBe(1);
    expect(result.summary.by_category.ASI02).toBe(1);
  });

  it('should detect high severity findings', () => {
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
        title: 'Test',
        description: 'Test',
        confidence: 'high',
      },
    ];

    const result = createScanResult(manifest, findings, '0.1.0');
    expect(hasHighSeverityFindings(result)).toBe(true);
  });

  it('should not flag low severity findings as high', () => {
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
        severity: 'low',
        title: 'Test',
        description: 'Test',
        confidence: 'high',
      },
    ];

    const result = createScanResult(manifest, findings, '0.1.0');
    expect(hasHighSeverityFindings(result)).toBe(false);
  });
});
