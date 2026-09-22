import type { Check } from '../core/check.js';
import type { AgentCapabilityManifest, Finding } from '../core/types.js';

export const asi10RogueAgents: Check = {
  id: 'ASI10-001',
  asi_category: 'ASI10',
  name: 'Rogue Agent Detection',
  description: 'Detects configurations that allow agents to operate outside defined boundaries',
  run(manifest: AgentCapabilityManifest): Finding[] {
    const findings: Finding[] = [];

    if (manifest.autonomy.level === 'fully-autonomous') {
      if (!manifest.autonomy.circuit_breaker || !manifest.autonomy.max_iterations) {
        findings.push({
          id: 'ASI10-001-1',
          check_id: 'ASI10-001',
          asi_category: 'ASI10',
          severity: 'critical',
          title: 'Fully autonomous agent without bounds',
          description:
            'Agent is fully autonomous but lacks circuit breaker and iteration limits',
          location: 'autonomy',
          remediation:
            'Add circuit breaker, iteration limits, and monitoring for fully autonomous agents',
          confidence: 'high',
        });
      }
    }

    const unclearGoals = manifest.goals.filter((goal) => !goal.description);

    if (unclearGoals.length > 0) {
      findings.push({
        id: 'ASI10-001-2',
        check_id: 'ASI10-001',
        asi_category: 'ASI10',
        severity: 'medium',
        title: 'Goals without clear descriptions',
        description: `Found ${unclearGoals.length} goal(s) without clear descriptions, making boundaries unclear`,
        location: 'goals',
        remediation: 'Clearly describe all goals with explicit boundaries and constraints',
        confidence: 'high',
      });
    }

    if (!manifest.auth || manifest.auth.method === 'none') {
      findings.push({
        id: 'ASI10-001-3',
        check_id: 'ASI10-001',
        asi_category: 'ASI10',
        severity: 'critical',
        title: 'No authentication enables rogue operation',
        description:
          'Lack of authentication allows agent to operate without accountability',
        location: 'auth',
        remediation: 'Implement authentication and audit logging for all agent operations',
        confidence: 'high',
      });
    }

    const unapprovedHighRiskTools = manifest.tools.filter(
      (tool) =>
        (tool.code_execution || tool.file_system_access || tool.network_access) &&
        !tool.requires_approval
    );

    if (unapprovedHighRiskTools.length > 0) {
      findings.push({
        id: 'ASI10-001-4',
        check_id: 'ASI10-001',
        asi_category: 'ASI10',
        severity: 'critical',
        title: 'High-risk tools without approval enable rogue behavior',
        description: `Found ${unapprovedHighRiskTools.length} high-risk tool(s) without approval: ${unapprovedHighRiskTools.map((t) => t.name).join(', ')}`,
        location: 'tools',
        remediation:
          'Require approval for all high-risk tools (code execution, file system, network)',
        confidence: 'high',
      });
    }

    return findings;
  },
};
