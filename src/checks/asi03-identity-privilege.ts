import type { Check } from '../core/check.js';
import type { AgentCapabilityManifest, Finding } from '../core/types.js';

export const asi03IdentityPrivilege: Check = {
  id: 'ASI03-001',
  asi_category: 'ASI03',
  name: 'Identity & Privilege Abuse Detection',
  description: 'Detects privilege escalation risks and poor credential management',
  run(manifest: AgentCapabilityManifest): Finding[] {
    const findings: Finding[] = [];

    if (!manifest.auth) {
      findings.push({
        id: 'ASI03-001-1',
        check_id: 'ASI03-001',
        asi_category: 'ASI03',
        severity: 'high',
        title: 'No authentication configuration',
        description: 'Agent lacks authentication configuration, risking unauthorized access',
        location: 'auth',
        remediation: 'Define authentication method and credential storage strategy',
        confidence: 'high',
      });
    } else {
      if (manifest.auth.method === 'none') {
        findings.push({
          id: 'ASI03-001-2',
          check_id: 'ASI03-001',
          asi_category: 'ASI03',
          severity: 'critical',
          title: 'No authentication method configured',
          description: 'Agent uses no authentication, allowing unrestricted access',
          location: 'auth.method',
          remediation: 'Implement proper authentication (OAuth, mTLS, or API keys)',
          confidence: 'high',
        });
      }

      if (manifest.auth.credential_storage === 'plaintext') {
        findings.push({
          id: 'ASI03-001-3',
          check_id: 'ASI03-001',
          asi_category: 'ASI03',
          severity: 'critical',
          title: 'Plaintext credential storage',
          description: 'Credentials are stored in plaintext, exposing them to theft',
          location: 'auth.credential_storage',
          remediation: 'Store credentials in encrypted form or use a secret manager',
          confidence: 'high',
        });
      }

      if (!manifest.auth.least_privilege) {
        findings.push({
          id: 'ASI03-001-4',
          check_id: 'ASI03-001',
          asi_category: 'ASI03',
          severity: 'high',
          title: 'Least privilege not enforced',
          description: 'Agent does not follow least privilege principle',
          location: 'auth.least_privilege',
          remediation:
            'Grant only the minimum permissions necessary for each tool and operation',
          confidence: 'high',
        });
      }
    }

    const scopelessTools = manifest.tools.filter((tool) => tool.side_effects && !tool.scopes);

    if (scopelessTools.length > 0) {
      findings.push({
        id: 'ASI03-001-5',
        check_id: 'ASI03-001',
        asi_category: 'ASI03',
        severity: 'medium',
        title: 'Tools without defined scopes',
        description: `Found ${scopelessTools.length} tool(s) with side effects but no defined scopes: ${scopelessTools.map((t) => t.name).join(', ')}`,
        location: 'tools',
        remediation: 'Define explicit permission scopes for all tools',
        confidence: 'high',
      });
    }

    return findings;
  },
};
