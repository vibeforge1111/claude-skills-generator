import fs from '../../lib/filesystem.js';
import parser from '../../lib/parser.js';
import templates from './templates.js';
import aiWriter from './ai-writer.js';
import logger from '../../lib/logger.js';

// Generate a new skill
export async function generateSkill(options) {
  const {
    name,
    description,
    template = 'basic',
    templateData = {},
    useAI = true,
    projectContext = null,
    baseDir = process.cwd(),
  } = options;

  // Check if skill already exists
  if (await fs.skillExists(name, baseDir)) {
    throw new Error(`Skill "${name}" already exists`);
  }

  // Generate content
  let content;

  if (useAI) {
    // Try AI generation first
    content = await aiWriter.generateWithAI({
      name,
      description,
      template,
      projectContext,
    });
  }

  if (!content) {
    // Fall back to template
    const spin = logger.spinner('Generating from template...');
    spin.start();

    content = await templates.generateFromTemplate(template, {
      name,
      description,
      author: process.env.USER || process.env.USERNAME || '',
      ...templateData,
    });

    // Enhance with AI if available
    if (useAI) {
      content = await aiWriter.enhanceWithAI(content, {
        name,
        description,
        projectContext,
      });
    }

    spin.succeed('Skill content generated');
  }

  // Create skill directory structure
  await fs.createSkillStructure(name, baseDir);

  // Write skill file
  const skillPath = await fs.writeSkill(name, content, baseDir);

  return {
    name,
    path: skillPath,
    content,
  };
}

// Create skill from existing content
export async function createSkillFromContent(name, content, baseDir = process.cwd()) {
  // Validate content has frontmatter
  const parsed = parser.parseSkill(content);
  const validation = parser.validateFrontmatter(parsed.frontmatter);

  if (!validation.valid) {
    throw new Error(`Invalid skill content: ${validation.errors.join(', ')}`);
  }

  // Check if skill already exists
  if (await fs.skillExists(name, baseDir)) {
    throw new Error(`Skill "${name}" already exists`);
  }

  // Create structure and write
  await fs.createSkillStructure(name, baseDir);
  const skillPath = await fs.writeSkill(name, content, baseDir);

  return {
    name,
    path: skillPath,
    content,
  };
}

// Update an existing skill
export async function updateSkill(name, content, baseDir = process.cwd()) {
  if (!(await fs.skillExists(name, baseDir))) {
    throw new Error(`Skill "${name}" does not exist`);
  }

  const skillPath = await fs.writeSkill(name, content, baseDir);

  return {
    name,
    path: skillPath,
    content,
  };
}

// Get skill info
export async function getSkillInfo(name, baseDir = process.cwd()) {
  if (!(await fs.skillExists(name, baseDir))) {
    return null;
  }

  const content = await fs.readSkill(name, baseDir);
  const parsed = parser.parseSkill(content);

  return {
    name,
    path: fs.getSkillFilePath(name, baseDir),
    frontmatter: parsed.frontmatter,
    sections: Object.keys(parsed.sections),
    content,
  };
}

export default {
  generateSkill,
  createSkillFromContent,
  updateSkill,
  getSkillInfo,
};
