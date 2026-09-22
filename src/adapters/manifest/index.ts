import { readFile } from 'node:fs/promises';
import type { Adapter } from '../adapter.js';
import type { AgentCapabilityManifest } from '../../core/types.js';

export class ManifestAdapter implements Adapter {
  name = 'manifest';

  async load(manifestPath: string): Promise<AgentCapabilityManifest> {
    try {
      const content = await readFile(manifestPath, 'utf-8');
      const manifest = JSON.parse(content) as AgentCapabilityManifest;
      return manifest;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to load manifest from ${manifestPath}: ${error.message}`);
      }
      throw error;
    }
  }
}
