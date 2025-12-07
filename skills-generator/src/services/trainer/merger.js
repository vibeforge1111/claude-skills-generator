import claude from '../../lib/claude.js';
import parser from '../../lib/parser.js';

// Merge extracted knowledge into skill content
export async function mergeKnowledge(skillContent, knowledge) {
  const parsed = parser.parseSkill(skillContent);

  // Build enhancement text
  const enhancements = [];

  if (knowledge.techniques && knowledge.techniques.length > 0) {
    enhancements.push('## Additional Techniques');
    enhancements.push('');
    knowledge.techniques.forEach((t, i) => {
      enhancements.push(`${i + 1}. ${t}`);
    });
    enhancements.push('');
  }

  if (knowledge.antiPatterns && knowledge.antiPatterns.length > 0) {
    enhancements.push('## Anti-Patterns to Avoid');
    enhancements.push('');
    knowledge.antiPatterns.forEach((a) => {
      enhancements.push(`- ❌ ${a}`);
    });
    enhancements.push('');
  }

  if (knowledge.tools && knowledge.tools.length > 0) {
    enhancements.push('## Recommended Tools');
    enhancements.push('');
    knowledge.tools.forEach((t) => {
      enhancements.push(`- ${t}`);
    });
    enhancements.push('');
  }

  if (knowledge.keyInsights && knowledge.keyInsights.length > 0) {
    enhancements.push('## Key Insights');
    enhancements.push('');
    knowledge.keyInsights.forEach((k) => {
      enhancements.push(`> ${k}`);
    });
    enhancements.push('');
  }

  // Append to skill body
  const enhancedBody = parsed.body + '\n\n' + enhancements.join('\n');

  return parser.serializeSkill({
    frontmatter: parsed.frontmatter,
    body: enhancedBody,
  });
}

// Smart merge using AI
export async function smartMerge(skillContent, knowledge) {
  if (!claude.isConfigured()) {
    return mergeKnowledge(skillContent, knowledge);
  }

  try {
    const response = await claude.prompt(
      `Enhance this skill with the extracted knowledge. Integrate naturally into existing sections where appropriate.

CURRENT SKILL:
${skillContent}

KNOWLEDGE TO INTEGRATE:
${JSON.stringify(knowledge, null, 2)}

Output the complete enhanced skill content, maintaining YAML frontmatter.`,
      'You are an expert at writing Claude Code skills. Integrate knowledge naturally without duplicating content.',
      { maxTokens: 4096, temperature: 0.5 }
    );

    return response.content;
  } catch {
    // Fall back to simple merge
    return mergeKnowledge(skillContent, knowledge);
  }
}

export default {
  mergeKnowledge,
  smartMerge,
};
