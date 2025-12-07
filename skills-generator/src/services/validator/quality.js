// Quality scoring weights
const WEIGHTS = {
  hasPurpose: 10,
  hasWhenToUse: 10,
  hasInstructions: 20,
  hasExamples: 20,
  hasErrorHandling: 15,
  hasReferences: 5,
  hasTriggers: 5,
  hasMcps: 5,
  tokenEfficiency: 10,
};

// Calculate quality score for a skill
export function calculateQualityScore(parsed) {
  const { frontmatter, sections, body } = parsed;
  const breakdown = {};
  let total = 0;

  // Check purpose section
  breakdown.hasPurpose = sections.purpose && sections.purpose.length > 20 ? WEIGHTS.hasPurpose : 0;
  total += breakdown.hasPurpose;

  // Check when to use section
  const hasWhenToUse = sections.whenToUse || sections.whentouse;
  breakdown.hasWhenToUse = hasWhenToUse && hasWhenToUse.length > 20 ? WEIGHTS.hasWhenToUse : 0;
  total += breakdown.hasWhenToUse;

  // Check instructions section
  breakdown.hasInstructions = sections.instructions && sections.instructions.length > 50 ? WEIGHTS.hasInstructions : 0;
  total += breakdown.hasInstructions;

  // Check examples section
  breakdown.hasExamples = sections.examples && sections.examples.length > 30 ? WEIGHTS.hasExamples : 0;
  total += breakdown.hasExamples;

  // Check error handling section
  const hasErrorHandling = sections.errorHandling || sections.errorhandling;
  breakdown.hasErrorHandling = hasErrorHandling && hasErrorHandling.length > 20 ? WEIGHTS.hasErrorHandling : 0;
  total += breakdown.hasErrorHandling;

  // Check references section
  breakdown.hasReferences = sections.references && sections.references.length > 5 ? WEIGHTS.hasReferences : 0;
  total += breakdown.hasReferences;

  // Check triggers in frontmatter
  breakdown.hasTriggers = frontmatter.triggers && frontmatter.triggers.length > 0 ? WEIGHTS.hasTriggers : 0;
  total += breakdown.hasTriggers;

  // Check MCPs in frontmatter
  const hasMcps = frontmatter.mcps && (frontmatter.mcps.required?.length > 0 || frontmatter.mcps.optional?.length > 0);
  breakdown.hasMcps = hasMcps ? WEIGHTS.hasMcps : 0;
  total += breakdown.hasMcps;

  // Token efficiency (penalize overly verbose skills)
  const charCount = body.length;
  if (charCount < 500) {
    breakdown.tokenEfficiency = 3; // Too short
  } else if (charCount < 5000) {
    breakdown.tokenEfficiency = WEIGHTS.tokenEfficiency; // Good
  } else if (charCount < 10000) {
    breakdown.tokenEfficiency = 5; // Getting long
  } else {
    breakdown.tokenEfficiency = 0; // Too long
  }
  total += breakdown.tokenEfficiency;

  return {
    score: total,
    maxScore: 100,
    breakdown,
    suggestions: generateSuggestions(breakdown),
  };
}

// Generate improvement suggestions based on missing components
function generateSuggestions(breakdown) {
  const suggestions = [];

  if (breakdown.hasPurpose === 0) {
    suggestions.push('Add a clear Purpose section explaining what this skill does');
  }
  if (breakdown.hasWhenToUse === 0) {
    suggestions.push('Add a "When to Use" section with trigger conditions');
  }
  if (breakdown.hasInstructions === 0) {
    suggestions.push('Add detailed Instructions with step-by-step guidance');
  }
  if (breakdown.hasExamples === 0) {
    suggestions.push('Add Examples showing expected input/output behavior');
  }
  if (breakdown.hasErrorHandling === 0) {
    suggestions.push('Add Error Handling section for common issues');
  }
  if (breakdown.hasReferences === 0) {
    suggestions.push('Consider adding References to relevant documentation');
  }
  if (breakdown.hasTriggers === 0) {
    suggestions.push('Add trigger phrases to frontmatter');
  }
  if (breakdown.hasMcps === 0) {
    suggestions.push('Specify required/optional MCP servers in frontmatter');
  }
  if (breakdown.tokenEfficiency < 5) {
    suggestions.push('Skill content may be too long - consider splitting or summarizing');
  }
  if (breakdown.tokenEfficiency === 3) {
    suggestions.push('Skill content is very short - add more detail');
  }

  return suggestions;
}

// Get quality grade based on score
export function getQualityGrade(score) {
  if (score >= 90) return { grade: 'A', label: 'Excellent' };
  if (score >= 80) return { grade: 'B', label: 'Good' };
  if (score >= 70) return { grade: 'C', label: 'Acceptable' };
  if (score >= 60) return { grade: 'D', label: 'Needs Work' };
  return { grade: 'F', label: 'Poor' };
}

export default {
  calculateQualityScore,
  getQualityGrade,
  WEIGHTS,
};
