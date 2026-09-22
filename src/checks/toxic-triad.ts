import type { Check } from '../core/check.js';
import type { AgentCapabilityManifest, Finding } from '../core/types.js';
import { detectToxicTriad } from '../core/graph.js';

export const toxicTriadCheck: Check = {
  id: 'TOXIC-001',
  asi_category: 'ASI01',
  name: 'Toxic Triad Detection',
  description:
    'Detects the lethal combination of untrusted content + side-effecting tools + egress capability',
  run(manifest: AgentCapabilityManifest): Finding[] {
    const findings: Finding[] = [];

    const triad = detectToxicTriad(manifest);

    if (triad) {
      findings.push({
        id: 'TOXIC-001-1',
        check_id: 'TOXIC-001',
        asi_category: 'ASI01',
        severity: 'critical',
        title: 'Toxic Triad Detected',
        description: `Agent exhibits the toxic triad: ${triad.untrusted_content.length} untrusted content source(s), ${triad.side_effecting_tools.length} side-effecting tool(s), and egress capability. This combination enables goal hijack (ASI01), tool misuse (ASI02), and code execution attacks (ASI05).`,
        location: 'content_sources, tools',
        remediation:
          'Break the toxic triad by: (1) validating and sanitizing all untrusted inputs, (2) requiring approval for side-effecting tools, (3) restricting egress to trusted destinations, or (4) isolating untrusted content processing from privileged operations.',
        confidence: 'high',
      });
    }

    return findings;
  },
};
