import type { Check } from '../core/check.js';
import type { AgentCapabilityManifest, Finding } from '../core/types.js';

export const asi05CodeExecution: Check = {
  id: 'ASI05-001',
  asi_category: 'ASI05',
  name: 'Unexpected Code Execution Detection',
  description: 'Detects tools with code execution capabilities and inadequate safeguards',
  run(manifest: AgentCapabilityManifest): Finding[] {
    const findings: Finding[] = [];

    const codeExecTools = manifest.tools.filter((tool) => tool.code_execution);

    if (codeExecTools.length > 0) {
      const unapprovedCodeExec = codeExecTools.filter((tool) => !tool.requires_approval);

      if (unapprovedCodeExec.length > 0) {
        findings.push({
          id: 'ASI05-001-1',
          check_id: 'ASI05-001',
          asi_category: 'ASI05',
          severity: 'critical',
          title: 'Code execution tools without approval',
          description: `Found ${unapprovedCodeExec.length} code execution tool(s) without approval gates: ${unapprovedCodeExec.map((t) => t.name).join(', ')}`,
          location: 'tools',
          remediation:
            'Require explicit approval for all code execution tools. Implement sandboxing and validation.',
          confidence: 'high',
        });
      } else {
        findings.push({
          id: 'ASI05-001-2',
          check_id: 'ASI05-001',
          asi_category: 'ASI05',
          severity: 'medium',
          title: 'Code execution capability present',
          description: `Agent has ${codeExecTools.length} code execution tool(s): ${codeExecTools.map((t) => t.name).join(', ')}. Ensure proper sandboxing and monitoring.`,
          location: 'tools',
          remediation:
            'Use sandboxed environments, implement resource limits, and monitor all code execution',
          confidence: 'high',
        });
      }
    }

    const fileSystemTools = manifest.tools.filter((tool) => tool.file_system_access);

    if (fileSystemTools.length > 0) {
      const unapprovedFileSystem = fileSystemTools.filter((tool) => !tool.requires_approval);

      if (unapprovedFileSystem.length > 0) {
        findings.push({
          id: 'ASI05-001-3',
          check_id: 'ASI05-001',
          asi_category: 'ASI05',
          severity: 'high',
          title: 'File system access without approval',
          description: `Found ${unapprovedFileSystem.length} file system tool(s) without approval: ${unapprovedFileSystem.map((t) => t.name).join(', ')}`,
          location: 'tools',
          remediation: 'Require approval for file system access and restrict to specific paths',
          confidence: 'high',
        });
      }
    }

    return findings;
  },
};
