import claude from '../../lib/claude.js';

// Generate test prompts based on skill content
export async function generateTestPrompts(skillContent, parsed) {
  const { frontmatter } = parsed;

  // Start with trigger-based prompts
  const prompts = [];

  // Generate from triggers
  if (frontmatter.triggers && frontmatter.triggers.length > 0) {
    frontmatter.triggers.forEach((trigger, i) => {
      prompts.push({
        id: `trigger-${i + 1}`,
        type: 'trigger',
        prompt: convertTriggerToPrompt(trigger),
        expectedBehavior: 'Skill should activate and follow instructions',
      });
    });
  }

  // Add generic test prompts based on skill name/description
  prompts.push({
    id: 'basic-request',
    type: 'basic',
    prompt: `Help me with ${frontmatter.name || 'this task'}`,
    expectedBehavior: 'Skill should provide relevant assistance',
  });

  prompts.push({
    id: 'edge-case',
    type: 'edge',
    prompt: `What if I have an unusual situation with ${frontmatter.name || 'this'}?`,
    expectedBehavior: 'Skill should handle edge cases gracefully',
  });

  // Try to generate AI prompts if available
  if (claude.isConfigured()) {
    try {
      const aiPrompts = await claude.generateTestPrompts(skillContent);
      if (aiPrompts && aiPrompts.length > 0) {
        aiPrompts.forEach((p, i) => {
          prompts.push({
            id: `ai-${i + 1}`,
            type: 'ai-generated',
            prompt: p.prompt,
            expectedBehavior: p.expectedBehavior,
          });
        });
      }
    } catch {
      // AI generation failed, use defaults
    }
  }

  return prompts;
}

// Convert trigger phrase to a test prompt
function convertTriggerToPrompt(trigger) {
  // Remove "when user asks about" type prefixes
  let prompt = trigger
    .replace(/^when\s+(user\s+)?(asks?\s+about|requests?|wants?\s+to|needs?\s+to)\s*/i, '')
    .replace(/^when\s+working\s+with\s*/i, 'Help me work with ')
    .replace(/^when\s+debugging\s*/i, 'Help me debug ')
    .replace(/^when\s+/i, '');

  // Capitalize first letter
  prompt = prompt.charAt(0).toUpperCase() + prompt.slice(1);

  // Add question mark or period if missing
  if (!prompt.match(/[.?!]$/)) {
    prompt += '?';
  }

  return prompt;
}

// Load custom prompts from file
export async function loadCustomPrompts(filePath) {
  try {
    const fs = await import('fs/promises');
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);

    if (Array.isArray(data)) {
      return data.map((p, i) => ({
        id: `custom-${i + 1}`,
        type: 'custom',
        prompt: p.prompt || p,
        expectedBehavior: p.expectedBehavior || 'Custom test',
      }));
    }

    return [];
  } catch {
    return [];
  }
}

export default {
  generateTestPrompts,
  loadCustomPrompts,
};
