/**
 * Security Domain Knowledge
 * Static analysis, vulnerability detection, secret scanning
 */

export default {
  key: 'security',
  name: 'Security Scanning',
  description: 'Static analysis, vulnerability detection, secret scanning',

  tools: ['semgrep', 'trivy', 'gitleaks', 'opengrep', 'snyk', 'bandit', 'gosec', 'brakeman'],

  mcps: {
    required: ['filesystem'],
    recommended: ['git', 'github'],
    optional: ['browser-tools'],
  },

  patterns: [
    'scan',
    'vulnerability',
    'security',
    'secret',
    'leak',
    'CVE',
    'OWASP',
    'static analysis',
    'SAST',
    'DAST',
    'penetration',
    'audit',
    'hardening',
    'compliance',
    'credentials',
    'injection',
    'XSS',
    'CSRF',
  ],

  trainingSources: {
    curated: [
      {
        type: 'doc',
        url: 'https://semgrep.dev/docs/',
        topics: ['rules', 'patterns', 'custom-rules'],
      },
      {
        type: 'doc',
        url: 'https://aquasecurity.github.io/trivy/',
        topics: ['scanning', 'config', 'ci-integration'],
      },
      {
        type: 'doc',
        url: 'https://github.com/gitleaks/gitleaks',
        topics: ['secret-detection', 'baseline', 'custom-rules'],
      },
      {
        type: 'doc',
        url: 'https://owasp.org/Top10/',
        topics: ['vulnerabilities', 'prevention', 'best-practices'],
      },
    ],
    youtube: [
      { id: 'semgrep-intro', title: 'Semgrep Crash Course', duration: '15m' },
      { id: 'trivy-containers', title: 'Container Security with Trivy', duration: '20m' },
      { id: 'gitleaks-setup', title: 'Setting up Gitleaks in CI/CD', duration: '12m' },
    ],
  },

  archetypes: ['security-scanner', 'secret-detector', 'dependency-auditor', 'sast-runner'],

  defaultMascot: {
    name: 'SCAN-3000',
    personality: 'vigilant, terse, paranoid',
  },

  capabilityLevels: {
    basic: {
      tools: ['semgrep'],
      mcps: ['filesystem'],
      training: [],
      description: 'Basic static analysis with Semgrep',
    },
    standard: {
      tools: ['semgrep', 'gitleaks'],
      mcps: ['filesystem', 'git'],
      training: ['semgrep-basics'],
      description: 'Static analysis plus secret detection',
    },
    expert: {
      tools: ['semgrep', 'trivy', 'gitleaks'],
      mcps: ['filesystem', 'git', 'github'],
      training: ['semgrep-advanced', 'container-security'],
      description: 'Full security scanning suite',
    },
    stacked: {
      tools: ['semgrep', 'trivy', 'gitleaks', 'opengrep', 'snyk'],
      mcps: ['filesystem', 'git', 'github', 'browser-tools'],
      training: ['security-full-course'],
      description: 'Enterprise-grade security pipeline',
    },
  },

  commonErrors: [
    {
      pattern: 'No rules specified',
      tool: 'semgrep',
      solution: 'Add --config flag with ruleset (e.g., --config auto or --config p/security-audit)',
    },
    {
      pattern: 'rate limit',
      tool: 'trivy',
      solution: 'Add GITHUB_TOKEN environment variable to increase rate limits',
    },
    {
      pattern: 'no git repository',
      tool: 'gitleaks',
      solution: 'Initialize git or use --no-git flag for file-only scanning',
    },
  ],
};
