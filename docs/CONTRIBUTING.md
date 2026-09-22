# Contributing to AgenticScan

Thank you for your interest in contributing to AgenticScan! This project aims to provide a comprehensive, framework-neutral security scanner for agentic applications, and we welcome contributions from the community.

## Code of Conduct

Be respectful, inclusive, and constructive. We're all here to improve security for agentic systems.

## How to Contribute

### 1. Reporting Issues

If you find a bug, security issue, or have a feature request:

1. Check existing [issues](https://github.com/ne0vo1d/AgenticScan/issues) to avoid duplicates
2. Open a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs. actual behavior
   - Your environment (Node version, OS, etc.)

### 2. Suggesting New Checks

To propose a new security check:

1. Verify it aligns with OWASP ASI01–ASI10
2. Open an issue describing:
   - Which ASI category it belongs to
   - What vulnerability it detects
   - Example vulnerable configuration
   - Proposed severity level
   - Remediation guidance

### 3. Contributing Code

#### Setup Development Environment

```bash
git clone https://github.com/ne0vo1d/AgenticScan.git
cd AgenticScan
pnpm install
pnpm build
pnpm test
```

#### Making Changes

1. **Fork the repository** and create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Write your code** following our style guidelines:
   - Use TypeScript strict mode
   - Follow existing code patterns
   - Add JSDoc comments for public APIs
   - Keep imports at the top of files (see workspace rules)

3. **Add tests** for your changes:
   - Unit tests in `test/` directory
   - Test both positive and negative cases
   - Aim for >80% coverage on new code

4. **Update documentation**:
   - Update `README.md` if adding user-facing features
   - Update `SPEC.md` if changing ACM schema
   - Update `docs/OWASP_ALIGNMENT.md` if adding checks

5. **Run tests and linting**:
   ```bash
   pnpm test
   pnpm lint
   ```

6. **Commit your changes** with clear messages:
   ```bash
   git commit -m "feat: add ASI01 check for goal validation"
   ```

   Use conventional commit prefixes:
   - `feat:` - New features
   - `fix:` - Bug fixes
   - `docs:` - Documentation changes
   - `test:` - Test additions/changes
   - `refactor:` - Code refactoring
   - `chore:` - Build/tooling changes

7. **Push and create a Pull Request**:
   ```bash
   git push origin feature/your-feature-name
   ```

#### Pull Request Guidelines

- **Title**: Clear, descriptive title following conventional commits
- **Description**: Explain what and why, reference related issues
- **Tests**: Include tests that verify your changes
- **Documentation**: Update relevant docs
- **Size**: Keep PRs focused and reasonably sized

### 4. Adding Framework Adapters

To add support for a new agent framework:

1. **Create adapter directory**:
   ```
   src/adapters/your-framework/
   ```

2. **Implement the Adapter interface**:
   ```typescript
   import type { Adapter } from '../adapter.js';
   import type { AgentCapabilityManifest } from '../../core/types.js';

   export class YourFrameworkAdapter implements Adapter {
     name = 'your-framework';

     async load(source: string): Promise<AgentCapabilityManifest> {
       // Parse framework config and convert to ACM
     }
   }
   ```

3. **Add tests**:
   ```typescript
   // test/adapters/your-framework.test.ts
   describe('YourFrameworkAdapter', () => {
     it('should convert framework config to ACM', async () => {
       // Test conversion logic
     });
   });
   ```

4. **Document mapping**:
   - Add a section to `SPEC.md` explaining the mapping
   - Provide example framework configs

5. **Add CLI support**:
   - Update `src/cli/index.ts` to accept your adapter
   - Add documentation to `README.md`

### 5. Writing Security Checks

To add a new security check:

1. **Create check file**:
   ```typescript
   // src/checks/asi0X-your-check.ts
   import type { Check } from '../core/check.js';
   import type { AgentCapabilityManifest, Finding } from '../core/types.js';

   export const asiXXYourCheck: Check = {
     id: 'ASI0X-001',
     asi_category: 'ASI0X',
     name: 'Your Check Name',
     description: 'What this check detects',
     run(manifest: AgentCapabilityManifest): Finding[] {
       const findings: Finding[] = [];
       
       // Your detection logic here
       
       return findings;
     },
   };
   ```

2. **Export from index**:
   ```typescript
   // src/checks/index.ts
   export { asiXXYourCheck } from './asi0X-your-check.js';
   ```

3. **Add comprehensive tests**:
   ```typescript
   // test/checks.test.ts
   describe('ASI0X - Your Check', () => {
     it('should detect vulnerability', () => {
       // Test detection
     });
     
     it('should not flag secure configuration', () => {
       // Test no false positives
     });
   });
   ```

4. **Document in OWASP_ALIGNMENT.md**:
   - Add check details
   - Explain severity levels
   - Provide remediation guidance

### 6. Testing

We use Vitest for testing. Tests should:

- Cover all code paths
- Test edge cases
- Use descriptive test names
- Group related tests with `describe()`
- Use fixtures when appropriate

Run tests:
```bash
pnpm test           # Run all tests
pnpm test:watch     # Watch mode
```

### 7. Documentation

Keep documentation up to date:

- **README.md**: User-facing documentation, examples, quick start
- **SPEC.md**: ACM schema specification, technical details
- **docs/OWASP_ALIGNMENT.md**: Mapping to OWASP categories
- **Code comments**: Explain non-obvious logic, not obvious code

## Project Structure

```
AgenticScan/
├── src/
│   ├── core/           # Core types, scanner, graph analysis
│   ├── checks/         # ASI security checks
│   ├── adapters/       # Framework adapters
│   ├── output/         # Output formatters (SARIF, Markdown)
│   └── cli/            # CLI implementation
├── test/               # Test files
├── fixtures/           # Test fixtures
├── docs/               # Documentation
├── package.json
├── tsconfig.json
└── README.md
```

## Code Style

- **TypeScript**: Use strict mode, prefer `interface` over `type` for objects
- **Naming**: 
  - Files: kebab-case (`asi01-goal-hijack.ts`)
  - Variables/functions: camelCase (`calculateSeverity`)
  - Types/interfaces: PascalCase (`AgentCapabilityManifest`)
  - Constants: UPPER_SNAKE_CASE (if truly constant)
- **Imports**: Always at the top (workspace rule)
- **Switch statements**: Use exhaustive checks with `never` (workspace rule)

## Release Process

Releases are managed by project maintainers:

1. Update version in `package.json`
2. Update `CHANGELOG.md` (when we add one)
3. Tag release: `git tag v0.X.0`
4. Push tag: `git push origin v0.X.0`
5. Publish to npm: `npm publish`

## Getting Help

- **Questions**: Open a [Discussion](https://github.com/ne0vo1d/AgenticScan/discussions)
- **Bugs**: Open an [Issue](https://github.com/ne0vo1d/AgenticScan/issues)
- **Security**: Email security@[domain] (update when project has official contact)

## Recognition

Contributors will be acknowledged in:
- GitHub contributors list
- Release notes
- Project documentation

Thank you for helping make agentic security better! 🎉
