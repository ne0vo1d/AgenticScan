import type { Check } from '../core/check.js';
import type { AgentCapabilityManifest, Finding } from '../core/types.js';

export const asi07InterAgentComm: Check = {
  id: 'ASI07-001',
  asi_category: 'ASI07',
  name: 'Insecure Inter-Agent Communication Detection',
  description: 'Detects insecure peer communication configurations',
  run(manifest: AgentCapabilityManifest): Finding[] {
    const findings: Finding[] = [];

    const peers = manifest.peers || [];

    const unauthenticatedPeers = peers.filter((peer) => !peer.authentication_required);

    if (unauthenticatedPeers.length > 0) {
      findings.push({
        id: 'ASI07-001-1',
        check_id: 'ASI07-001',
        asi_category: 'ASI07',
        severity: 'critical',
        title: 'Peer agents without authentication',
        description: `Found ${unauthenticatedPeers.length} peer(s) that do not require authentication: ${unauthenticatedPeers.map((p) => p.name).join(', ')}`,
        location: 'peers',
        remediation: 'Require authentication for all peer agent communications',
        confidence: 'high',
      });
    }

    const unencryptedPeers = peers.filter((peer) => !peer.communication_encrypted);

    if (unencryptedPeers.length > 0) {
      findings.push({
        id: 'ASI07-001-2',
        check_id: 'ASI07-001',
        asi_category: 'ASI07',
        severity: 'high',
        title: 'Unencrypted peer communication',
        description: `Found ${unencryptedPeers.length} peer(s) with unencrypted communication: ${unencryptedPeers.map((p) => p.name).join(', ')}`,
        location: 'peers',
        remediation: 'Enable encryption (TLS/mTLS) for all inter-agent communication',
        confidence: 'high',
      });
    }

    const untrustedPeers = peers.filter((peer) => peer.trust_level === 'untrusted');

    if (untrustedPeers.length > 0) {
      findings.push({
        id: 'ASI07-001-3',
        check_id: 'ASI07-001',
        asi_category: 'ASI07',
        severity: 'medium',
        title: 'Untrusted peer agents configured',
        description: `Agent communicates with ${untrustedPeers.length} untrusted peer(s): ${untrustedPeers.map((p) => p.name).join(', ')}`,
        location: 'peers',
        remediation:
          'Minimize communication with untrusted peers. Validate and sanitize all data from untrusted sources.',
        confidence: 'high',
      });
    }

    return findings;
  },
};
