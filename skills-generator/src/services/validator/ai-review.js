import claude from '../../lib/claude.js';
import logger from '../../lib/logger.js';

// Perform AI review of a skill
export async function reviewWithAI(content) {
  if (!claude.isConfigured()) {
    return {
      available: false,
      summary: 'AI review not available (ANTHROPIC_API_KEY not set)',
      strengths: [],
      gaps: [],
      suggestions: [],
      score: null,
    };
  }

  const spin = logger.spinner('Running AI review...');
  spin.start();

  try {
    const result = await claude.reviewSkill(content);

    spin.succeed('AI review complete');

    return {
      available: true,
      summary: result.summary || 'Review completed',
      strengths: result.strengths || [],
      gaps: result.gaps || [],
      suggestions: result.suggestions || [],
      score: result.score || null,
    };
  } catch (error) {
    spin.fail('AI review failed');
    logger.error(error.message);

    return {
      available: false,
      summary: `AI review failed: ${error.message}`,
      strengths: [],
      gaps: [],
      suggestions: [],
      score: null,
    };
  }
}

// Get AI suggestions for specific improvements
export async function getImprovementSuggestions(content, issues) {
  if (!claude.isConfigured()) {
    return null;
  }

  try {
    const response = await claude.prompt(
      `This skill has the following issues:
${issues.map((i) => `- ${i}`).join('\n')}

Skill content:
${content}

Provide specific, actionable fixes for each issue. Be concise.`,
      'You are an expert skill reviewer. Provide specific code/content fixes.',
      { maxTokens: 1024, temperature: 0.3 }
    );

    return response.content;
  } catch {
    return null;
  }
}

export default {
  reviewWithAI,
  getImprovementSuggestions,
};
