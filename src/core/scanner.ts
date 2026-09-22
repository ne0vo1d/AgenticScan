import type { AgentCapabilityManifest, Finding, ScanResult, Severity } from './types.js';

export function calculateSeverity(findings: Finding[]): Record<Severity, number> {
  const counts: Record<Severity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  };

  for (const finding of findings) {
    counts[finding.severity]++;
  }

  return counts;
}

export function calculateCategoryDistribution(findings: Finding[]) {
  const distribution: Record<string, number> = {};

  for (const finding of findings) {
    distribution[finding.asi_category] = (distribution[finding.asi_category] || 0) + 1;
  }

  return distribution;
}

export function createScanResult(
  manifest: AgentCapabilityManifest,
  findings: Finding[],
  version: string
): ScanResult {
  return {
    manifest,
    findings,
    summary: {
      total: findings.length,
      by_severity: calculateSeverity(findings),
      by_category: calculateCategoryDistribution(findings),
    },
    scan_timestamp: new Date().toISOString(),
    scanner_version: version,
  };
}

export function hasHighSeverityFindings(result: ScanResult): boolean {
  return result.summary.by_severity.critical > 0 || result.summary.by_severity.high > 0;
}
