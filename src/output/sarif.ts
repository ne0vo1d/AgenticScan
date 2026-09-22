import type { ScanResult, Finding } from '../core/types.js';

export interface SarifLog {
  version: '2.1.0';
  $schema: string;
  runs: SarifRun[];
}

export interface SarifRun {
  tool: {
    driver: {
      name: string;
      version: string;
      informationUri: string;
      rules: SarifRule[];
    };
  };
  results: SarifResult[];
}

export interface SarifRule {
  id: string;
  name: string;
  shortDescription: {
    text: string;
  };
  fullDescription: {
    text: string;
  };
  help: {
    text: string;
  };
  properties: {
    tags: string[];
  };
}

export interface SarifResult {
  ruleId: string;
  level: 'error' | 'warning' | 'note';
  message: {
    text: string;
  };
  locations?: Array<{
    physicalLocation: {
      artifactLocation: {
        uri: string;
      };
    };
  }>;
}

function severityToSarifLevel(severity: string): 'error' | 'warning' | 'note' {
  switch (severity) {
    case 'critical':
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
    case 'info':
      return 'note';
    default:
      return 'note';
  }
}

export function toSarif(result: ScanResult): SarifLog {
  const uniqueCheckIds = new Set(result.findings.map((f) => f.check_id));
  const checkMap = new Map<string, Finding>();

  for (const finding of result.findings) {
    if (!checkMap.has(finding.check_id)) {
      checkMap.set(finding.check_id, finding);
    }
  }

  const rules: SarifRule[] = Array.from(uniqueCheckIds).map((checkId) => {
    const finding = checkMap.get(checkId)!;
    return {
      id: checkId,
      name: finding.title,
      shortDescription: {
        text: finding.title,
      },
      fullDescription: {
        text: finding.description,
      },
      help: {
        text: finding.remediation || 'No remediation provided',
      },
      properties: {
        tags: [finding.asi_category, `severity:${finding.severity}`],
      },
    };
  });

  const results: SarifResult[] = result.findings.map((finding) => ({
    ruleId: finding.check_id,
    level: severityToSarifLevel(finding.severity),
    message: {
      text: finding.description,
    },
    locations: finding.location
      ? [
          {
            physicalLocation: {
              artifactLocation: {
                uri: finding.location,
              },
            },
          },
        ]
      : undefined,
  }));

  return {
    version: '2.1.0',
    $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
    runs: [
      {
        tool: {
          driver: {
            name: 'AgenticScan',
            version: result.scanner_version,
            informationUri: 'https://github.com/ne0vo1d/AgenticScan',
            rules,
          },
        },
        results,
      },
    ],
  };
}
