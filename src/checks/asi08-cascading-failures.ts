import type { Check } from '../core/check.js';
import type { AgentCapabilityManifest, Finding } from '../core/types.js';

export const asi08CascadingFailures: Check = {
  id: 'ASI08-001',
  asi_category: 'ASI08',
  name: 'Cascading Failures Detection',
  description: 'Detects lack of safeguards against cascading failures and runaway behavior',
  run(manifest: AgentCapabilityManifest): Finding[] {
    const findings: Finding[] = [];

    if (!manifest.autonomy.circuit_breaker) {
      findings.push({
        id: 'ASI08-001-1',
        check_id: 'ASI08-001',
        asi_category: 'ASI08',
        severity: 'high',
        title: 'No circuit breaker configured',
        description: 'Agent lacks circuit breaker to prevent cascading failures',
        location: 'autonomy.circuit_breaker',
        remediation:
          'Implement circuit breaker pattern to stop execution when repeated failures occur',
        confidence: 'high',
      });
    }

    if (!manifest.autonomy.max_iterations) {
      findings.push({
        id: 'ASI08-001-2',
        check_id: 'ASI08-001',
        asi_category: 'ASI08',
        severity: 'high',
        title: 'No iteration limit configured',
        description: 'Agent has no maximum iteration limit, risking infinite loops',
        location: 'autonomy.max_iterations',
        remediation:
          'Set a reasonable maximum iteration count to prevent runaway execution',
        confidence: 'high',
      });
    }

    if (!manifest.autonomy.timeout_seconds) {
      findings.push({
        id: 'ASI08-001-3',
        check_id: 'ASI08-001',
        asi_category: 'ASI08',
        severity: 'medium',
        title: 'No timeout configured',
        description: 'Agent lacks execution timeout, risking resource exhaustion',
        location: 'autonomy.timeout_seconds',
        remediation: 'Configure reasonable timeouts for agent execution and tool calls',
        confidence: 'high',
      });
    }

    if (!manifest.autonomy.rollback_capability) {
      findings.push({
        id: 'ASI08-001-4',
        check_id: 'ASI08-001',
        asi_category: 'ASI08',
        severity: 'medium',
        title: 'No rollback capability',
        description: 'Agent cannot rollback failed operations, preventing recovery',
        location: 'autonomy.rollback_capability',
        remediation: 'Implement rollback or compensation mechanisms for failed operations',
        confidence: 'medium',
      });
    }

    return findings;
  },
};
