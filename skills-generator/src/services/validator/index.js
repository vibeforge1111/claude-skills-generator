import parser from '../../lib/parser.js';
import schema from './schema.js';
import quality from './quality.js';
import tokens from './tokens.js';

// Validate a skill (all layers except AI)
export async function validateSkill(content, options = {}) {
  const { includeTokens = true } = options;

  // Parse skill content
  const parsed = parser.parseSkill(content);

  // Layer 1: Schema validation
  const schemaResult = await schema.validateSchema(parsed.frontmatter);

  // Layer 2: Quality scoring
  const qualityResult = quality.calculateQualityScore(parsed);
  const grade = quality.getQualityGrade(qualityResult.score);

  // Layer 3: Token analysis (optional)
  let tokenResult = null;
  let progressiveResult = null;
  if (includeTokens) {
    tokenResult = tokens.checkTokenLimits(content);
    progressiveResult = tokens.checkProgressiveDisclosure(content);
  }

  // Combine results
  const allSuggestions = [
    ...schemaResult.errors.map((e) => `Schema: ${e}`),
    ...qualityResult.suggestions,
  ];

  if (tokenResult && !tokenResult.withinRecommended) {
    allSuggestions.push(tokenResult.recommendation);
  }

  return {
    valid: schemaResult.valid && qualityResult.score >= 50,
    schema: schemaResult,
    quality: {
      score: qualityResult.score,
      maxScore: qualityResult.maxScore,
      grade: grade.grade,
      label: grade.label,
      breakdown: qualityResult.breakdown,
    },
    tokens: tokenResult,
    progressiveDisclosure: progressiveResult,
    suggestions: allSuggestions,
    parsed,
  };
}

// Quick validation (schema only)
export async function quickValidate(content) {
  const parsed = parser.parseSkill(content);
  return schema.validateSchema(parsed.frontmatter);
}

// Get just the quality score
export function getQualityScore(content) {
  const parsed = parser.parseSkill(content);
  return quality.calculateQualityScore(parsed);
}

export default {
  validateSkill,
  quickValidate,
  getQualityScore,
};
