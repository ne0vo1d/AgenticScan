import type { Check } from '../core/check.js';
import type { AgentCapabilityManifest, Finding } from '../core/types.js';

export const asi06MemoryPoisoning: Check = {
  id: 'ASI06-001',
  asi_category: 'ASI06',
  name: 'Memory & Context Poisoning Detection',
  description: 'Detects memory configurations vulnerable to poisoning attacks',
  run(manifest: AgentCapabilityManifest): Finding[] {
    const findings: Finding[] = [];

    if (!manifest.memory.trusted_sources_only) {
      findings.push({
        id: 'ASI06-001-1',
        check_id: 'ASI06-001',
        asi_category: 'ASI06',
        severity: 'critical',
        title: 'Memory accepts untrusted sources',
        description:
          'Agent memory can be populated from untrusted sources, enabling poisoning attacks',
        location: 'memory.trusted_sources_only',
        remediation:
          'Configure memory to accept data only from trusted, authenticated sources. Implement input validation.',
        confidence: 'high',
      });
    }

    if (!manifest.memory.validation) {
      findings.push({
        id: 'ASI06-001-2',
        check_id: 'ASI06-001',
        asi_category: 'ASI06',
        severity: 'high',
        title: 'No memory input validation',
        description: 'Memory lacks validation rules for incoming data',
        location: 'memory.validation',
        remediation:
          'Implement validation and sanitization for all data stored in memory. Use schema validation.',
        confidence: 'high',
      });
    }

    if (!manifest.memory.sanitization) {
      findings.push({
        id: 'ASI06-001-3',
        check_id: 'ASI06-001',
        asi_category: 'ASI06',
        severity: 'high',
        title: 'No memory sanitization',
        description: 'Memory does not sanitize inputs, allowing injection attacks',
        location: 'memory.sanitization',
        remediation:
          'Sanitize all memory inputs to remove malicious content. Apply context-appropriate encoding.',
        confidence: 'high',
      });
    }

    if (manifest.memory.type === 'shared') {
      findings.push({
        id: 'ASI06-001-4',
        check_id: 'ASI06-001',
        asi_category: 'ASI06',
        severity: 'medium',
        title: 'Shared memory increases attack surface',
        description:
          'Shared memory configuration increases risk of cross-contamination between agents',
        location: 'memory.type',
        remediation:
          'Isolate agent memory or implement strict access controls for shared memory',
        confidence: 'medium',
      });
    }

    return findings;
  },
};
