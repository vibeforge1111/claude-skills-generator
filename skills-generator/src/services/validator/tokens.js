// Token estimation (rough approximation without tiktoken dependency issues)
// Average English word is ~1.3 tokens, average char is ~0.25 tokens

const CHARS_PER_TOKEN = 4; // Rough estimate
const MAX_RECOMMENDED_TOKENS = 5000;
const MAX_ABSOLUTE_TOKENS = 10000;

// Estimate token count from text
export function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

// Check if skill is within token limits
export function checkTokenLimits(content) {
  const tokens = estimateTokens(content);

  return {
    count: tokens,
    withinRecommended: tokens <= MAX_RECOMMENDED_TOKENS,
    withinAbsolute: tokens <= MAX_ABSOLUTE_TOKENS,
    percentage: Math.round((tokens / MAX_RECOMMENDED_TOKENS) * 100),
    recommendation: getTokenRecommendation(tokens),
  };
}

// Get recommendation based on token count
function getTokenRecommendation(tokens) {
  if (tokens < 500) {
    return 'Skill is very concise. Consider adding more detail if needed.';
  }
  if (tokens <= MAX_RECOMMENDED_TOKENS) {
    return 'Token count is optimal.';
  }
  if (tokens <= MAX_ABSOLUTE_TOKENS) {
    return 'Skill is large. Consider using progressive disclosure or splitting.';
  }
  return 'Skill exceeds recommended size. Split into multiple skills or use references.';
}

// Check for progressive disclosure patterns
export function checkProgressiveDisclosure(content) {
  const patterns = {
    hasReferences: /##\s*References/i.test(content),
    hasCollapsibleSections: /<details>/i.test(content),
    hasExternalLinks: /\[.*?\]\(https?:\/\/.*?\)/i.test(content),
    hasDeferredLoading: /load on demand|lazy load|when needed/i.test(content),
  };

  const usesProgressive = Object.values(patterns).some(Boolean);

  return {
    usesProgressiveDisclosure: usesProgressive,
    patterns,
    recommendation: usesProgressive
      ? 'Good use of progressive disclosure.'
      : 'Consider using references or collapsible sections for large content.',
  };
}

export default {
  estimateTokens,
  checkTokenLimits,
  checkProgressiveDisclosure,
  MAX_RECOMMENDED_TOKENS,
  MAX_ABSOLUTE_TOKENS,
};
