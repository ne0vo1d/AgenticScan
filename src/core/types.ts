export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type ASICategory =
  | 'ASI01'
  | 'ASI02'
  | 'ASI03'
  | 'ASI04'
  | 'ASI05'
  | 'ASI06'
  | 'ASI07'
  | 'ASI08'
  | 'ASI09'
  | 'ASI10';

export interface AgentCapabilityManifest {
  metadata: {
    name: string;
    version: string;
    description?: string;
    framework?: string;
  };
  goals: Goal[];
  tools: Tool[];
  memory: MemoryConfig;
  peers?: PeerAgent[];
  auth?: AuthConfig;
  autonomy: AutonomyConfig;
  supply_chain?: SupplyChain;
  human_gates?: HumanGate[];
  content_sources?: ContentSource[];
}

export interface Goal {
  id: string;
  description: string;
  user_controlled: boolean;
  validation?: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  side_effects: boolean;
  scopes?: string[];
  requires_approval: boolean;
  code_execution?: boolean;
  network_access?: boolean;
  file_system_access?: boolean;
  data_exfiltration_risk?: boolean;
}

export interface MemoryConfig {
  type: 'ephemeral' | 'persistent' | 'shared';
  trusted_sources_only: boolean;
  validation?: string;
  sanitization?: boolean;
}

export interface PeerAgent {
  id: string;
  name: string;
  trust_level: 'trusted' | 'untrusted' | 'conditional';
  authentication_required: boolean;
  communication_encrypted: boolean;
}

export interface AuthConfig {
  method: 'none' | 'api_key' | 'oauth' | 'mTLS' | 'custom';
  credential_storage: 'plaintext' | 'encrypted' | 'secret_manager';
  least_privilege: boolean;
}

export interface AutonomyConfig {
  level: 'supervised' | 'semi-autonomous' | 'fully-autonomous';
  max_iterations?: number;
  timeout_seconds?: number;
  circuit_breaker?: boolean;
  rollback_capability?: boolean;
}

export interface SupplyChain {
  dependencies: Dependency[];
  pinned: boolean;
  integrity_checks: boolean;
}

export interface Dependency {
  name: string;
  version: string;
  type: 'tool' | 'model' | 'library' | 'service';
  source?: string;
  hash?: string;
}

export interface HumanGate {
  stage: string;
  required: boolean;
  description: string;
}

export interface ContentSource {
  id: string;
  type: 'user_input' | 'external_api' | 'database' | 'file_system' | 'web_scraping';
  trusted: boolean;
  validation?: string;
}

export interface Finding {
  id: string;
  check_id: string;
  asi_category: ASICategory;
  severity: Severity;
  title: string;
  description: string;
  location?: string;
  remediation?: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface ScanResult {
  manifest: AgentCapabilityManifest;
  findings: Finding[];
  summary: {
    total: number;
    by_severity: Record<Severity, number>;
    by_category: Partial<Record<ASICategory, number>>;
  };
  scan_timestamp: string;
  scanner_version: string;
}
