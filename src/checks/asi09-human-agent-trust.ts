import type { Check } from '../core/check.js';
import type { AgentCapabilityManifest, Finding } from '../core/types.js';

export const asi09HumanAgentTrust: Check = {
  id: 'ASI09-001',
  asi_category: 'ASI09',
  name: 'Human-Agent Trust Exploitation Detection',
  description: 'Detects insufficient human oversight and approval gates',
  run(manifest: AgentCapabilityManifest): Finding[] {
    const findings: Finding[] = [];

    const humanGates = manifest.human_gates || [];

    if (humanGates.length === 0 && manifest.autonomy.level === 'fully-autonomous') {
      findings.push({
        id: 'ASI09-001-1',
        check_id: 'ASI09-001',
        asi_category: 'ASI09',
        severity: 'critical',
        title: 'Fully autonomous agent without human gates',
        description:
          'Agent is fully autonomous but has no human approval gates for critical operations',
        location: 'human_gates',
        remediation:
          'Add human approval gates for high-risk operations, especially in fully autonomous mode',
        confidence: 'high',
      });
    }

    const missingRequiredGates = humanGates.filter((gate) => !gate.required);

    if (missingRequiredGates.length > 0) {
      findings.push({
        id: 'ASI09-001-2',
        check_id: 'ASI09-001',
        asi_category: 'ASI09',
        severity: 'medium',
        title: 'Optional human gates for critical stages',
        description: `Found ${missingRequiredGates.length} human gate(s) that are optional: ${missingRequiredGates.map((g) => g.stage).join(', ')}`,
        location: 'human_gates',
        remediation: 'Make human gates required for critical operations',
        confidence: 'medium',
      });
    }

    const sideEffectToolsCount = manifest.tools.filter((t) => t.side_effects).length;
    const approvalGatedToolsCount = manifest.tools.filter(
      (t) => t.side_effects && t.requires_approval
    ).length;

    if (sideEffectToolsCount > 0 && approvalGatedToolsCount === 0) {
      findings.push({
        id: 'ASI09-001-3',
        check_id: 'ASI09-001',
        asi_category: 'ASI09',
        severity: 'high',
        title: 'Side-effecting tools without human approval',
        description: `Agent has ${sideEffectToolsCount} side-effecting tools but none require human approval`,
        location: 'tools',
        remediation: 'Require human approval for at least high-risk side-effecting tools',
        confidence: 'high',
      });
    }

    return findings;
  },
};
