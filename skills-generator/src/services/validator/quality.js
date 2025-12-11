// World-Class Skill Quality Scoring
// Based on analysis of superpowers skills patterns
// See: test-driven-development, systematic-debugging, verification-before-completion

// Quality scoring weights - prioritizes behavioral effectiveness patterns
const WEIGHTS = {
  // CRITICAL - Core behavioral patterns (60 pts)
  hasIronLaw: 15,              // Single absolute rule in code block
  hasRationalizationsTable: 15, // | Excuse | Reality | format
  hasRedFlags: 10,             // "STOP" triggers list
  hasGoodBadExamples: 10,      // <Good>/<Bad> or ✅/❌ comparisons
  hasVerificationChecklist: 10, // Checkbox list at end

  // IMPORTANT - Structure (25 pts)
  hasWhenToUse: 10,            // Always/Never/Exceptions format
  hasPurpose: 5,               // Clear overview/purpose section
  hasProcess: 5,               // Phased/step-by-step process
  hasReferences: 5,            // Links to sub-skills or docs

  // NICE TO HAVE (15 pts)
  hasTriggers: 5,              // Frontmatter triggers
  hasDescriptionPattern: 5,    // "Use when [CONDITION] - [WHAT IT DOES]"
  hasIntegration: 5,           // Links to required/complementary skills
};

// Detection patterns for world-class skill elements
const PATTERNS = {
  // Iron Law: ALL CAPS statement in code block, or "NO X WITHOUT Y" pattern
  ironLaw: [
    /```\n[A-Z][A-Z\s]+[A-Z]\n```/,           // Code block with ALL CAPS
    /NO\s+\w+.*WITHOUT/i,                      // NO X WITHOUT Y (any ending)
    /NEVER\s+\w+.*WITHOUT/i,                   // NEVER X WITHOUT Y
    /ALWAYS\s+\w+.*BEFORE/i,                   // ALWAYS X BEFORE Y
    /##.*Iron\s+Law/i,                         // Iron Law section header
  ],

  // Rationalizations table: | Excuse | Reality | format
  rationalizationsTable: [
    /\|\s*(Excuse|Rationalization).*\|\s*(Reality|Truth)/i,
    /##.*Rationalization/i,
    /Common\s+Rationalizations/i,
  ],

  // Red Flags: Section with STOP instructions
  redFlags: [
    /##.*Red\s+Flag/i,                         // Red Flags section header
    /##.*STOP/i,                               // Section header with STOP
    /STOP.*Phase\s*1/i,
    /STOP.*Start\s+over/i,
    /STOP\s+and\s+/i,
    /ALL\s+of\s+these\s+mean.*STOP/i,
  ],

  // Good/Bad examples: Side-by-side comparisons
  goodBadExamples: [
    /<Good>[\s\S]*?<\/Good>/,
    /<Bad>[\s\S]*?<\/Bad>/,
    /✅.*GOOD/i,
    /❌.*BAD/i,
    /\*\*Good:\*\*/i,
    /\*\*Bad:\*\*/i,
  ],

  // Verification checklist: Checkbox list
  verificationChecklist: [
    /##.*Verification/i,
    /##.*Checklist/i,
    /- \[ \]/,                                 // Unchecked checkbox
    /Can't check all boxes\?/i,
  ],

  // When to Use with Always/Never format
  whenToUseStructured: [
    /\*\*Always:\*\*/,
    /\*\*Always\*\*:/,
    /\*\*Never:\*\*/,
    /\*\*Don't:\*\*/,
    /\*\*Exceptions.*:\*\*/i,
  ],

  // Description pattern: "Use when [CONDITION] - [WHAT IT DOES]"
  descriptionPattern: [
    /^Use when\s+.+\s+-\s+.+/i,
    /^Use for\s+.+\s+-\s+.+/i,
  ],

  // Integration section: Links to other skills
  integration: [
    /##.*Integration/i,
    /REQUIRED.*SUB-SKILL/i,
    /Complementary\s+skills/i,
    /superpowers:\w+/,
  ],

  // Process/Phases: Structured methodology
  process: [
    /##.*Phase\s+\d/i,
    /###.*Step\s+\d/i,
    /Red-Green-Refactor/i,
    /The\s+(Four|Three|Two)\s+(Phase|Step)/i,
  ],
};

