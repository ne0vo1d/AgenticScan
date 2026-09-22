import type { AgentCapabilityManifest, Finding } from './types.js';

export interface Check {
  id: string;
  asi_category: string;
  name: string;
  description: string;
  run(manifest: AgentCapabilityManifest): Finding[];
}
