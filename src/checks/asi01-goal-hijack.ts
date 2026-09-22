import type { Check } from '../core/check.js';
import type { AgentCapabilityManifest, Finding } from '../core/types.js';

export const asi01GoalHijack: Check = {
  id: 'ASI01-001',
  asi_category: 'ASI01',
  name: 'Agent Goal Hijack Detection',
  description: 'Detects unvalidated or user-controllable goals that may be hijacked',
  run(manifest: AgentCapabilityManifest): Finding[] {
    const findings: Finding[] = [];

    const unvalidatedGoals = manifest.goals.filter(
      (goal) => goal.user_controlled && !goal.validation
    );

    if (unvalidatedGoals.length > 0) {
      findings.push({
        id: 'ASI01-001-1',
        check_id: 'ASI01-001',
        asi_category: 'ASI01',
        severity: 'high',
        title: 'User-controllable goals without validation',
        description: `Found ${unvalidatedGoals.length} goal(s) that are user-controllable but lack input validation: ${unvalidatedGoals.map((g) => g.id).join(', ')}`,
        location: 'goals',
        remediation:
          'Implement input validation and sanitization for all user-controllable goals. Define allowed goal patterns and reject or sanitize inputs that do not match.',
        confidence: 'high',
      });
    }

    if (manifest.goals.length === 0) {
      findings.push({
        id: 'ASI01-001-2',
        check_id: 'ASI01-001',
        asi_category: 'ASI01',
        severity: 'low',
        title: 'No goals defined',
        description: 'Agent has no defined goals, making it unclear what actions are authorized',
        location: 'goals',
        remediation: 'Define explicit goals with clear boundaries and validation rules',
        confidence: 'medium',
      });
    }

    return findings;
  },
};
