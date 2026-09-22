import { describe, it, expect } from 'vitest';
import { ManifestAdapter } from '../src/adapters/manifest/index.js';
import { readFile } from 'node:fs/promises';

describe('ManifestAdapter', () => {
  it('should load vulnerable fixture', async () => {
    const adapter = new ManifestAdapter();
    const manifest = await adapter.load('fixtures/vulnerable-agent.json');

    expect(manifest.metadata.name).toBe('InsecureAgent');
    expect(manifest.tools.length).toBeGreaterThan(0);
  });

  it('should load secure fixture', async () => {
    const adapter = new ManifestAdapter();
    const manifest = await adapter.load('fixtures/secure-agent.json');

    expect(manifest.metadata.name).toBe('SecureAgent');
    expect(manifest.auth?.method).toBe('mTLS');
  });

  it('should throw on invalid JSON', async () => {
    const adapter = new ManifestAdapter();
    await expect(adapter.load('nonexistent.json')).rejects.toThrow();
  });
});
