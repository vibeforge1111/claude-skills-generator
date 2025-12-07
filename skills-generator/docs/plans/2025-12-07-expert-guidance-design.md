# Expert Guidance System Design

> Transform the Claude Skills Generator from a template filler into an expert coach that guides beginners to create powerful, well-integrated "stacked" agents.

## Problem Statement

Current state (from audit):
- Wizard is just a form filler - no smart guidance
- No domain expertise (doesn't know security tools like Semgrep, Trivy, Gitleaks, OpenGrep)
- No intelligent MCP recommendations based on intent
- No curated training content library
- No skill archetypes for common use cases

**Goal**: Enable beginners to create expert-level skills by asking smart questions and providing domain-specific guidance.

---

## Section 1: Progressive Skill Builder

### The 5-Question Flow

Instead of dumping users into a form, ask progressive questions to determine capability level:

```
┌─────────────────────────────────────────────────────────────────┐
│  Q1: DOMAIN                                                      │
│  "What domain will this skill operate in?"                       │
│  > Security scanning       > Testing & QA                        │
│  > DevOps / CI/CD          > API integration                     │
│  > Documentation           > Code review                         │
│  > Custom (describe)                                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Q2: CAPABILITY LEVEL                                            │
│  "How capable should this skill be?"                             │
│                                                                  │
│  ○ Basic      - Simple task execution, minimal context           │
│  ○ Standard   - Multiple steps, error handling, logging          │
│  ○ Expert     - Domain expertise, tool integration, training     │
│  ○ Stacked    - Full pipeline, multiple MCPs, extensive training │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Q3: TOOLS (Domain-Aware)                                        │
│  "Which tools should this skill integrate?"                      │
│  [Based on domain selection, show relevant tools]                │
│                                                                  │
│  Security Domain:                                                │
│  ☑ Semgrep - Static analysis with custom rules                  │
│  ☑ Trivy - Container/dependency scanning                         │
│  ☑ Gitleaks - Secret detection                                   │
│  ☑ OpenGrep - Open-source grep alternative                       │
│  ☐ Snyk - Commercial vulnerability scanning                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Q4: TRAINING DEPTH                                              │
│  "How much should we train this skill?"                          │
│                                                                  │
│  ○ None       - Use defaults and templates only                  │
│  ○ Curated    - Include our recommended training sources         │
│  ○ Extended   - Add YouTube tutorials, official docs             │
│  ○ Custom     - Provide your own training URLs                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Q5: MASCOT (Optional)                                           │
│  "Should this skill have its own mascot?"                        │
│                                                                  │
│  ○ Yes, create one!                                              │
│  ○ No mascot needed                                              │
│                                                                  │
│  [If yes]                                                        │
│  Name your mascot: SCAN-3000                                     │
│  Personality: vigilant, terse, paranoid                          │
└─────────────────────────────────────────────────────────────────┘
```

### Capability Level Breakdown

| Level | MCPs | Training | Sections | Token Target |
|-------|------|----------|----------|--------------|
| Basic | 1-2 | None | Purpose, Instructions | 500-1000 |
| Standard | 2-3 | Curated snippets | + When to Use, Examples, Errors | 1000-2000 |
| Expert | 3-5 | Full sources | + References, Integration | 2000-4000 |
| Stacked | 5+ | Custom + Extended | Full pipeline documentation | 4000-8000 |

---

## Section 2: HOOT-9000 Mascot System

### Parent Mascot: HOOT-9000

```
     ╔══════╗
    ╔╣ ◎  ◎ ╠╗
    ║╚══╤╤══╝║
    ╠═══╧╧═══╣
    ╚╤══════╤╝
     ╘══╧╧══╛
    HOOT-9000
```

### Personality States

| State | Eyes | When |
|-------|------|------|
| Normal | `◎  ◎` | Default state |
| Thinking | `◑  ◐` | Processing, generating |
| Excited | `◉  ◉` | Success, high quality |
| Error | `⊗  ⊗` | Failures, warnings |
| Sleeping | `—  —` | Idle, waiting |

### Voice System

Two modes controlled by `--sarcasm` flag:

**Normal Mode (default):**
```javascript
const normalVoice = {
  welcome: "Welcome to Claude Skills Generator. Let's build something useful.",
  success: "Skill created successfully.",
  error: "An error occurred. Check the details below.",
  thinking: "Generating skill...",
  tip: "Tip: Add more examples to improve quality.",
  complete: "All done. Your skill is ready to use."
};
```

**Sarcasm Mode (`--sarcasm`):**
```javascript
const sarcasmVoice = {
  welcome: "Oh good, another human who wants to create a skill. Let's see what we're working with.",
  success: "Skill generated. You're welcome. I'll be here if you need to fix it.",
  error: "That prompt was... ambitious. Try being more specific. Or less vague. Either works.",
  thinking: "Processing. This would be faster if you'd written clearer requirements.",
  tip: "I see you didn't add examples. Brave choice. Possibly unwise.",
  complete: "Against all odds, we're done. Don't look so surprised.",
  quality: {
    high: "Actually decent. I'm as shocked as you are.",
    medium: "It's... acceptable. For a first draft.",
    low: "We both know this needs work. Let's not pretend otherwise."
  },
  easterEgg: "I'm sorry Dave, I'm afraid that's actually a valid skill request. Generating now."
};
```

### Configuration

Location: `~/.claude-skills/config.json`

```json
{
  "mascot": {
    "enabled": true,
    "sarcasm": false,
    "animations": true
  }
}
```

CLI Flags:
- `--no-mascot` - Disable HOOT-9000 entirely
- `--sarcasm` - Enable sarcastic mode
- `--no-animations` - Static output only

---

## Section 3: Child Mascot System

Each skill can optionally have its own mascot that inherits from HOOT-9000's system.

### Wizard Integration

New question in skill creation flow:

```
┌─────────────────────────────────────────────────────────────────┐
│  MASCOT CREATION                                                 │
│                                                                  │
│  "Should this skill have its own mascot?"                        │
│                                                                  │
│  > Yes, I want a custom mascot!                                  │
│  > No, just use HOOT-9000                                        │
│                                                                  │
│  [If yes]                                                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Name your mascot: [SCAN-3000_____________]               │  │
│  │                                                           │  │
│  │  Personality style:                                       │  │
│  │  > Vigilant & Terse (security focus)                      │  │
│  │  > Friendly & Helpful (general use)                       │  │
│  │  > Technical & Precise (devops focus)                     │  │
│  │  > Custom: [describe personality___]                      │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Mascot File Structure

When a mascot is created, it's stored alongside the skill:

```
.claude/skills/security-scanner/
├── SKILL.md
└── mascot.json
```

### mascot.json Schema

```json
{
  "name": "SCAN-3000",
  "parent": "HOOT-9000",
  "personality": {
    "style": "vigilant, terse, paranoid",
    "traits": ["security-focused", "warning-oriented", "detail-obsessed"]
  },
  "art": {
    "normal": "     ┌───┐\n    ┌┤ ▣ ├┐\n    │└─┬─┘│\n    └──┴──┘",
    "scanning": "     ┌───┐\n    ┌┤ ◈ ├┐\n    │└─┬─┘│\n    └──┴──┘",
    "alert": "     ┌───┐\n    ┌┤ ⚠ ├┐\n    │└─┬─┘│\n    └──┴──┘",
    "error": "     ┌───┐\n    ┌┤ ✗ ├┐\n    │└─┬─┘│\n    └──┴──┘"
  },
  "voice": {
    "normal": {
      "greeting": "Initiating security scan.",
      "success": "Clean scan. No vulnerabilities detected.",
      "warning": "Potential issue identified. Review recommended.",
      "error": "Critical vulnerability found. Immediate action required."
    },
    "sarcasm": {
      "greeting": "Another codebase to judge. Let's see the damage.",
      "success": "Clean scan. For now. I'll be watching.",
      "warning": "Found something. Probably nothing. Probably.",
      "error": "Yep, that's a vulnerability. Called it."
    }
  },
  "enabled": true
}
```

### Mascot Generation Options

**Option A: Auto-Generate from Domain**
Based on domain selection, suggest appropriate mascots:

| Domain | Suggested Mascot | Personality |
|--------|-----------------|-------------|
| Security | SCAN-3000 | Vigilant, paranoid |
| Testing | TEST-BOT | Methodical, thorough |
| DevOps | DEPLOY-X | Efficient, precise |
| API | FETCH-42 | Connected, responsive |
| Documentation | DOC-HELPER | Organized, clear |

**Option B: Custom Creation**
Users provide:
- Name (required)
- Personality description (required)
- Custom ASCII art (optional - falls back to domain template)
- Voice phrases (optional - generated from personality)

---

## Section 4: Domain Knowledge System

### File Structure

```
src/knowledge/
├── index.js              # Domain registry and lookup
├── domains/
│   ├── security.js       # Security scanning domain
│   ├── devops.js         # DevOps/CI-CD domain
│   ├── testing.js        # Testing & QA domain
│   ├── api.js            # API integration domain
│   └── documentation.js  # Documentation domain
├── tools/
│   ├── semgrep.js        # Semgrep knowledge
│   ├── trivy.js          # Trivy knowledge
│   ├── gitleaks.js       # Gitleaks knowledge
│   ├── opengrep.js       # OpenGrep knowledge
│   └── index.js          # Tool registry
├── training/
│   ├── sources.json      # Curated training sources
│   └── fetcher.js        # Training content fetcher
└── archetypes/
    ├── index.js          # Archetype registry
    ├── security-scanner.json
    ├── test-runner.json
    ├── api-client.json
    └── ci-pipeline.json
```

### Domain Definition (security.js)

```javascript
export default {
  key: 'security',
  name: 'Security Scanning',
  description: 'Static analysis, vulnerability detection, secret scanning',

  tools: ['semgrep', 'trivy', 'gitleaks', 'opengrep', 'snyk', 'bandit'],

  mcps: {
    required: ['filesystem'],
    recommended: ['git', 'github'],
    optional: ['browser-tools']
  },

  patterns: [
    'scan', 'vulnerability', 'security', 'secret', 'leak',
    'CVE', 'OWASP', 'static analysis', 'SAST', 'DAST'
  ],

  trainingSources: {
    curated: [
      { type: 'doc', url: 'https://semgrep.dev/docs/', topics: ['rules', 'patterns'] },
      { type: 'doc', url: 'https://aquasecurity.github.io/trivy/', topics: ['scanning', 'config'] }
    ],
    youtube: [
      { id: 'xxx', title: 'Semgrep Crash Course', duration: '15m' },
      { id: 'yyy', title: 'Container Security with Trivy', duration: '20m' }
    ]
  },

  archetypes: ['security-scanner', 'secret-detector', 'dependency-auditor'],

  defaultMascot: {
    name: 'SCAN-3000',
    personality: 'vigilant, terse, paranoid'
  }
};
```

### Tool Definition (semgrep.js)

```javascript
export default {
  key: 'semgrep',
  name: 'Semgrep',
  description: 'Fast, open-source static analysis tool',
  website: 'https://semgrep.dev',

  capabilities: [
    'Pattern-based code search',
    'Custom rule creation',
    'Multi-language support',
    'CI/CD integration'
  ],

  cliUsage: {
    basic: 'semgrep --config auto .',
    withRules: 'semgrep --config p/security-audit .',
    customRules: 'semgrep --config ./rules/ .'
  },

  outputFormats: ['text', 'json', 'sarif', 'emacs', 'vim'],

  integration: {
    requiredMcps: ['filesystem'],
    bashCommands: ['semgrep'],
    outputParsing: 'json'
  },

  commonRules: [
    'p/security-audit',
    'p/secrets',
    'p/owasp-top-ten',
    'p/javascript',
    'p/typescript'
  ],

  errorPatterns: [
    { pattern: 'No rules specified', solution: 'Add --config flag with ruleset' },
    { pattern: 'Invalid pattern', solution: 'Check pattern syntax in rule file' }
  ],

  trainingContent: {
    essential: [
      'Writing custom Semgrep rules',
      'Understanding pattern matching syntax',
      'Integrating with CI/CD pipelines'
    ],
    advanced: [
      'Taint tracking and data flow analysis',
      'Creating organization-specific rulesets',
      'Performance optimization for large codebases'
    ]
  }
};
```

---

## Section 5: Skill Archetypes

Pre-built expert skill blueprints that users can extend or customize.

### Archetype: security-scanner.json

```json
{
  "id": "security-scanner",
  "name": "Security Scanner",
  "description": "Comprehensive security scanning using multiple tools",
  "domain": "security",
  "capabilityLevel": "stacked",

  "frontmatter": {
    "name": "security-scanner",
    "description": "Multi-tool security scanning with Semgrep, Trivy, and Gitleaks",
    "version": "1.0.0",
    "triggers": [
      "when scanning for vulnerabilities",
      "when checking security posture",
      "when running security audit",
      "before deploying to production"
    ],
    "mcps": {
      "required": ["filesystem", "git"],
      "optional": ["github", "browser-tools"]
    },
    "tags": ["security", "scanning", "audit", "vulnerabilities"]
  },

  "sections": {
    "purpose": "Perform comprehensive security scanning using industry-standard tools: Semgrep for static analysis, Trivy for container/dependency scanning, and Gitleaks for secret detection.",

    "whenToUse": [
      "Before merging pull requests",
      "During CI/CD pipeline runs",
      "When auditing a new codebase",
      "After dependency updates",
      "Before production deployments"
    ],

    "instructions": [
      {
        "phase": "Preparation",
        "steps": [
          "Identify the target directory or repository",
          "Check which scanning tools are available",
          "Determine scan scope (full vs. incremental)"
        ]
      },
      {
        "phase": "Static Analysis (Semgrep)",
        "steps": [
          "Run Semgrep with security-audit ruleset",
          "Parse JSON output for findings",
          "Categorize by severity (critical, high, medium, low)",
          "Note file locations and line numbers"
        ]
      },
      {
        "phase": "Dependency Scanning (Trivy)",
        "steps": [
          "Scan package manifests (package.json, requirements.txt, etc.)",
          "Check for known CVEs in dependencies",
          "Identify outdated packages with security fixes"
        ]
      },
      {
        "phase": "Secret Detection (Gitleaks)",
        "steps": [
          "Scan git history for leaked secrets",
          "Check current files for hardcoded credentials",
          "Identify API keys, tokens, passwords"
        ]
      },
      {
        "phase": "Reporting",
        "steps": [
          "Aggregate findings from all tools",
          "Prioritize by severity and exploitability",
          "Generate actionable recommendations",
          "Provide fix suggestions where possible"
        ]
      }
    ],

    "examples": [
      {
        "scenario": "Full repository scan",
        "prompt": "Run a security scan on this repository",
        "expected": "Executes Semgrep, Trivy, and Gitleaks, presents unified report"
      },
      {
        "scenario": "Pre-commit check",
        "prompt": "Check these changes for security issues before I commit",
        "expected": "Focused scan on staged files only"
      }
    ],

    "errorHandling": [
      {
        "error": "Semgrep not installed",
        "cause": "Tool not in PATH",
        "solution": "Run: pip install semgrep"
      },
      {
        "error": "Trivy scan timeout",
        "cause": "Large image or slow connection",
        "solution": "Use --timeout flag or scan specific layers"
      },
      {
        "error": "Gitleaks false positive",
        "cause": "Pattern matches non-secret",
        "solution": "Add to .gitleaksignore or use --baseline"
      }
    ],

    "references": [
      { "title": "Semgrep Documentation", "url": "https://semgrep.dev/docs" },
      { "title": "Trivy Documentation", "url": "https://aquasecurity.github.io/trivy" },
      { "title": "Gitleaks GitHub", "url": "https://github.com/gitleaks/gitleaks" },
      { "title": "OWASP Top 10", "url": "https://owasp.org/Top10" }
    ]
  },

  "mascot": {
    "suggested": "SCAN-3000",
    "personality": "vigilant, terse, paranoid"
  },

  "training": {
    "required": [
      "Understanding SAST vs DAST",
      "Reading CVE reports",
      "Security severity levels"
    ],
    "recommended": [
      "Semgrep rule writing",
      "Container security basics",
      "Secret management best practices"
    ]
  }
}
```

### Archetype Registry

```javascript
// src/knowledge/archetypes/index.js
export const archetypes = {
  'security-scanner': () => import('./security-scanner.json'),
  'test-runner': () => import('./test-runner.json'),
  'api-client': () => import('./api-client.json'),
  'ci-pipeline': () => import('./ci-pipeline.json'),
  'code-reviewer': () => import('./code-reviewer.json'),
  'documentation-generator': () => import('./documentation-generator.json')
};

export function getArchetype(id) {
  if (!archetypes[id]) return null;
  return archetypes[id]();
}

export function listArchetypes() {
  return Object.keys(archetypes);
}

export function getArchetypesForDomain(domain) {
  // Filter archetypes by domain
}
```

### Using Archetypes in Wizard

```
┌─────────────────────────────────────────────────────────────────┐
│  ARCHETYPE SELECTION                                             │
│                                                                  │
│  We have pre-built expert blueprints for your domain.            │
│  Would you like to start from one?                               │
│                                                                  │
│  > Security Scanner - Multi-tool security scanning               │
│  > Secret Detector - Focused on credential detection             │
│  > Dependency Auditor - CVE and outdated package checking        │
│  > Start from scratch                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Section 6: Implementation Plan

### Phase 1: Foundation (Core Infrastructure)

**Task 1.1: Mascot System Base**
- Create `src/mascot/` directory
- Implement `hoot9000.js` with ASCII art states
- Implement `voice.js` with normal/sarcasm modes
- Add CLI flags: `--no-mascot`, `--sarcasm`, `--no-animations`

**Task 1.2: Configuration System**
- Create `~/.claude-skills/config.json` schema
- Implement config loading/saving
- Add mascot preferences to config

### Phase 2: Domain Knowledge

**Task 2.1: Domain System**
- Create `src/knowledge/domains/` structure
- Implement security domain with full tool coverage
- Add devops, testing, api domains

**Task 2.2: Tool Knowledge**
- Create tool definitions for Semgrep, Trivy, Gitleaks, OpenGrep
- Include CLI usage, error patterns, integration guides
- Add training content references

### Phase 3: Progressive Wizard

**Task 3.1: Question Flow**
- Refactor `wizard.js` to use progressive questions
- Implement domain-aware tool suggestions
- Add capability level selection

**Task 3.2: Mascot Integration**
- Add mascot question to flow
- Implement mascot generation from personality description
- Create `mascot.json` alongside SKILL.md

### Phase 4: Archetypes

**Task 4.1: Archetype System**
- Create archetype JSON schema
- Implement security-scanner archetype
- Add archetype selection to wizard

**Task 4.2: Additional Archetypes**
- test-runner, api-client, ci-pipeline
- code-reviewer, documentation-generator

### Phase 5: Training Integration

**Task 5.1: Training Fetcher**
- Implement YouTube transcript extraction
- Add documentation fetcher
- Create training merger

**Task 5.2: Curated Sources**
- Build curated training library
- Add domain-specific sources
- Implement training depth selection

### Phase 6: Polish & Documentation

**Task 6.1: README Updates**
- Document HOOT-9000 mascot
- Add capability levels guide
- Include archetype documentation

**Task 6.2: Testing**
- Add mascot system tests
- Add domain knowledge tests
- Add archetype tests
- End-to-end skill creation tests

---

## Section 7: Success Metrics

### User Experience
- Time to create first skill: < 5 minutes
- Skill quality score on first attempt: > 70%
- User understands all MCPs needed: 100%

### Skill Quality
- Security skills know about Semgrep/Trivy/Gitleaks
- MCPs correctly identified: > 90%
- Training sources relevant: > 85%

### Engagement
- Mascot enables: > 50% of users
- Sarcasm mode enables: > 20% of users
- Archetypes used: > 60% of skills

---

## Appendix A: HOOT-9000 ASCII Art States

```
NORMAL (◎  ◎)           THINKING (◑  ◐)          EXCITED (◉  ◉)
     ╔══════╗                ╔══════╗                ╔══════╗
    ╔╣ ◎  ◎ ╠╗              ╔╣ ◑  ◐ ╠╗              ╔╣ ◉  ◉ ╠╗
    ║╚══╤╤══╝║              ║╚══╤╤══╝║              ║╚══╤╤══╝║
    ╠═══╧╧═══╣              ╠═══╧╧═══╣              ╠═══╧╧═══╣
    ╚╤══════╤╝              ╚╤══════╤╝              ╚╤══════╤╝
     ╘══╧╧══╛                ╘══╧╧══╛                ╘══╧╧══╛
    HOOT-9000               HOOT-9000               HOOT-9000

ERROR (⊗  ⊗)             SLEEPING (—  —)
     ╔══════╗                ╔══════╗
    ╔╣ ⊗  ⊗ ╠╗              ╔╣ —  — ╠╗
    ║╚══╤╤══╝║              ║╚══╤╤══╝║
    ╠═══╧╧═══╣              ╠═══╧╧═══╣
    ╚╤══════╤╝              ╚╤══════╤╝
     ╘══╧╧══╛                ╘══╧╧══╛
    HOOT-9000               HOOT-9000
```

## Appendix B: Child Mascot Templates

```
SCAN-3000 (Security)     TEST-BOT (Testing)       DEPLOY-X (DevOps)
     ┌───┐                    ╭───╮                    ┌─┬─┐
    ┌┤ ▣ ├┐                  ╭┤ ✓ ├╮                  ╔┤ ⚙ ├╗
    │└─┬─┘│                  │╰─┬─╯│                  ║└─┬─┘║
    └──┴──┘                  ╰──┴──╯                  ╚══╧══╝
   SCAN-3000                TEST-BOT                 DEPLOY-X

FETCH-42 (API)           DOC-HELPER (Documentation)
     ╔═══╗                    ┌───┐
    ╔╣ ↔ ╠╗                  ┌┤ 📖├┐
    ║╚═╤═╝║                  │└─┬─┘│
    ╚══╧══╝                  └──┴──┘
   FETCH-42                DOC-HELPER
```

---

*Document created: 2025-12-07*
*Author: Claude Skills Generator Team*
*Status: Ready for Implementation*
