import chalk from 'chalk';
import inquirer from 'inquirer';
import logger from '../../lib/logger.js';
import fs from '../../lib/filesystem.js';
import claude from '../../lib/claude.js';
import trainer from '../../services/trainer/index.js';

export async function trainCommand(name, options) {
  try {
    const baseDir = process.cwd();

    // Check if skill exists
    if (!(await fs.skillExists(name, baseDir))) {
      logger.error(`Skill "${name}" not found`);
      process.exit(1);
    }

    // Get YouTube URLs
    let urls = options.youtube || [];

    if (urls.length === 0) {
      const { inputUrls } = await inquirer.prompt([
        {
          type: 'input',
          name: 'inputUrls',
          message: 'Enter YouTube URLs (comma-separated):',
          validate: (input) => input.trim().length > 0 || 'At least one URL required',
        },
      ]);
      urls = inputUrls.split(',').map((u) => u.trim()).filter(Boolean);
    }

    if (urls.length === 0) {
      logger.error('No URLs provided');
      process.exit(1);
    }

    logger.header(`Training: ${name}`);
    console.log();
    logger.info(`Processing ${urls.length} video(s)...`);
    console.log();

    // Check if Claude is configured for knowledge extraction
    if (!claude.isConfigured()) {
      logger.warn('Claude API not configured - transcripts will be saved but not analyzed');
    }

    // Run training
    const spin = logger.spinner('Fetching transcripts...');
    spin.start();

    const result = await trainer.trainWithYouTube(name, urls, { baseDir });

    spin.succeed('Training complete');
    console.log();

    // Display transcript results
    logger.subheader('Transcripts');
    logger.keyValue('Fetched', `${result.transcripts.successful}/${result.transcripts.total}`);
    logger.keyValue('Total Words', result.transcripts.totalWords.toLocaleString());

    if (result.transcripts.failed > 0) {
      logger.warn(`${result.transcripts.failed} transcript(s) failed to fetch`);
    }

    // Display extracted knowledge
    if (claude.isConfigured()) {
      console.log();
      logger.subheader('Extracted Knowledge');

      if (result.knowledge.techniques.length > 0) {
        console.log(chalk.cyan('Techniques:'));
        result.knowledge.techniques.slice(0, 5).forEach((t) => {
          logger.listItem(t, 1);
        });
        if (result.knowledge.techniques.length > 5) {
          console.log(chalk.gray(`  ... and ${result.knowledge.techniques.length - 5} more`));
        }
      }

      if (result.knowledge.antiPatterns.length > 0) {
        console.log();
        console.log(chalk.yellow('Anti-Patterns:'));
        result.knowledge.antiPatterns.slice(0, 3).forEach((a) => {
          logger.listItem(a, 1);
        });
      }

      if (result.knowledge.keyInsights.length > 0) {
        console.log();
        console.log(chalk.green('Key Insights:'));
        result.knowledge.keyInsights.slice(0, 3).forEach((k) => {
          logger.listItem(k, 1);
        });
      }
    }

    // Show skill path
    console.log();
    const skillPath = fs.getSkillFilePath(name, baseDir);
    logger.success(`Skill enriched: ${skillPath}`);

    // Suggest next steps
    console.log();
    console.log(chalk.gray('Next steps:'));
    console.log(chalk.gray(`  skill validate ${name}  - Check skill quality`));
    console.log(chalk.gray(`  skill test ${name}      - Test in playground`));

  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
}

export default trainCommand;