// Check if content matches any pattern in array
function matchesAny(content, patterns) {
  return patterns.some(pattern => pattern.test(content));
}

// Check if content has multiple pattern matches (for stronger validation)
function matchesMultiple(content, patterns, minMatches = 2) {
  const matches = patterns.filter(pattern => pattern.test(content));
  return matches.length >= minMatches;
}

// Calculate quality score for a skill
export function calculateQualityScore(parsed) {
  const { frontmatter, sections, body } = parsed;
  const breakdown = {};
  let total = 0;

  // CRITICAL: Iron Law (15 pts)
  // Single absolute rule that removes ambiguity
  breakdown.hasIronLaw = matchesAny(body, PATTERNS.ironLaw) ? WEIGHTS.hasIronLaw : 0;
  total += breakdown.hasIronLaw;

  // CRITICAL: Rationalizations Table (15 pts)
  // Defeats common excuses with | Excuse | Reality | format
  breakdown.hasRationalizationsTable = matchesAny(body, PATTERNS.rationalizationsTable)
    ? WEIGHTS.hasRationalizationsTable : 0;
  total += breakdown.hasRationalizationsTable;

  // CRITICAL: Red Flags (10 pts)
  // Early warning system with "STOP" triggers
  breakdown.hasRedFlags = matchesMultiple(body, PATTERNS.redFlags, 2)
    ? WEIGHTS.hasRedFlags : 0;
  total += breakdown.hasRedFlags;

  // CRITICAL: Good/Bad Examples (10 pts)
  // Side-by-side comparisons showing intent
  const hasGoodExample = /<Good>/i.test(body) || /✅/.test(body) || /\*\*Good:\*\*/i.test(body);
  const hasBadExample = /<Bad>/i.test(body) || /❌/.test(body) || /\*\*Bad:\*\*/i.test(body);
  breakdown.hasGoodBadExamples = (hasGoodExample && hasBadExample) ? WEIGHTS.hasGoodBadExamples : 0;
  total += breakdown.hasGoodBadExamples;

  // CRITICAL: Verification Checklist (10 pts)
  // Checkbox list with success criteria
  const hasCheckboxes = /- \[ \]/.test(body);
  const hasVerifySection = matchesAny(body, PATTERNS.verificationChecklist.slice(0, 2));
  breakdown.hasVerificationChecklist = (hasCheckboxes || hasVerifySection)
    ? WEIGHTS.hasVerificationChecklist : 0;
  total += breakdown.hasVerificationChecklist;

  // IMPORTANT: When to Use with structure (10 pts)
  // Always/Never/Exceptions format
  const hasWhenSection = sections.whenToUse || sections.whentouse || /##.*When to Use/i.test(body);
  const hasStructuredWhen = matchesMultiple(body, PATTERNS.whenToUseStructured, 2);
  breakdown.hasWhenToUse = (hasWhenSection && hasStructuredWhen)
    ? WEIGHTS.hasWhenToUse
    : (hasWhenSection ? Math.floor(WEIGHTS.hasWhenToUse / 2) : 0);
  total += breakdown.hasWhenToUse;

  // IMPORTANT: Purpose/Overview (5 pts)
  const hasPurpose = sections.purpose || sections.overview || /##.*Overview/i.test(body);
  breakdown.hasPurpose = hasPurpose ? WEIGHTS.hasPurpose : 0;
  total += breakdown.hasPurpose;

  // IMPORTANT: Process/Phases (5 pts)
  breakdown.hasProcess = matchesAny(body, PATTERNS.process) ? WEIGHTS.hasProcess : 0;
  total += breakdown.hasProcess;

  // IMPORTANT: References/Links (5 pts)
  const hasReferences = sections.references || /##.*Reference/i.test(body) || /\[.*\]\(http/i.test(body);
  breakdown.hasReferences = hasReferences ? WEIGHTS.hasReferences : 0;
  total += breakdown.hasReferences;

  // NICE TO HAVE: Triggers in frontmatter (5 pts)
  breakdown.hasTriggers = (frontmatter.triggers && frontmatter.triggers.length > 0)
    ? WEIGHTS.hasTriggers : 0;
  total += breakdown.hasTriggers;

  // NICE TO HAVE: Description pattern (5 pts)
  // "Use when [CONDITION] - [WHAT IT DOES]"
  const description = frontmatter.description || '';
  breakdown.hasDescriptionPattern = matchesAny(description, PATTERNS.descriptionPattern)
    ? WEIGHTS.hasDescriptionPattern : 0;
  total += breakdown.hasDescriptionPattern;

  // NICE TO HAVE: Integration section (5 pts)
  breakdown.hasIntegration = matchesAny(body, PATTERNS.integration)
    ? WEIGHTS.hasIntegration : 0;
  total += breakdown.hasIntegration;

  return {
    score: total,
    maxScore: 100,
    breakdown,
    suggestions: generateSuggestions(breakdown),
    tier: getQualityTier(total),
  };
}

