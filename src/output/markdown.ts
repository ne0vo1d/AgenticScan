import type { ScanResult } from '../core/types.js';

export function toMarkdown(result: ScanResult): string {
  const lines: string[] = [];

  lines.push(`# AgenticScan Results`);
  lines.push('');
  lines.push(`**Agent:** ${result.manifest.metadata.name} v${result.manifest.metadata.version}`);
  lines.push(`**Scanned:** ${result.scan_timestamp}`);
  lines.push(`**Scanner Version:** ${result.scanner_version}`);
  lines.push('');

  lines.push('## Summary');
  lines.push('');
  lines.push(`**Total Findings:** ${result.summary.total}`);
  lines.push('');
  lines.push('### By Severity');
  lines.push('');
  lines.push(`- 🔴 Critical: ${result.summary.by_severity.critical}`);
  lines.push(`- 🟠 High: ${result.summary.by_severity.high}`);
  lines.push(`- 🟡 Medium: ${result.summary.by_severity.medium}`);
  lines.push(`- 🔵 Low: ${result.summary.by_severity.low}`);
  lines.push(`- ⚪ Info: ${result.summary.by_severity.info}`);
  lines.push('');

  if (Object.keys(result.summary.by_category).length > 0) {
    lines.push('### By OWASP Category');
    lines.push('');
    for (const [category, count] of Object.entries(result.summary.by_category)) {
      lines.push(`- ${category}: ${count}`);
    }
    lines.push('');
  }

  if (result.findings.length > 0) {
    lines.push('## Findings');
    lines.push('');

    const critical = result.findings.filter((f) => f.severity === 'critical');
    const high = result.findings.filter((f) => f.severity === 'high');
    const medium = result.findings.filter((f) => f.severity === 'medium');
    const low = result.findings.filter((f) => f.severity === 'low');
    const info = result.findings.filter((f) => f.severity === 'info');

    for (const findings of [critical, high, medium, low, info]) {
      for (const finding of findings) {
        const emoji =
          finding.severity === 'critical'
            ? '🔴'
            : finding.severity === 'high'
              ? '🟠'
              : finding.severity === 'medium'
                ? '🟡'
                : finding.severity === 'low'
                  ? '🔵'
                  : '⚪';

        lines.push(`### ${emoji} ${finding.title}`);
        lines.push('');
        lines.push(`**ID:** ${finding.id} | **Check:** ${finding.check_id} | **Category:** ${finding.asi_category} | **Severity:** ${finding.severity.toUpperCase()}`);
        lines.push('');
        lines.push(`**Description:** ${finding.description}`);
        lines.push('');

        if (finding.location) {
          lines.push(`**Location:** \`${finding.location}\``);
          lines.push('');
        }

        if (finding.remediation) {
          lines.push(`**Remediation:** ${finding.remediation}`);
          lines.push('');
        }

        lines.push(`**Confidence:** ${finding.confidence}`);
        lines.push('');
        lines.push('---');
        lines.push('');
      }
    }
  } else {
    lines.push('✅ No findings detected. Agent configuration appears secure!');
    lines.push('');
  }

  return lines.join('\n');
}
