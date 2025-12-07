import matter from 'gray-matter';
import yaml from 'yaml';

// Parse SKILL.md content into structured data
export function parseSkill(content) {
  const { data: frontmatter, content: body } = matter(content);

  return {
    frontmatter,
    body,
    sections: parseSections(body),
  };
}

// Parse markdown sections from body
export function parseSections(body) {
  const sections = {};
  const lines = body.split('\n');

  let currentSection = null;
  let currentContent = [];

  for (const line of lines) {
    // Check for h2 headers (## Section)
    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      // Save previous section
      if (currentSection) {
        sections[normalizeKey(currentSection)] = currentContent.join('\n').trim();
      }
      currentSection = h2Match[1];
      currentContent = [];
      continue;
    }

    // Add line to current section
    if (currentSection) {
      currentContent.push(line);
    }
  }

  // Save last section
  if (currentSection) {
    sections[normalizeKey(currentSection)] = currentContent.join('\n').trim();
  }

  return sections;
}

// Normalize section key (e.g., "When to Use" -> "whenToUse")
function normalizeKey(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .map((word, i) => (i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join('');
}

// Serialize skill back to SKILL.md format
export function serializeSkill(skill) {
  const { frontmatter, body } = skill;

  // Use gray-matter to stringify
  return matter.stringify(body, frontmatter);
}

// Create skill content from template data
export function createSkillContent(data) {
  const {
    name,
    description,
    version = '1.0.0',
    author = '',
    mcps = { required: [], optional: [] },
    triggers = [],
    tags = [],
    purpose = '',
    whenToUse = '',
    instructions = '',
    examples = '',
    errorHandling = '',
    references = '',
  } = data;

  const frontmatter = {
    name,
    description,
    version,
    author,
    mcps,
    triggers,
    tags,
  };

  const body = `
# ${name}

## Purpose
${purpose || '[What this skill does]'}

## When to Use
${whenToUse || '[Trigger conditions]'}

## Instructions
${instructions || '[Detailed instructions for Claude]'}

## Examples
${examples || '[Usage examples with expected behavior]'}

## Error Handling
${errorHandling || '[How to handle common issues]'}

## References
${references || '[Links to resources, loaded on demand]'}
`.trim();

  return serializeSkill({ frontmatter, body });
}

// Extract frontmatter only (faster for listings)
export function extractFrontmatter(content) {
  const { data } = matter(content);
  return data;
}

// Validate frontmatter has required fields
export function validateFrontmatter(frontmatter) {
  const required = ['name', 'description'];
  const missing = required.filter((field) => !frontmatter[field]);

  if (missing.length > 0) {
    return {
      valid: false,
      errors: missing.map((field) => `Missing required field: ${field}`),
    };
  }

  return { valid: true, errors: [] };
}

// Parse YAML string
export function parseYaml(content) {
  return yaml.parse(content);
}

// Stringify to YAML
export function stringifyYaml(data) {
  return yaml.stringify(data);
}

export default {
  parseSkill,
  parseSections,
  serializeSkill,
  createSkillContent,
  extractFrontmatter,
  validateFrontmatter,
  parseYaml,
  stringifyYaml,
};
