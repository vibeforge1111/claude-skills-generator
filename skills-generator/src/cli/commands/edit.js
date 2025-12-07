import { spawn } from 'child_process';
import chalk from 'chalk';
import logger from '../../lib/logger.js';
import fs from '../../lib/filesystem.js';
import parser from '../../lib/parser.js';

export async function editCommand(name, options) {
  try {
    const baseDir = process.cwd();

    // Check if skill exists
    if (!(await fs.skillExists(name, baseDir))) {
      logger.error(`Skill "${name}" not found`);
      console.log(chalk.gray(`\nCreate it with: skill new ${name}`));
      process.exit(1);
    }

    const skillPath = fs.getSkillFilePath(name, baseDir);

    // Show current skill info
    const content = await fs.readSkill(name, baseDir);
    const { frontmatter, sections } = parser.parseSkill(content);

    logger.header(`Editing: ${name}`);
    console.log();
    logger.keyValue('Path', skillPath);
    logger.keyValue('Version', frontmatter.version || '1.0.0');
    logger.keyValue('Sections', Object.keys(sections).join(', ') || 'none');
    console.log();

    // Determine editor
    const editor = process.env.EDITOR || process.env.VISUAL || getDefaultEditor();

    if (!editor) {
      logger.warn('No editor found. Set EDITOR environment variable.');
      console.log(chalk.gray(`\nFile location: ${skillPath}`));
      console.log(chalk.gray('Open this file in your preferred editor.'));
      return;
    }

    logger.info(`Opening in ${editor}...`);

    // Open editor
    const child = spawn(editor, [skillPath], {
      stdio: 'inherit',
      shell: true,
    });

    child.on('error', (error) => {
      logger.error(`Failed to open editor: ${error.message}`);
      console.log(chalk.gray(`\nFile location: ${skillPath}`));
    });

    child.on('close', async (code) => {
      if (code === 0) {
        // Re-read and validate after edit
        try {
          const newContent = await fs.readSkill(name, baseDir);
          const parsed = parser.parseSkill(newContent);
          const validation = parser.validateFrontmatter(parsed.frontmatter);

          console.log();
          if (validation.valid) {
            logger.success('Skill saved and validated');
          } else {
            logger.warn('Skill saved but has validation issues:');
            validation.errors.forEach((err) => {
              logger.listItem(err, 1);
            });
            console.log(chalk.gray('\nRun: skill validate ' + name));
          }
        } catch (error) {
          logger.warn(`Skill saved but could not validate: ${error.message}`);
        }
      }
    });

  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
}

// Get default editor based on platform
function getDefaultEditor() {
  if (process.platform === 'win32') {
    return 'notepad';
  }
  return 'nano';
}

export default editCommand;
