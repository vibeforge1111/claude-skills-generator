import Anthropic from '@anthropic-ai/sdk';

// Default configuration
const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
const DEFAULT_MAX_TOKENS = 4096;

// Singleton client instance
let client = null;

// Initialize the Anthropic client
export function initClient(apiKey = process.env.ANTHROPIC_API_KEY) {
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is required. Set it in your environment or .env file.');
  }
  client = new Anthropic({ apiKey });
  return client;
}

// Get or create client
export function getClient() {
  if (!client) {
    return initClient();
  }
  return client;
}

// Check if API key is configured
export function isConfigured() {
  return !!process.env.ANTHROPIC_API_KEY;
}

// Send a message to Claude
export async function chat(options) {
  const {
    messages,
    system,
    model = process.env.AI_MODEL || DEFAULT_MODEL,
    maxTokens = parseInt(process.env.AI_MAX_TOKENS) || DEFAULT_MAX_TOKENS,
    temperature = 0.7,
  } = options;

  const anthropic = getClient();

  const response = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    system,
    messages,
    temperature,
  });

  return {
    content: response.content[0].text,
    usage: response.usage,
    stopReason: response.stop_reason,
  };
}

// Simple prompt helper
export async function prompt(userMessage, systemPrompt, options = {}) {
  return chat({
    messages: [{ role: 'user', content: userMessage }],
    system: systemPrompt,
    ...options,
  });
}

// Generate skill content with AI
export async function generateSkillContent(data) {
  const { name, description, template, projectContext } = data;

  const systemPrompt = `You are an expert at writing Claude Code skills.
Generate high-quality skill content following the SKILL.md format.
Be specific, actionable, and include concrete examples.
Focus on making the skill deeply capable and well-trained.`;

  const userMessage = `Create a skill called "${name}".

Description: ${description}

Template type: ${template || 'basic'}

${projectContext ? `Project context:\n${projectContext}` : ''}

Generate the full SKILL.md content including:
1. Clear purpose statement
2. Specific trigger conditions (when to use)
3. Detailed step-by-step instructions
4. Concrete examples with expected behavior
5. Error handling for common issues
6. References section

Output only the skill content, starting with the YAML frontmatter.`;

  const response = await prompt(userMessage, systemPrompt, {
    maxTokens: 4096,
    temperature: 0.7,
  });

  return response.content;
}

// Review a skill and provide feedback
export async function reviewSkill(skillContent) {
  const systemPrompt = `You are an expert skill reviewer for Claude Code.
Analyze skills for effectiveness, completeness, and clarity.
Be specific and actionable in your feedback.`;

  const userMessage = `Review this Claude Code skill and provide feedback:

${skillContent}

Analyze and respond with JSON:
{
  "summary": "Brief overall assessment",
  "strengths": ["list of strengths"],
  "gaps": ["list of missing or weak areas"],
  "suggestions": ["specific improvement suggestions"],
  "score": <0-100 quality score>
}`;

  const response = await prompt(userMessage, systemPrompt, {
    maxTokens: 2048,
    temperature: 0.3,
  });

  try {
    // Extract JSON from response
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    // Return raw response if JSON parsing fails
  }

  return {
    summary: response.content,
    strengths: [],
    gaps: [],
    suggestions: [],
    score: 0,
  };
}

// Improve a skill based on feedback
export async function improveSkill(skillContent, feedback) {
  const systemPrompt = `You are an expert at improving Claude Code skills.
Apply the suggested improvements while maintaining the skill's core purpose.
Output only the improved skill content.`;

  const userMessage = `Improve this skill based on the feedback:

CURRENT SKILL:
${skillContent}

FEEDBACK TO ADDRESS:
${feedback}

Output the complete improved SKILL.md content.`;

  const response = await prompt(userMessage, systemPrompt, {
    maxTokens: 4096,
    temperature: 0.5,
  });

  return response.content;
}

// Extract knowledge from transcript
export async function extractKnowledge(transcript, skillName) {
  const systemPrompt = `You are an expert at extracting actionable knowledge from video transcripts.
Focus on techniques, patterns, and best practices relevant to the skill topic.`;

  const userMessage = `Extract knowledge from this transcript for a "${skillName}" skill:

${transcript}

Respond with JSON:
{
  "techniques": ["list of actionable techniques"],
  "antiPatterns": ["things to avoid"],
  "tools": ["recommended tools or resources"],
  "keyInsights": ["important takeaways"]
}`;

  const response = await prompt(userMessage, systemPrompt, {
    maxTokens: 2048,
    temperature: 0.3,
  });

  try {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    // Return empty if parsing fails
  }

  return {
    techniques: [],
    antiPatterns: [],
    tools: [],
    keyInsights: [],
  };
}

// Generate test prompts for a skill
export async function generateTestPrompts(skillContent) {
  const systemPrompt = `You are an expert at testing Claude Code skills.
Generate test prompts that will verify the skill works correctly.`;

  const userMessage = `Generate test prompts for this skill:

${skillContent}

Create 3-5 test prompts that:
1. Test the main functionality
2. Test edge cases
3. Test error handling

Respond with JSON:
{
  "prompts": [
    {"prompt": "test prompt text", "expectedBehavior": "what should happen"}
  ]
}`;

  const response = await prompt(userMessage, systemPrompt, {
    maxTokens: 1024,
    temperature: 0.5,
  });

  try {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]).prompts;
    }
  } catch (e) {
    // Return empty if parsing fails
  }

  return [];
}

// Suggest skills based on project context
export async function suggestSkills(projectContext) {
  const systemPrompt = `You are an expert at identifying useful Claude Code skills.
Suggest skills that would help developers working on this type of project.`;

  const userMessage = `Based on this project context, suggest useful skills to create:

${projectContext}

Respond with JSON:
{
  "suggestions": [
    {
      "name": "skill-name",
      "description": "what it does",
      "reason": "why it would help",
      "template": "basic|debugging|document|api"
    }
  ]
}`;

  const response = await prompt(userMessage, systemPrompt, {
    maxTokens: 1024,
    temperature: 0.7,
  });

  try {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]).suggestions;
    }
  } catch (e) {
    // Return empty if parsing fails
  }

  return [];
}

export default {
  initClient,
  getClient,
  isConfigured,
  chat,
  prompt,
  generateSkillContent,
  reviewSkill,
  improveSkill,
  extractKnowledge,
  generateTestPrompts,
  suggestSkills,
};
