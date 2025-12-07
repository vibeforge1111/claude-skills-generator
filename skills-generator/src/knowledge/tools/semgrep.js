/**
 * Semgrep Tool Knowledge
 * Fast, open-source static analysis tool
 */

export default {
  key: 'semgrep',
  name: 'Semgrep',
  description: 'Fast, open-source static analysis tool for finding bugs and security issues',
  website: 'https://semgrep.dev',
  installation: 'pip install semgrep',

  capabilities: [
    'Pattern-based code search',
    'Custom rule creation',
    'Multi-language support (30+ languages)',
    'CI/CD integration',
    'OWASP rule support',
    'Taint tracking',
    'Data flow analysis',
  ],

  cliUsage: {
    basic: 'semgrep --config auto .',
    securityAudit: 'semgrep --config p/security-audit .',
    customRules: 'semgrep --config ./rules/ .',
    jsonOutput: 'semgrep --config auto --json .',
    specific: 'semgrep --config p/javascript .',
  },

  outputFormats: ['text', 'json', 'sarif', 'emacs', 'vim', 'gitlab-sast', 'gitlab-secrets'],

  commonRules: [
    { id: 'p/security-audit', description: 'General security rules' },
    { id: 'p/secrets', description: 'Secret detection' },
    { id: 'p/owasp-top-ten', description: 'OWASP Top 10 vulnerabilities' },
    { id: 'p/javascript', description: 'JavaScript-specific rules' },
    { id: 'p/typescript', description: 'TypeScript-specific rules' },
    { id: 'p/python', description: 'Python-specific rules' },
    { id: 'p/golang', description: 'Go-specific rules' },
    { id: 'p/react', description: 'React-specific rules' },
  ],

  integration: {
    requiredMcps: ['filesystem'],
    bashCommands: ['semgrep'],
    outputParsing: 'json',
    ciIntegration: ['GitHub Actions', 'GitLab CI', 'Jenkins', 'CircleCI'],
  },

  errorPatterns: [
    {
      pattern: 'No rules specified',
      solution: 'Add --config flag with ruleset (e.g., --config auto)',
    },
    {
      pattern: 'Invalid pattern',
      solution: 'Check pattern syntax in rule file - use $VAR for metavariables',
    },
    {
      pattern: 'timeout',
      solution: 'Increase timeout with --timeout flag or exclude large files',
    },
    {
      pattern: 'rate limit',
      solution: 'Login with semgrep login for higher limits',
    },
  ],

  trainingContent: {
    essential: [
      'Writing custom Semgrep rules',
      'Understanding pattern matching syntax',
      'Using metavariables ($VAR, $...ARGS)',
      'Integrating with CI/CD pipelines',
    ],
    advanced: [
      'Taint tracking and data flow analysis',
      'Creating organization-specific rulesets',
      'Performance optimization for large codebases',
      'Writing rules for specific vulnerabilities',
    ],
  },

  exampleRule: `rules:
  - id: hardcoded-password
    pattern: password = "$VALUE"
    message: Hardcoded password detected
    severity: ERROR
    languages: [python, javascript]`,

  skillInstructions: `
## Using Semgrep

1. Run a security scan:
   \`\`\`bash
   semgrep --config p/security-audit --json .
   \`\`\`

2. Parse results:
   - Check \`results\` array for findings
   - Each finding has \`path\`, \`start\`, \`end\`, \`extra.message\`
   - Severity levels: ERROR, WARNING, INFO

3. Custom rules:
   - Create \`.semgrep.yml\` in project root
   - Use pattern matching with metavariables
   - Test with \`semgrep --validate\`
`,
};
