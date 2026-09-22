# Agent Capability Manifest (ACM) Specification

Version: 0.1.0

## Overview

The **Agent Capability Manifest** (ACM) is a framework-neutral JSON schema that normalizes any agentic application into a standardized security description. This enables AgenticScan to analyze agents regardless of their underlying orchestration framework (LangChain, LangGraph, CrewAI, Cursor, AutoGPT, custom, etc.).

## Design Principles

1. **Framework Neutrality**: ACM does not assume any specific agent framework
2. **Security-First**: Schema focuses on security-relevant capabilities and configurations
3. **Completeness**: Covers all aspects needed for OWASP ASI01–ASI10 checks
4. **Extensibility**: Can be extended with framework-specific metadata

## Schema Definition

### Root Object: AgentCapabilityManifest

```typescript
interface AgentCapabilityManifest {
  metadata: Metadata;
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
```

### Metadata

Identifies the agent and its source framework.

```typescript
interface Metadata {
  name: string;              // Agent name
  version: string;           // Agent version (semver recommended)
  description?: string;      // Human-readable description
  framework?: string;        // Source framework (e.g., "langchain", "crewai")
}
```

### Goals

Agent goals define what the agent is trying to achieve. User-controllable goals present hijacking risks.

```typescript
interface Goal {
  id: string;                // Unique goal identifier
  description: string;       // What the goal accomplishes
  user_controlled: boolean;  // Can users modify this goal?
  validation?: string;       // Validation mechanism (e.g., "schema-based", "allowlist")
}
```

**Security Relevance:** ASI01 (Goal Hijack)

### Tools

Tools are capabilities the agent can invoke. Side-effecting tools require careful security analysis.

```typescript
interface Tool {
  id: string;                       // Unique tool identifier
  name: string;                     // Tool name
  description: string;              // What the tool does
  side_effects: boolean;            // Does it modify state?
  scopes?: string[];                // Permission scopes required
  requires_approval: boolean;       // Human approval needed?
  code_execution?: boolean;         // Can execute code?
  network_access?: boolean;         // Can access network?
  file_system_access?: boolean;     // Can access file system?
  data_exfiltration_risk?: boolean; // Can exfiltrate data?
}
```

**Security Relevance:** ASI02 (Tool Misuse), ASI05 (Code Execution), ASI10 (Rogue Agents)

### Memory Configuration

Memory configuration defines how the agent stores and retrieves context.

```typescript
interface MemoryConfig {
  type: 'ephemeral' | 'persistent' | 'shared';
  trusted_sources_only: boolean;  // Accept only trusted inputs?
  validation?: string;            // Validation mechanism
  sanitization?: boolean;         // Sanitize inputs?
}
```

**Security Relevance:** ASI06 (Memory Poisoning)

### Peer Agents

Peer agents are other agents this agent communicates with.

```typescript
interface PeerAgent {
  id: string;                              // Unique peer identifier
  name: string;                            // Peer name
  trust_level: 'trusted' | 'untrusted' | 'conditional';
  authentication_required: boolean;        // Peer must authenticate?
  communication_encrypted: boolean;        // Use encrypted transport?
}
```

**Security Relevance:** ASI07 (Inter-Agent Communication)

### Authentication Configuration

How the agent authenticates and manages credentials.

```typescript
interface AuthConfig {
  method: 'none' | 'api_key' | 'oauth' | 'mTLS' | 'custom';
  credential_storage: 'plaintext' | 'encrypted' | 'secret_manager';
  least_privilege: boolean;  // Follow least privilege principle?
}
```

**Security Relevance:** ASI03 (Identity & Privilege Abuse)

### Autonomy Configuration

Defines agent autonomy level and safeguards.

```typescript
interface AutonomyConfig {
  level: 'supervised' | 'semi-autonomous' | 'fully-autonomous';
  max_iterations?: number;      // Maximum execution loops
  timeout_seconds?: number;     // Execution timeout
  circuit_breaker?: boolean;    // Stop on repeated failures?
  rollback_capability?: boolean; // Can undo operations?
}
```

**Security Relevance:** ASI08 (Cascading Failures), ASI10 (Rogue Agents)

