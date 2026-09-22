# AgenticScan

**Orchestrator-agnostic security scanner for agent / agentic workloads**

AgenticScan implements the [OWASP Top 10 for Agentic Applications 2026](https://genai.owasp.org/) (ASI01–ASI10), providing framework-neutral security scanning for AI agents regardless of their underlying orchestration platform.

**Tagline:** *Scan agent workloads against OWASP ASI01–ASI10 — framework-neutral.*

**OWASP-facing name:** Agentic Application Security Scanner (AASS)

## What It Is

AgenticScan is a static security analyzer for agentic systems that:

- ✅ Implements OWASP ASI01–ASI10 security checks
- ✅ Works with any agent framework (LangChain, LangGraph, CrewAI, AutoGPT, Cursor, custom, etc.)
- ✅ Normalizes agent configurations via Agent Capability Manifest (ACM)
- ✅ Detects toxic flow combinations (e.g., untrusted content + side-effecting tools + egress)
- ✅ Outputs findings in JSON, SARIF 2.1.0, and Markdown formats
- ✅ CI/CD-friendly with non-zero exit codes on high/critical findings

## What It Is Not

AgenticScan does NOT:

- ❌ Define a competing Top 10 taxonomy (we implement OWASP's official list)
- ❌ Perform full LLM red-teaming or prompt injection testing (like Garak)
- ❌ Lock you into a specific agent framework
- ❌ Provide runtime guardrails or execution monitoring

## Quick Start

### Installation

```bash
npm install -g agenticscan
# or
pnpm add -g agenticscan
```

### Usage

```bash
# Scan an agent manifest
agenticscan scan --manifest fixtures/vulnerable-agent.json

# Output as SARIF
agenticscan scan --manifest fixtures/vulnerable-agent.json --format sarif -o results.sarif

# Output as Markdown
agenticscan scan --manifest fixtures/secure-agent.json --format markdown -o report.md
```

### Exit Codes

AgenticScan exits with code `1` if any **high** or **critical** findings are detected, making it perfect for CI/CD pipelines.

## OWASP ASI Mapping

AgenticScan implements all 10 OWASP Agentic Security Initiative categories:

| OWASP ID | Category | AgenticScan Check | Description |
|----------|----------|-------------------|-------------|
| **ASI01** | Agent Goal Hijack | `asi01-goal-hijack` | Detects unvalidated or user-controllable goals |
| **ASI02** | Tool Misuse | `asi02-tool-misuse` | Finds side-effecting tools without approval gates |
| **ASI03** | Identity & Privilege Abuse | `asi03-identity-privilege` | Identifies privilege escalation risks |
| **ASI04** | Agentic Supply Chain | `asi04-supply-chain` | Checks for unpinned dependencies and integrity |
| **ASI05** | Unexpected Code Execution | `asi05-code-execution` | Flags code execution capabilities |
| **ASI06** | Memory & Context Poisoning | `asi06-memory-poisoning` | Detects untrusted memory sources |
| **ASI07** | Insecure Inter-Agent Communication | `asi07-inter-agent-comm` | Finds unauthenticated/unencrypted peer communication |
| **ASI08** | Cascading Failures | `asi08-cascading-failures` | Checks for missing circuit breakers and bounds |
| **ASI09** | Human–Agent Trust Exploitation | `asi09-human-agent-trust` | Identifies missing human oversight gates |
| **ASI10** | Rogue Agents | `asi10-rogue-agents` | Detects agents operating outside defined boundaries |

### Special Checks

- **Toxic Triad Detection** (`TOXIC-001`): Flags the lethal combination of untrusted content sources ∩ side-effecting tools ∩ egress capability

## Agent Capability Manifest (ACM)

AgenticScan uses the **Agent Capability Manifest** schema to normalize agent configurations from any framework. See [SPEC.md](./SPEC.md) for the complete schema definition.

### Example Manifest

```json
{
  "metadata": {
    "name": "MyAgent",
    "version": "1.0.0",
    "framework": "langchain"
  },
  "goals": [
    {
      "id": "goal-1",
      "description": "Process user requests",
      "user_controlled": true,
      "validation": "schema-based"
    }
  ],
  "tools": [
    {
      "id": "tool-1",
      "name": "execute_code",
      "description": "Execute code",
      "side_effects": true,
      "requires_approval": true,
      "code_execution": true
    }
  ],
  "memory": {
    "type": "persistent",
    "trusted_sources_only": true,
    "validation": "strict",
    "sanitization": true
  },
  "auth": {
    "method": "oauth",
    "credential_storage": "secret_manager",
    "least_privilege": true
  },
  "autonomy": {
    "level": "semi-autonomous",
    "max_iterations": 10,
    "circuit_breaker": true
  }
}
```

## Framework Integration

AgenticScan is **orchestrator-agnostic**. In v0, we support direct ACM JSON files via the `manifest` adapter. Future versions will add adapters for:

- MCP (Model Context Protocol)
- LangGraph config files
- CrewAI YAML
- AutoGPT JSON
- Custom framework plugins

To integrate with your framework, implement an adapter that converts your configuration to ACM format.

## Output Formats

### JSON (Default)

```bash
agenticscan scan --manifest agent.json
```

Returns a structured JSON object with findings, severity counts, and ASI category mapping.

### SARIF 2.1.0

```bash
agenticscan scan --manifest agent.json --format sarif -o results.sarif
```

Perfect for GitHub Code Scanning, Azure DevOps, and other tools that consume SARIF.

### Markdown

```bash
agenticscan scan --manifest agent.json --format markdown -o report.md
```

Human-readable report with emoji indicators and remediation guidance.

## Example Output

```
✓ Scan complete: 12 findings (3 critical, 4 high)
```

**Critical findings:**
- Side-effecting tools without approval gates (ASI02)
- Plaintext credential storage (ASI03)
- Toxic Triad detected (ASI01/ASI02/ASI05)

**High findings:**
- No circuit breaker configured (ASI08)
- Memory accepts untrusted sources (ASI06)
- Unpinned dependencies (ASI04)
- Code execution tools without approval (ASI05)

## Development

### Prerequisites

- Node.js 20+
- pnpm (or npm)

### Setup

```bash
git clone https://github.com/ne0vo1d/AgenticScan.git
cd AgenticScan
pnpm install
pnpm build
```

### Run Tests

```bash
pnpm test
```

### Run on Fixtures

```bash
# Vulnerable agent (should produce findings)
pnpm scan -- --manifest fixtures/vulnerable-agent.json

# Secure agent (should be clean)
pnpm scan -- --manifest fixtures/secure-agent.json
```

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines.

This project is intended for open source development and eventual incubation under the OWASP GenAI Agentic Security Initiative.

## Official OWASP Resources

This project implements but does not redefine the OWASP Top 10 for Agentic Applications. For the official specification, visit:

**[https://genai.owasp.org/](https://genai.owasp.org/)**

## License

Apache-2.0 License - see [LICENSE](./LICENSE) for details.

Copyright 2026 Steve Bowpitt

## Maintainer

**Steve Bowpitt** / [@ne0vo1d](https://github.com/ne0vo1d)

---

**OWASP GenAI Agentic Security Initiative**
