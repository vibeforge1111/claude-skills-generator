/**
 * Knowledge System - Minimal Core
 * Grows dynamically as users create skills
 */

// Basic domain definitions - expand over time
const DOMAINS = {
  security: {
    name: 'Security Scanning',
    tools: ['semgrep', 'trivy', 'gitleaks', 'opengrep'],
    mcps: ['filesystem', 'git'],
    mascot: { name: 'SCAN-3000', personality: 'vigilant, terse' },
  },
  testing: {
    name: 'Testing & QA',
    tools: ['vitest', 'jest', 'playwright', 'cypress'],
    mcps: ['filesystem'],
    mascot: { name: 'TEST-BOT', personality: 'methodical, thorough' },
  },
  devops: {
    name: 'DevOps & CI/CD',
    tools: ['docker', 'kubernetes', 'github-actions'],
    mcps: ['filesystem', 'git', 'github'],
    mascot: { name: 'DEPLOY-X', personality: 'efficient, precise' },
  },
  api: {
    name: 'API Integration',
    tools: ['fetch', 'axios', 'graphql'],
    mcps: ['filesystem', 'browser-tools'],
    mascot: { name: 'FETCH-42', personality: 'connected, responsive' },
  },
  documentation: {
    name: 'Documentation',
    tools: ['markdown', 'jsdoc', 'typedoc'],
    mcps: ['filesystem', 'git'],
    mascot: { name: 'DOC-HELPER', personality: 'organized, clear' },
  },
};

const CAPABILITY_LEVELS = {
  basic: { mcpCount: 1, training: 'none', tokenTarget: '500-1000' },
  standard: { mcpCount: 2, training: 'curated', tokenTarget: '1000-2000' },
  expert: { mcpCount: 4, training: 'extended', tokenTarget: '2000-4000' },
  stacked: { mcpCount: 6, training: 'custom', tokenTarget: '4000-8000' },
};

export function listDomains() {
  return Object.entries(DOMAINS).map(([key, d]) => ({
    key,
    name: d.name,
  }));
}

export function getDomain(key) {
  return DOMAINS[key] || null;
}

export function detectDomain(text) {
  const lower = text.toLowerCase();
  if (/security|scan|vulnerab|secret|leak|cve|owasp/i.test(lower)) return 'security';
  if (/test|spec|unit|e2e|coverage|mock/i.test(lower)) return 'testing';
  if (/deploy|ci|cd|docker|kubernetes|pipeline/i.test(lower)) return 'devops';
  if (/api|rest|graphql|endpoint|fetch|request/i.test(lower)) return 'api';
  if (/doc|readme|markdown|guide|tutorial/i.test(lower)) return 'documentation';
  return null;
}

export function getCapabilityLevel(key) {
  return CAPABILITY_LEVELS[key] || CAPABILITY_LEVELS.standard;
}

export function getSuggestedMascot(domain) {
  const d = DOMAINS[domain];
  return d ? d.mascot : { name: 'SKILL-BOT', personality: 'helpful' };
}

export default {
  listDomains,
  getDomain,
  detectDomain,
  getCapabilityLevel,
  getSuggestedMascot,
};
