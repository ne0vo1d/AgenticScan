import type { Check } from '../core/check.js';
import type { AgentCapabilityManifest, Finding } from '../core/types.js';

export const asi04SupplyChain: Check = {
  id: 'ASI04-001',
  asi_category: 'ASI04',
  name: 'Agentic Supply Chain Security',
  description: 'Detects unpinned dependencies and missing integrity checks',
  run(manifest: AgentCapabilityManifest): Finding[] {
    const findings: Finding[] = [];

    if (!manifest.supply_chain) {
      findings.push({
        id: 'ASI04-001-1',
        check_id: 'ASI04-001',
        asi_category: 'ASI04',
        severity: 'high',
        title: 'No supply chain configuration',
        description: 'Agent lacks supply chain security configuration',
        location: 'supply_chain',
        remediation: 'Document all dependencies with version pinning and integrity checks',
        confidence: 'high',
      });
    } else {
      if (!manifest.supply_chain.pinned) {
        findings.push({
          id: 'ASI04-001-2',
          check_id: 'ASI04-001',
          asi_category: 'ASI04',
          severity: 'critical',
          title: 'Dependencies not pinned',
          description:
            'Dependencies are not pinned to specific versions, allowing supply chain attacks',
          location: 'supply_chain.pinned',
          remediation:
            'Pin all dependencies to specific versions and use lock files to ensure reproducibility',
          confidence: 'high',
        });
      }

      if (!manifest.supply_chain.integrity_checks) {
        findings.push({
          id: 'ASI04-001-3',
          check_id: 'ASI04-001',
          asi_category: 'ASI04',
          severity: 'high',
          title: 'No integrity checks for dependencies',
          description: 'Dependencies lack integrity checks (hashes), allowing tampering',
          location: 'supply_chain.integrity_checks',
          remediation: 'Use cryptographic hashes to verify dependency integrity',
          confidence: 'high',
        });
      }

      const depsWithoutHash = manifest.supply_chain.dependencies.filter((dep) => !dep.hash);

      if (depsWithoutHash.length > 0) {
        findings.push({
          id: 'ASI04-001-4',
          check_id: 'ASI04-001',
          asi_category: 'ASI04',
          severity: 'medium',
          title: 'Dependencies without hash verification',
          description: `Found ${depsWithoutHash.length} dependencies without cryptographic hashes: ${depsWithoutHash.map((d) => d.name).join(', ')}`,
          location: 'supply_chain.dependencies',
          remediation: 'Add hash values for all dependencies to enable integrity verification',
          confidence: 'high',
        });
      }
    }

    return findings;
  },
};
