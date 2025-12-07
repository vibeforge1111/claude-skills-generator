import chalk from 'chalk';
import logger from '../../lib/logger.js';
import fs from '../../lib/filesystem.js';
import parser from '../../lib/parser.js';

export async function listCommand(options) {
  try {
    const baseDir = options.dir || process.cwd();
    const skillsDir = fs.resolveSkillsDir(baseDir);

    logger.header('Installed Skills');
    logger.keyValue('Directory', skillsDir);
    console.log();

    const skills = await fs.listSkills(baseDir);

    if (skills.length === 0) {
      logger.info('No skills found');
      console.log();
      console.log(chalk.gray('Create your first skill with: skill new'));
      return;
    }

    // Get info for each skill
    for (const skillName of skills) {
      try {
        const content = await fs.readSkill(skillName, baseDir);
        const { frontmatter } = parser.parseSkill(content);

        console.log(chalk.cyan.bold(skillName));
        if (frontmatter.description) {
          console.log(chalk.gray(`  ${frontmatter.description}`));
        }
        if (frontmatter.version) {
          console.log(chalk.gray(`  v${frontmatter.version}`));
        }
        if (frontmatter.mcps?.required?.length > 0) {
          console.log(chalk.gray(`  MCPs: ${frontmatter.mcps.required.join(', ')}`));
        }
        console.log();
      } catch (error) {
        console.log(chalk.cyan.bold(skillName));
        console.log(chalk.red(`  Error reading skill: ${error.message}`));
        console.log();
      }
    }

    logger.info(`${skills.length} skill(s) found`);

  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
}

export default listCommand;
