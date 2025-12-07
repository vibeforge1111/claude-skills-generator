import detector from './detector.js';
import config from './config.js';
import parser from '../../lib/parser.js';
import filesystem from '../../lib/filesystem.js';
import fs from 'fs/promises';
import path from 'path';

// Analyze skill for MCP requirements
export async function analyzeSkillMcps(skillName, baseDir = process.cwd()) {
  const content = await filesystem.readSkill(skillName, baseDir);
  const parsed = parser.parseSkill(content);

  // Get MCPs from frontmatter
  const declared = {
    required: parsed.frontmatter.mcps?.required || [],
    optional: parsed.frontmatter.mcps?.optional || [],
  };

  // Detect MCPs from content
  const detected = detector.detectMcps(content);
  const detectedNames = detected.map((m) => m.key);

  // Find undeclared MCPs
  const allDeclared = [...declared.required, ...declared.optional];
  const undeclared = detectedNames.filter((m) => !allDeclared.includes(m));

  return {
    declared,
    detected,
    undeclared,
    all: [...new Set([...allDeclared, ...detectedNames])],
  };
}

// Get MCP config for a skill
export async function getSkillMcpConfig(skillName, baseDir = process.cwd()) {
  const analysis = await analyzeSkillMcps(skillName, baseDir);
  return config.generateMcpConfig(analysis.declared.required);
}

// Check if MCPs are configured in user settings
export async function checkConfiguredMcps(baseDir = process.cwd()) {
  const settingsPaths = [
    path.join(baseDir, '.claude', 'settings.json'),
    path.join(process.env.HOME || process.env.USERPROFILE, '.claude', 'settings.json'),
  ];

  let configured = {};

  for (const settingsPath of settingsPaths) {
    try {
      const content = await fs.readFile(settingsPath, 'utf-8');
      const parsed = config.parseMcpConfig(content);
      configured = { ...configured, ...parsed };
    } catch {
      // File doesn't exist
    }
  }

  return configured;
}

// Full MCP analysis with configuration check
export async function fullMcpAnalysis(skillName, baseDir = process.cwd()) {
  const analysis = await analyzeSkillMcps(skillName, baseDir);
  const configured = await checkConfiguredMcps(baseDir);

  const missing = config.checkMissingMcps(analysis.declared.required, configured);

  return {
    ...analysis,
    configured: Object.keys(configured),
    missing,
    ready: missing.length === 0,
  };
}

// Export sub-modules
export { detector, config };

export default {
  analyzeSkillMcps,
  getSkillMcpConfig,
  checkConfiguredMcps,
  fullMcpAnalysis,
  detector,
  config,
};