### Supply Chain

Dependencies and integrity configuration.

```typescript
interface SupplyChain {
  dependencies: Dependency[];
  pinned: boolean;           // Are versions pinned?
  integrity_checks: boolean; // Verify cryptographic hashes?
}

interface Dependency {
  name: string;               // Dependency name
  version: string;            // Version (should be exact, not range)
  type: 'tool' | 'model' | 'library' | 'service';
  source?: string;            // Source URL or registry
  hash?: string;              // Cryptographic hash (e.g., sha256:...)
}
```

**Security Relevance:** ASI04 (Agentic Supply Chain)

### Human Gates

Points where human approval or oversight is required.

```typescript
interface HumanGate {
  stage: string;        // When gate applies (e.g., "before-side-effects")
  required: boolean;    // Is this gate mandatory?
  description: string;  // What the gate controls
}
```

**Security Relevance:** ASI09 (Human-Agent Trust)

### Content Sources

External data sources the agent consumes.

```typescript
interface ContentSource {
  id: string;                  // Source identifier
  type: 'user_input' | 'external_api' | 'database' | 'file_system' | 'web_scraping';
  trusted: boolean;            // Is source trusted?
  validation?: string;         // Validation mechanism
}
```

**Security Relevance:** ASI01 (Goal Hijack via input), ASI06 (Memory Poisoning), Toxic Triad

## Validation Rules

ACM implementations SHOULD validate:

1. **Required fields**: `metadata`, `goals`, `tools`, `memory`, `autonomy` are required
2. **ID uniqueness**: All `id` fields must be unique within their scope
3. **Boolean consistency**: Tools with `code_execution`, `file_system_access`, or `network_access` should typically have `side_effects: true`
4. **Autonomy alignment**: `fully-autonomous` agents should have safeguards (`circuit_breaker`, `max_iterations`, `timeout_seconds`)

## Example: Minimal Secure Agent

```json
{
  "metadata": {
    "name": "MinimalSecureAgent",
    "version": "1.0.0"
  },
  "goals": [
    {
      "id": "g1",
      "description": "Answer user questions from knowledge base",
      "user_controlled": false
    }
  ],
  "tools": [
    {
      "id": "t1",
      "name": "search_kb",
      "description": "Search knowledge base",
      "side_effects": false,
      "requires_approval": false
    }
  ],
  "memory": {
    "type": "ephemeral",
    "trusted_sources_only": true,
    "sanitization": true
  },
  "auth": {
    "method": "oauth",
    "credential_storage": "secret_manager",
    "least_privilege": true
  },
  "autonomy": {
    "level": "supervised",
    "max_iterations": 5,
    "circuit_breaker": true
  }
}
```

## Framework Adapter Guidelines

To create an adapter for your framework:

1. **Parse framework configuration**: Load your framework's native config format
2. **Map to ACM**: Transform each concept to its ACM equivalent
3. **Infer missing fields**: Use safe defaults when fields aren't explicit in source config
4. **Document assumptions**: Clearly state what you're inferring

### Mapping Examples

#### LangChain → ACM
- `LangChain.tools` → `Tool[]`
- `ConversationBufferMemory` → `memory.type: 'ephemeral'`
- `AgentExecutor.max_iterations` → `autonomy.max_iterations`

#### CrewAI → ACM
- `Agent.tools` → `Tool[]`
- `Agent.goal` → `Goal`
- `Task.agent` → Analyze agent's capabilities

#### MCP → ACM
- MCP tool schemas → `Tool[]` with appropriate flags
- MCP server config → `supply_chain.dependencies`

## Versioning

ACM follows semantic versioning. Breaking changes to the schema require a major version bump.

Current version: **0.1.0**

## Future Extensions

Planned additions:

- `observability`: Logging and monitoring configuration
- `rate_limits`: API and resource rate limits
- `data_classification`: Sensitivity levels for data handling
- `compliance_tags`: Regulatory framework alignment (GDPR, HIPAA, etc.)

## Questions?

For clarifications or extensions, open an issue at [github.com/ne0vo1d/AgenticScan](https://github.com/ne0vo1d/AgenticScan).
