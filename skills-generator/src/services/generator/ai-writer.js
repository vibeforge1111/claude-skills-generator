import claude from '../../lib/claude.js';
import logger from '../../lib/logger.js';

// Generate skill content using AI
export async function generateWithAI(data) {
  const { name, description, template, projectContext } = data;

  if (!claude.isConfigured()) {
    logger.warn('AI not configured (missing ANTHROPIC_API_KEY). Using template only.');
    return null;
  }

  const spin = logger.spinner('Generating skill with AI...');
  spin.start();

  try {
    const content = await claude.generateSkillContent({
      name,
      description,
      template,
      projectContext,
    });

    spin.succeed('AI content generated');
    return content;
  } catch (error) {
    spin.fail('AI generation failed');
    logger.error(error.message);
    return null;
  }
}

// Enhance template content with AI
export async function enhanceWithAI(templateContent, data) {
  const { name, description, projectContext } = data;

  if (!claude.isConfigured()) {
    return templateContent;
  }

  const spin = logger.spinner('Enhancing skill with AI...');
  spin.start();

  try {
    const response = await claude.prompt(
      `Enhance this skill template with specific, actionable content.
Keep the structure but replace placeholders with real content.

Skill name: ${name}
Description: ${description}
${projectContext ? `Project context:\n${projectContext}` : ''}

Template to enhance:
${templateContent}

Output the complete enhanced skill content.`,
      `You are an expert at writing Claude Code skills.
Make the skill specific and actionable.
Replace generic placeholders with concrete examples.
Keep the YAML frontmatter valid.`,
      { maxTokens: 4096, temperature: 0.7 }
    );

    spin.succeed('Skill enhanced with AI');
    return response.content;
  } catch (error) {
    spin.fail('AI enhancement failed');
    logger.error(error.message);
    return templateContent;
  }
}

// Generate specific sections with AI
export async function generateSection(sectionName, context) {
  if (!claude.isConfigured()) {
    return null;
  }

  const prompts = {
    purpose: `Write a clear, specific purpose statement for a skill that: ${context}`,
    instructions: `Write detailed step-by-step instructions for: ${context}`,
    examples: `Create 2-3 concrete examples with expected behavior for: ${context}`,
    errorHandling: `List common errors and solutions for: ${context}`,
  };

  const prompt = prompts[sectionName];
  if (!prompt) {
    return null;
  }

  try {
    const response = await claude.prompt(
      prompt,
      'You are an expert at writing Claude Code skills. Be specific and actionable.',
      { maxTokens: 1024, temperature: 0.7 }
    );
    return response.content;
  } catch {
    return null;
  }
}

export default {
  generateWithAI,
  enhanceWithAI,
  generateSection,
};
