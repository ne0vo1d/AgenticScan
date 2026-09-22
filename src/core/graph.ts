import type { AgentCapabilityManifest, Tool, ContentSource } from './types.js';

export interface ToxicTriad {
  untrusted_content: ContentSource[];
  side_effecting_tools: Tool[];
  has_egress: boolean;
}

export function detectToxicTriad(manifest: AgentCapabilityManifest): ToxicTriad | null {
  const untrusted_content = (manifest.content_sources || []).filter((cs) => !cs.trusted);
  const side_effecting_tools = manifest.tools.filter((t) => t.side_effects);
  const has_egress = manifest.tools.some(
    (t) => t.network_access || t.data_exfiltration_risk
  );

  if (untrusted_content.length > 0 && side_effecting_tools.length > 0 && has_egress) {
    return {
      untrusted_content,
      side_effecting_tools,
      has_egress,
    };
  }

  return null;
}

export interface PrivilegeMap {
  tools_with_side_effects: string[];
  tools_without_approval: string[];
  high_risk_tools: string[];
}

export function mapPrivileges(manifest: AgentCapabilityManifest): PrivilegeMap {
  const tools_with_side_effects = manifest.tools
    .filter((t) => t.side_effects)
    .map((t) => t.name);

  const tools_without_approval = manifest.tools
    .filter((t) => t.side_effects && !t.requires_approval)
    .map((t) => t.name);

  const high_risk_tools = manifest.tools
    .filter((t) => t.code_execution || t.file_system_access)
    .map((t) => t.name);

  return {
    tools_with_side_effects,
    tools_without_approval,
    high_risk_tools,
  };
}
