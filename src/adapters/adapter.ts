import type { AgentCapabilityManifest } from '../core/types.js';

export interface Adapter {
  name: string;
  load(source: string): Promise<AgentCapabilityManifest>;
}
