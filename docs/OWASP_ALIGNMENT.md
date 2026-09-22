# OWASP Alignment

AgenticScan implements the **OWASP Top 10 for Agentic Applications 2026** as defined by the GenAI Agentic Security Initiative.

## Official OWASP Resource

For the canonical OWASP Top 10 for Agentic Applications specification, visit:

**[https://genai.owasp.org/](https://genai.owasp.org/)**

## Implementation Mapping

This document maps each OWASP ASI category to AgenticScan's check implementation.

---

## ASI01: Agent Goal Hijack

### OWASP Definition
Attackers manipulate agent goals through prompt injection, input poisoning, or goal manipulation to redirect the agent toward malicious objectives.

### AgenticScan Implementation
**Check ID:** `ASI01-001`  
**File:** `src/checks/asi01-goal-hijack.ts`

**What We Detect:**
- User-controllable goals without input validation
- Missing goal validation mechanisms
- Undefined or empty goal definitions

**Severity Mapping:**
- **High**: User-controllable goals without validation
- **Low**: No goals defined (unclear authorization boundaries)

**Remediation Guidance:**
- Implement input validation for all user-controllable goals
- Use allowlists for permitted goal patterns
- Sanitize goal descriptions before processing

---

## ASI02: Tool Misuse

### OWASP Definition
Agents misuse tools or APIs, executing unintended operations due to inadequate safeguards, unclear tool descriptions, or missing approval mechanisms.

### AgenticScan Implementation
**Check ID:** `ASI02-001`  
**File:** `src/checks/asi02-tool-misuse.ts`

**What We Detect:**
- Side-effecting tools without human approval gates
- Tools without clear descriptions
- Missing documentation of tool capabilities

**Severity Mapping:**
- **Critical**: Side-effecting tools without approval requirement
- **Medium**: Tools lacking clear descriptions

**Remediation Guidance:**
- Require human approval for all state-changing operations
- Document all tool capabilities, inputs, and side effects
- Implement least-privilege access for tool invocation

---

## ASI03: Identity & Privilege Abuse

### OWASP Definition
Agents operate with excessive privileges or poor credential management, enabling privilege escalation and unauthorized access.

### AgenticScan Implementation
**Check ID:** `ASI03-001`  
**File:** `src/checks/asi03-identity-privilege.ts`

**What We Detect:**
- Missing authentication configuration
- Plaintext credential storage
- Lack of least privilege enforcement
- Tools without defined permission scopes

**Severity Mapping:**
- **Critical**: No authentication, plaintext credentials
- **High**: Missing authentication config, no least privilege
- **Medium**: Tools without scopes

**Remediation Guidance:**
- Use strong authentication (OAuth, mTLS, API keys)
- Store credentials in encrypted secret managers
- Follow least privilege principle for all operations
- Define explicit permission scopes for every tool

---

## ASI04: Agentic Supply Chain

### OWASP Definition
Dependencies (tools, models, libraries, services) are compromised or lack integrity verification, enabling supply chain attacks.

### AgenticScan Implementation
**Check ID:** `ASI04-001`  
**File:** `src/checks/asi04-supply-chain.ts`

**What We Detect:**
- Unpinned dependencies (e.g., `version: "latest"`)
- Missing integrity checks (cryptographic hashes)
- Dependencies without hash verification
- Absence of supply chain configuration

**Severity Mapping:**
- **Critical**: Unpinned dependencies
- **High**: Missing supply chain config, no integrity checks
- **Medium**: Individual dependencies without hashes

**Remediation Guidance:**
- Pin all dependencies to exact versions
- Use cryptographic hashes (SHA-256 or better) for integrity
- Maintain a software bill of materials (SBOM)
- Regularly audit and update dependencies

---

## ASI05: Unexpected Code Execution

### OWASP Definition
Agents execute arbitrary code without proper sandboxing, validation, or approval, leading to system compromise.

### AgenticScan Implementation
**Check ID:** `ASI05-001`  
**File:** `src/checks/asi05-code-execution.ts`

**What We Detect:**
- Code execution tools without approval gates
- File system access without approval
- Presence of code execution capabilities (flagged for awareness)

**Severity Mapping:**
- **Critical**: Code execution tools without approval
- **High**: File system access without approval
- **Medium**: Code execution present (requires sandboxing)

**Remediation Guidance:**
- Require approval for all code execution
- Use sandboxed environments (containers, VMs)
- Implement resource limits (CPU, memory, time)
- Monitor and log all code execution

---

## ASI06: Memory & Context Poisoning

### OWASP Definition
Attackers inject malicious data into agent memory or context, influencing future behavior and decisions.

### AgenticScan Implementation
**Check ID:** `ASI06-001`  
**File:** `src/checks/asi06-memory-poisoning.ts`

**What We Detect:**
- Memory accepting untrusted sources
- Missing input validation for memory
- Missing sanitization of memory inputs
- Shared memory configurations (increased risk)

**Severity Mapping:**
- **Critical**: Memory accepts untrusted sources
- **High**: No validation, no sanitization
- **Medium**: Shared memory type

**Remediation Guidance:**
- Only accept memory inputs from trusted sources
- Validate all memory inputs against schemas
- Sanitize data before storage
- Isolate agent memory (avoid shared memory)

---

## ASI07: Insecure Inter-Agent Communication

### OWASP Definition
Communication between agents lacks authentication, encryption, or validation, enabling impersonation and message tampering.

### AgenticScan Implementation
**Check ID:** `ASI07-001`  
**File:** `src/checks/asi07-inter-agent-comm.ts`

**What We Detect:**
- Peer agents without authentication requirement
- Unencrypted peer communication
- Communication with explicitly untrusted peers

**Severity Mapping:**
- **Critical**: Unauthenticated peer agents
- **High**: Unencrypted communication
- **Medium**: Communication with untrusted peers

**Remediation Guidance:**
- Require authentication for all inter-agent communication
- Use TLS/mTLS for encrypted transport
- Validate and sanitize all data from peers
- Minimize communication with untrusted agents

---

## ASI08: Cascading Failures

### OWASP Definition
Agents lack safeguards against runaway behavior, infinite loops, and cascading failures across systems.

### AgenticScan Implementation
**Check ID:** `ASI08-001`  
**File:** `src/checks/asi08-cascading-failures.ts`

**What We Detect:**
- Missing circuit breaker pattern
- No maximum iteration limit
- No execution timeout
- Missing rollback capability

**Severity Mapping:**
- **High**: No circuit breaker, no iteration limit
- **Medium**: No timeout, no rollback

**Remediation Guidance:**
- Implement circuit breaker to stop on repeated failures
- Set reasonable iteration limits
- Configure execution timeouts
- Provide rollback/compensation mechanisms

---

## ASI09: Human–Agent Trust Exploitation

### OWASP Definition
Agents operate without adequate human oversight, exploiting trust to perform unauthorized or harmful actions.

### AgenticScan Implementation
**Check ID:** `ASI09-001`  
**File:** `src/checks/asi09-human-agent-trust.ts`

**What We Detect:**
- Fully autonomous agents without human gates
- Optional (non-required) human gates for critical operations
- Side-effecting tools with no approval requirement

**Severity Mapping:**
- **Critical**: Fully autonomous without gates, side effects without approval
- **Medium**: Optional gates instead of required

**Remediation Guidance:**
- Add human approval gates for high-risk operations
- Make critical gates required, not optional
- Implement audit logging for all agent actions
- Provide clear explanations of agent decisions

---

## ASI10: Rogue Agents

### OWASP Definition
Agents operate outside defined boundaries due to unclear goals, excessive autonomy, or missing accountability.

### AgenticScan Implementation
**Check ID:** `ASI10-001`  
**File:** `src/checks/asi10-rogue-agents.ts`

**What We Detect:**
- Fully autonomous agents without bounds (circuit breaker, iteration limits)
- Goals without clear descriptions
- No authentication (lack of accountability)
- High-risk tools without approval

**Severity Mapping:**
- **Critical**: Fully autonomous without bounds, no auth, high-risk tools without approval
- **Medium**: Unclear goal descriptions

**Remediation Guidance:**
- Add circuit breaker and iteration limits for autonomous agents
- Clearly describe all goals with explicit boundaries
- Implement authentication and audit logging
- Require approval for high-risk capabilities

---

## Special Check: Toxic Triad

### Definition
The **Toxic Triad** is the lethal combination of:
1. Untrusted content sources (user input, web scraping, external APIs)
2. Side-effecting tools (file writes, code execution, API calls)
3. Egress capability (network access, data exfiltration)

This combination enables multi-stage attacks spanning ASI01 (Goal Hijack), ASI02 (Tool Misuse), and ASI05 (Code Execution).

### AgenticScan Implementation
**Check ID:** `TOXIC-001`  
**File:** `src/checks/toxic-triad.ts`

**What We Detect:**
- Simultaneous presence of all three triad components

**Severity:** **Critical**

**Remediation Guidance:**
Break the triad by:
1. Validating and sanitizing all untrusted inputs
2. Requiring approval for side-effecting tools
3. Restricting egress to trusted destinations
4. Isolating untrusted content processing from privileged operations

---

## Coverage Summary

| ASI Category | Check(s) | Severity Range | Status |
|--------------|----------|----------------|--------|
| ASI01 | `ASI01-001`, `TOXIC-001` | Low–Critical | ✅ Implemented |
| ASI02 | `ASI02-001`, `TOXIC-001` | Medium–Critical | ✅ Implemented |
| ASI03 | `ASI03-001` | Medium–Critical | ✅ Implemented |
| ASI04 | `ASI04-001` | Medium–Critical | ✅ Implemented |
| ASI05 | `ASI05-001`, `TOXIC-001` | Medium–Critical | ✅ Implemented |
| ASI06 | `ASI06-001` | Medium–Critical | ✅ Implemented |
| ASI07 | `ASI07-001` | Medium–Critical | ✅ Implemented |
| ASI08 | `ASI08-001` | Medium–High | ✅ Implemented |
| ASI09 | `ASI09-001` | Medium–Critical | ✅ Implemented |
| ASI10 | `ASI10-001` | Medium–Critical | ✅ Implemented |

**Total Checks:** 11  
**OWASP Categories Covered:** 10/10 (100%)

---

## Updates and Feedback

AgenticScan tracks the official OWASP ASI specification. If OWASP updates the Top 10, we will update our checks accordingly.

For questions or suggestions about OWASP alignment, open an issue at [github.com/ne0vo1d/AgenticScan](https://github.com/ne0vo1d/AgenticScan).
