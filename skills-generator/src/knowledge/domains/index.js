/**
 * Domain Knowledge Registry
 * Central access point for all domain expertise
 */

import security from './security.js';
import devops from './devops.js';
import testing from './testing.js';
import api from './api.js';
import documentation from './documentation.js';

export const domains = {
  security,
  devops,
  testing,
  api,
  documentation,
};

/**
 * Get domain by key
 */
export function getDomain(key) {
  return domains[key] || null;
}

/**
 * List all domains
 */
export function listDomains() {
  return Object.values(domains).map((d) => ({
    key: d.key,
    name: d.name,
    description: d.description,
  }));
}

/**
 * Detect domain from content/description
 */
export function detectDomain(text) {
  const lowerText = text.toLowerCase();
  const scores = {};

  for (const [key, domain] of Object.entries(domains)) {
    scores[key] = 0;
    for (const pattern of domain.patterns) {
      if (lowerText.includes(pattern.toLowerCase())) {
        scores[key]++;
      }
    }
  }

  // Find highest scoring domain
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (sorted[0][1] > 0) {
    return getDomain(sorted[0][0]);
  }

  return null;
}

/**
 * Get recommended MCPs for a domain and capability level
 */
export function getRecommendedMcps(domainKey, level = 'standard') {
  const domain = getDomain(domainKey);
  if (!domain) return { required: ['filesystem'], recommended: [], optional: [] };

  const levelConfig = domain.capabilityLevels[level];
  if (!levelConfig) return domain.mcps;

  return {
    required: domain.mcps.required,
    recommended: levelConfig.mcps.filter((m) => !domain.mcps.required.includes(m)),
    optional: domain.mcps.optional,
  };
}

/**
 * Get tools for a domain and capability level
 */
export function getToolsForLevel(domainKey, level = 'standard') {
  const domain = getDomain(domainKey);
  if (!domain) return [];

  const levelConfig = domain.capabilityLevels[level];
  return levelConfig ? levelConfig.tools : domain.tools.slice(0, 2);
}

/**
 * Get training sources for a domain
 */
export function getTrainingSources(domainKey, depth = 'curated') {
  const domain = getDomain(domainKey);
  if (!domain) return { curated: [], youtube: [] };

  switch (depth) {
    case 'none':
      return { curated: [], youtube: [] };
    case 'curated':
      return { curated: domain.trainingSources.curated.slice(0, 2), youtube: [] };
    case 'extended':
      return domain.trainingSources;
    case 'custom':
      return domain.trainingSources; // User will add their own
    default:
      return { curated: domain.trainingSources.curated.slice(0, 1), youtube: [] };
  }
}

/**
 * Get archetypes for a domain
 */
export function getArchetypes(domainKey) {
  const domain = getDomain(domainKey);
  return domain ? domain.archetypes : [];
}

/**
 * Get default mascot for a domain
 */
export function getDefaultMascot(domainKey) {
  const domain = getDomain(domainKey);
  return domain ? domain.defaultMascot : { name: 'SKILL-BOT', personality: 'helpful' };
}

/**
 * Get common errors for a domain
 */
export function getCommonErrors(domainKey) {
  const domain = getDomain(domainKey);
  return domain ? domain.commonErrors : [];
}

export default {
  domains,
  getDomain,
  listDomains,
  detectDomain,
  getRecommendedMcps,
  getToolsForLevel,
  getTrainingSources,
  getArchetypes,
  getDefaultMascot,
  getCommonErrors,
};
