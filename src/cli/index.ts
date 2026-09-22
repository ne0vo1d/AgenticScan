#!/usr/bin/env node

import { Command } from 'commander';
import { writeFile } from 'node:fs/promises';
import { allChecks } from '../checks/index.js';
import { ManifestAdapter } from '../adapters/manifest/index.js';
import { createScanResult, hasHighSeverityFindings } from '../core/scanner.js';
import { toSarif } from '../output/sarif.js';
import { toMarkdown } from '../output/markdown.js';

const version = '0.1.0';

const program = new Command();

program
  .name('agenticscan')
  .description('Orchestrator-agnostic security scanner for agentic workloads')
  .version(version);

program
  .command('scan')
  .description('Scan an agent manifest for security issues')
  .requiredOption('--manifest <path>', 'Path to agent capability manifest JSON file')
  .option('--format <format>', 'Output format: json, sarif, markdown', 'json')
  .option('-o, --output <path>', 'Output file path (default: stdout)')
  .action(async (options) => {
    try {
      const adapter = new ManifestAdapter();
      const manifest = await adapter.load(options.manifest);

      const findings = allChecks.flatMap((check) => check.run(manifest));
      const result = createScanResult(manifest, findings, version);

      let output: string;

      switch (options.format) {
        case 'sarif':
          output = JSON.stringify(toSarif(result), null, 2);
          break;
        case 'markdown':
          output = toMarkdown(result);
          break;
        case 'json':
        default:
          output = JSON.stringify(result, null, 2);
          break;
      }

      if (options.output) {
        await writeFile(options.output, output, 'utf-8');
        console.log(`Results written to ${options.output}`);
      } else {
        console.log(output);
      }

      console.error(
        `\n✓ Scan complete: ${result.summary.total} findings (${result.summary.by_severity.critical} critical, ${result.summary.by_severity.high} high)`
      );

      if (hasHighSeverityFindings(result)) {
        process.exit(1);
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program.parse();