// Generate improvement suggestions based on missing components
function generateSuggestions(breakdown) {
  const suggestions = [];

  // CRITICAL suggestions first
  if (breakdown.hasIronLaw === 0) {
    suggestions.push({
      priority: 'CRITICAL',
      message: 'Add an Iron Law - a single absolute rule in a code block (e.g., "NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST")',
      example: '```\nNO PRODUCTION CODE WITHOUT A FAILING TEST FIRST\n```',
    });
  }

  if (breakdown.hasRationalizationsTable === 0) {
    suggestions.push({
      priority: 'CRITICAL',
      message: 'Add a Rationalizations table with | Excuse | Reality | format to defeat common excuses',
      example: '| "Too simple to test" | Simple code breaks. Test takes 30 seconds. |',
    });
  }

  if (breakdown.hasRedFlags === 0) {
    suggestions.push({
      priority: 'CRITICAL',
      message: 'Add a Red Flags section with "STOP" triggers that tell when to restart the process',
      example: '## Red Flags - STOP and Start Over\n- Proposing fixes before investigation\n- "Just try this and see"\n\n**ALL of these mean: STOP. Return to Phase 1.**',
    });
  }

  if (breakdown.hasGoodBadExamples === 0) {
    suggestions.push({
      priority: 'CRITICAL',
      message: 'Add Good vs Bad examples with <Good>/<Bad> tags or ✅/❌ showing side-by-side comparisons',
      example: '<Good>\n```code```\nWhy this is good\n</Good>\n\n<Bad>\n```code```\nWhy this is bad\n</Bad>',
    });
  }

  if (breakdown.hasVerificationChecklist === 0) {
    suggestions.push({
      priority: 'CRITICAL',
      message: 'Add a Verification Checklist with checkboxes at the end',
      example: '## Verification Checklist\n- [ ] Step completed\n- [ ] Tests pass\n\nCan\'t check all boxes? You skipped the process. Start over.',
    });
  }

  // IMPORTANT suggestions
  if (breakdown.hasWhenToUse < WEIGHTS.hasWhenToUse) {
    suggestions.push({
      priority: 'IMPORTANT',
      message: 'Structure "When to Use" section with **Always:** and **Don\'t:** or **Exceptions:** subsections',
      example: '**Always:**\n- New features\n- Bug fixes\n\n**Exceptions (ask first):**\n- Throwaway prototypes',
    });
  }

  if (breakdown.hasPurpose === 0) {
    suggestions.push({
      priority: 'IMPORTANT',
      message: 'Add an Overview or Purpose section explaining the core principle',
      example: '## Overview\n\n**Core principle:** ALWAYS find root cause before attempting fixes.',
    });
  }

  if (breakdown.hasProcess === 0) {
    suggestions.push({
      priority: 'IMPORTANT',
      message: 'Add a phased or step-by-step process (e.g., "Phase 1:", "Step 1:", "Red-Green-Refactor")',
      example: '## The Four Phases\n\n### Phase 1: Investigation\n...\n\n### Phase 2: Analysis\n...',
    });
  }

  if (breakdown.hasReferences === 0) {
    suggestions.push({
      priority: 'NICE',
      message: 'Add References or links to related documentation',
    });
  }

  // NICE TO HAVE suggestions
  if (breakdown.hasTriggers === 0) {
    suggestions.push({
      priority: 'NICE',
      message: 'Add trigger phrases to frontmatter for skill discovery',
    });
  }

  if (breakdown.hasDescriptionPattern === 0) {
    suggestions.push({
      priority: 'NICE',
      message: 'Format description as "Use when [CONDITION] - [WHAT IT DOES]"',
      example: 'description: Use when implementing any feature - write the test first, watch it fail, write minimal code to pass',
    });
  }

  if (breakdown.hasIntegration === 0) {
    suggestions.push({
      priority: 'NICE',
      message: 'Add Integration section linking to required or complementary skills',
      example: '## Integration\n\n**Required:** superpowers:test-driven-development\n**Complementary:** superpowers:verification-before-completion',
    });
  }

  return suggestions;
}

