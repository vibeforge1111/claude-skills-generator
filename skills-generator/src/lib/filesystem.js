import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import os from 'os';

// Default skills directory
const DEFAULT_SKILLS_DIR = '.claude/skills';

// Get skills directory (from env or default)
export function getSkillsDir() {
  return process.env.SKILLS_DIR || DEFAULT_SKILLS_DIR;
}

// Resolve skills directory to absolute path
export function resolveSkillsDir(baseDir = process.cwd()) {
  const skillsDir = getSkillsDir();
  if (path.isAbsolute(skillsDir)) {
    return skillsDir;
  }
  return path.join(baseDir, skillsDir);
}

// Get path to a specific skill
export function getSkillPath(skillName, baseDir = process.cwd()) {
  const skillsDir = resolveSkillsDir(baseDir);
  return path.join(skillsDir, skillName);
}

// Get path to SKILL.md file
export function getSkillFilePath(skillName, baseDir = process.cwd()) {
  return path.join(getSkillPath(skillName, baseDir), 'SKILL.md');
}

// Check if a skill exists
export async function skillExists(skillName, baseDir = process.cwd()) {
  const skillPath = getSkillFilePath(skillName, baseDir);
  try {
    await fs.access(skillPath);
    return true;
  } catch {
    return false;
  }
}

// List all skills
export async function listSkills(baseDir = process.cwd()) {
  const skillsDir = resolveSkillsDir(baseDir);

  try {
    await fs.access(skillsDir);
  } catch {
    return [];
  }

  const pattern = path.join(skillsDir, '*/SKILL.md').replace(/\\/g, '/');
  const files = await glob(pattern);

  return files.map((file) => {
    const skillDir = path.dirname(file);
    return path.basename(skillDir);
  });
}

// Read skill file
export async function readSkill(skillName, baseDir = process.cwd()) {
  const skillPath = getSkillFilePath(skillName, baseDir);
  return fs.readFile(skillPath, 'utf-8');
}

// Write skill file
export async function writeSkill(skillName, content, baseDir = process.cwd()) {
  const skillDir = getSkillPath(skillName, baseDir);
  const skillFile = getSkillFilePath(skillName, baseDir);

  // Ensure directory exists
  await fs.mkdir(skillDir, { recursive: true });

  // Write file
  await fs.writeFile(skillFile, content, 'utf-8');

  return skillFile;
}

// Create skill directory structure
export async function createSkillStructure(skillName, baseDir = process.cwd()) {
  const skillDir = getSkillPath(skillName, baseDir);

  // Create directories
  await fs.mkdir(path.join(skillDir, 'scripts'), { recursive: true });
  await fs.mkdir(path.join(skillDir, 'resources', 'transcripts'), { recursive: true });
  await fs.mkdir(path.join(skillDir, 'resources', 'examples'), { recursive: true });

  return skillDir;
}

// Delete a skill
export async function deleteSkill(skillName, baseDir = process.cwd()) {
  const skillDir = getSkillPath(skillName, baseDir);
  await fs.rm(skillDir, { recursive: true, force: true });
}

// Copy skill to another location
export async function copySkill(skillName, destPath, baseDir = process.cwd()) {
  const skillDir = getSkillPath(skillName, baseDir);
  await fs.cp(skillDir, destPath, { recursive: true });
}

// Get home directory
export function getHomeDir() {
  return os.homedir();
}

// Get global skills directory
export function getGlobalSkillsDir() {
  return path.join(getHomeDir(), '.claude', 'skills');
}

// Ensure directory exists
export async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

// Read JSON file
export async function readJson(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

// Write JSON file
export async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export default {
  getSkillsDir,
  resolveSkillsDir,
  getSkillPath,
  getSkillFilePath,
  skillExists,
  listSkills,
  readSkill,
  writeSkill,
  createSkillStructure,
  deleteSkill,
  copySkill,
  getHomeDir,
  getGlobalSkillsDir,
  ensureDir,
  readJson,
  writeJson,
};
