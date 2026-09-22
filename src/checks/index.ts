import type { Check } from '../core/check.js';
import { asi01GoalHijack } from './asi01-goal-hijack.js';
import { asi02ToolMisuse } from './asi02-tool-misuse.js';
import { asi03IdentityPrivilege } from './asi03-identity-privilege.js';
import { asi04SupplyChain } from './asi04-supply-chain.js';
import { asi05CodeExecution } from './asi05-code-execution.js';
import { asi06MemoryPoisoning } from './asi06-memory-poisoning.js';
import { asi07InterAgentComm } from './asi07-inter-agent-comm.js';
import { asi08CascadingFailures } from './asi08-cascading-failures.js';
import { asi09HumanAgentTrust } from './asi09-human-agent-trust.js';
import { asi10RogueAgents } from './asi10-rogue-agents.js';
import { toxicTriadCheck } from './toxic-triad.js';

export const allChecks: Check[] = [
  asi01GoalHijack,
  asi02ToolMisuse,
  asi03IdentityPrivilege,
  asi04SupplyChain,
  asi05CodeExecution,
  asi06MemoryPoisoning,
  asi07InterAgentComm,
  asi08CascadingFailures,
  asi09HumanAgentTrust,
  asi10RogueAgents,
  toxicTriadCheck,
];

export {
  asi01GoalHijack,
  asi02ToolMisuse,
  asi03IdentityPrivilege,
  asi04SupplyChain,
  asi05CodeExecution,
  asi06MemoryPoisoning,
  asi07InterAgentComm,
  asi08CascadingFailures,
  asi09HumanAgentTrust,
  asi10RogueAgents,
  toxicTriadCheck,
};