// Get quality tier based on score
function getQualityTier(score) {
  if (score >= 85) return { tier: 'world-class', label: 'World-Class', color: 'green' };
  if (score >= 70) return { tier: 'production', label: 'Production Ready', color: 'blue' };
  if (score >= 55) return { tier: 'draft', label: 'Needs Enhancement', color: 'yellow' };
  if (score >= 40) return { tier: 'incomplete', label: 'Draft', color: 'orange' };
  return { tier: 'poor', label: 'Incomplete', color: 'red' };
}

// Get quality grade based on score (backwards compatible)
export function getQualityGrade(score) {
  if (score >= 85) return { grade: 'A', label: 'World-Class' };
  if (score >= 70) return { grade: 'B', label: 'Production Ready' };
  if (score >= 55) return { grade: 'C', label: 'Needs Enhancement' };
  if (score >= 40) return { grade: 'D', label: 'Draft' };
  return { grade: 'F', label: 'Incomplete' };
}

// Validate a skill and return detailed report
export function validateSkillQuality(parsed) {
  const result = calculateQualityScore(parsed);

  // Group suggestions by priority
  const criticalMissing = result.suggestions.filter(s => s.priority === 'CRITICAL');
  const importantMissing = result.suggestions.filter(s => s.priority === 'IMPORTANT');
  const niceMissing = result.suggestions.filter(s => s.priority === 'NICE');

  return {
    ...result,
    isWorldClass: result.score >= 85,
    isProductionReady: result.score >= 70,
    criticalMissing,
    importantMissing,
    niceMissing,
    summary: generateSummary(result, criticalMissing.length),
  };
}

// Generate human-readable summary
function generateSummary(result, criticalCount) {
  const { score, tier } = result;

  if (score >= 85) {
    return `✅ World-Class skill (${score}/100). This skill follows all best practices for behavioral effectiveness.`;
  }
  if (score >= 70) {
    return `🟢 Production Ready (${score}/100). Good skill with ${criticalCount} critical patterns missing.`;
  }
  if (score >= 55) {
    return `🟡 Needs Enhancement (${score}/100). ${criticalCount} critical behavioral patterns missing.`;
  }
  if (score >= 40) {
    return `🟠 Draft (${score}/100). Missing ${criticalCount} critical patterns that prevent rationalization.`;
  }
  return `🔴 Incomplete (${score}/100). Missing most world-class patterns. See suggestions.`;
}

export default {
  calculateQualityScore,
  getQualityGrade,
  validateSkillQuality,
  WEIGHTS,
  PATTERNS,
};
