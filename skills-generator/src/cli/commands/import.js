import chalk from 'chalk';
import logger from '../../lib/logger.js';
import fs from '../../lib/filesystem.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fsPromises from 'fs/promises';

const execAsync = promisify(exec);

export async function importCommand(url) {
  try {
    logger.header('Import Skill');
    console.log();

    // Parse URL
    const parsed = parseGitHubUrl(url);
    if (!parsed) {
      logger.error('Invalid URL. Supported formats:');
      console.log(chalk.gray('  - https://github.com/user/repo'));
      console.log(chalk.gray('  - https://github.com/user/repo/tree/branch/path/to/skill'));
      console.log(chalk.gray('  - github:user/repo'));
      process.exit(1);
    }

    logger.info(`Importing from: ${parsed.repo}`);
    if (parsed.path) {
      logger.info(`Path: ${parsed.path}`);
    }

    // Create temp directory
    const tempDir = path.join(process.cwd(), '.skill-import-temp');
    await fsPromises.mkdir(tempDir, { recursive: true });

    try {
      // Clone repository
      const spin = logger.spinner('Cloning repository...');
      spin.start();

      const cloneUrl = `https://github.com/${parsed.owner}/${parsed.repo}.git`;
      await execAsync(`git clone --depth 1 ${parsed.branch ? `-b ${parsed.branch}` : ''} ${cloneUrl} "${tempDir}"`, {
        timeout: 60000,
      });

      spin.succeed('Repository cloned');

      // Find skill files
      const skillSourcePath = parsed.path
        ? path.join(tempDir, parsed.path)
        : tempDir;

      // Look for SKILL.md
      const skillFile = path.join(skillSourcePath, 'SKILL.md');
      let skillContent;

      try {
        skillContent = await fsPromises.readFile(skillFile, 'utf-8');
      } catch {
        // Try finding SKILL.md in subdirectories
        const files = await findSkillFiles(skillSourcePath);
        if (files.length === 0) {
          throw new Error('No SKILL.md found in repository');
        }
        if (files.length === 1) {
          skillContent = await fsPromises.readFile(files[0], 'utf-8');
        } else {
          logger.info('Multiple skills found:');
          files.forEach((f) => console.log(chalk.gray(`  - ${path.relative(tempDir, f)}`)));
          throw new Error('Multiple skills found. Specify path in URL.');
        }
      }

      // Extract skill name from content
      const nameMatch = skillContent.match(/^name:\s*(.+)$/m);
      const skillName = nameMatch ? nameMatch[1].trim() : parsed.repo;

      // Check if skill already exists
      if (await fs.skillExists(skillName)) {
        logger.warn(`Skill "${skillName}" already exists`);
        const overwrite = await askOverwrite();
        if (!overwrite) {
          logger.info('Import cancelled');
          return;
        }
      }

      // Copy skill to local directory
      const copySpinner = logger.spinner('Installing skill...');
      copySpinner.start();

      await fs.createSkillStructure(skillName);
      await fs.writeSkill(skillName, skillContent);

      // Copy resources if they exist
      const resourcesDir = path.join(path.dirname(skillFile), 'resources');
      try {
        await fsPromises.access(resourcesDir);
        const destResources = path.join(fs.getSkillPath(skillName), 'resources');
        await fsPromises.cp(resourcesDir, destResources, { recursive: true });
      } catch {
        // No resources directory
      }

      copySpinner.succeed('Skill installed');

      // Show result
      console.log();
      logger.success(`Imported: ${skillName}`);
      logger.keyValue('Location', fs.getSkillFilePath(skillName));

      console.log();
      console.log(chalk.gray('Next steps:'));
      console.log(chalk.gray(`  skill validate ${skillName}`));
      console.log(chalk.gray(`  skill test ${skillName}`));

    } finally {
      // Cleanup temp directory
      await fsPromises.rm(tempDir, { recursive: true, force: true });
    }

  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
}

// Parse GitHub URL
function parseGitHubUrl(url) {
  // github:user/repo format
  const shortMatch = url.match(/^github:([^/]+)\/([^/]+)$/);
  if (shortMatch) {
    return { owner: shortMatch[1], repo: shortMatch[2], branch: null, path: null };
  }

  // Full GitHub URL
  const fullMatch = url.match(/github\.com\/([^/]+)\/([^/]+)(?:\/tree\/([^/]+)\/(.+))?/);
  if (fullMatch) {
    return {
      owner: fullMatch[1],
      repo: fullMatch[2].replace('.git', ''),
      branch: fullMatch[3] || null,
      path: fullMatch[4] || null,
    };
  }

  return null;
}

// Find SKILL.md files recursively
async function findSkillFiles(dir) {
  const files = [];

  async function scan(currentDir) {
    const entries = await fsPromises.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        await scan(fullPath);
      } else if (entry.name === 'SKILL.md') {
        files.push(fullPath);
      }
    }
  }

  await scan(dir);
  return files;
}

// Simple confirm prompt
async function askOverwrite() {
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Overwrite? (y/N) ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

export default importCommand;
