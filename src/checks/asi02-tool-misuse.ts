import type { Check } from '../core/check.js';
import type { AgentCapabilityManifest, Finding } from '../core/types.js';

export const asi02ToolMisuse: Check = {
  id: 'ASI02-001',
  asi_category: 'ASI02',
  name: 'Tool Misuse Detection',
  description: 'Detects tools with side effects that lack proper approval mechanisms',
  run(manifest: AgentCapabilityManifest): Finding[] {
    const findings: Finding[] = [];

    const dangerousTools = manifest.tools.filter(
      (tool) => tool.side_effects && !tool.requires_approval
    );

    if (dangerousTools.length > 0) {
      findings.push({
        id: 'ASI02-001-1',
        check_id: 'ASI02-001',
        asi_category: 'ASI02',
        severity: 'critical',
        title: 'Side-effecting tools without approval gates',
        description: `Found ${dangerousTools.length} tool(s) with side effects that do not require approval: ${dangerousTools.map((t) => t.name).join(', ')}`,
        location: 'tools',
        remediation:
          'Require explicit approval for all tools with side effects. Implement human-in-the-loop confirmation before executing state-changing operations.',
        confidence: 'high',
      });
    }

    const undocumentedTools = manifest.tools.filter((tool) => !tool.description);

    if (undocumentedTools.length > 0) {
      findings.push({
        id: 'ASI02-001-2',
        check_id: 'ASI02-001',
        asi_category: 'ASI02',
        severity: 'medium',
        title: 'Tools without clear descriptions',
        description: `Found ${undocumentedTools.length} tool(s) lacking descriptions, making intent unclear`,
        location: 'tools',
        remediation:
          'Document all tools with clear descriptions of their purpose, side effects, and expected inputs',
        confidence: 'medium',
      });
    }

    return findings;
  },
};
