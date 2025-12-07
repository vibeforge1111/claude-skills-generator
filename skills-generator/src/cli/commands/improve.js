import inquirer from 'inquirer';
import chalk from 'chalk';
import logger from '../../lib/logger.js';
import fs from '../../lib/filesystem.js';
import claude from '../../lib/claude.js';
import validator from '../../services/validator/index.js';
import aiReview from '../../services/validator/ai-review.js';

export async function improveCommand(name, options) {
  try {
    const baseDir = process.cwd();

    // Check if skill exists
    if (!(await fs.skillExists(name, baseDir))) {
      logger.error(`Skill "${name}" not found`);
      process.exit(1);
    }

    // Check if Claude is configured
    if (!claude.isConfigured()) {
      logger.error('Claude API not configured');
      console.log(chalk.gray('\nSet ANTHROPIC_API_KEY environment variable for AI improvements.'));
      process.exit(1);
    }

    logger.header(`Improving: ${name}`);
    console.log();

    // Read skill content
    const content = await fs.readSkill(name, baseDir);

    // Run validation to find issues
    const spin = logger.spinner('Analyzing skill...');
    spin.start();

    const validationResult = await validator.validateSkill(content);
    const aiResult = await aiReview.reviewWithAI(content);

    spin.stop();

    // Collect all issues
    const issues = [];

    // Add schema errors
    if (!validationResult.schema.valid) {
      validationResult.schema.errors.forEach((e) => {
        issues.push({ severity: 'high', message: `Schema: ${e}` });
      });
    }

    // Add quality suggestions
    validationResult.suggestions.forEach((s) => {
      issues.push({ severity: 'medium', message: s });
    });

    // Add AI gaps
    if (aiResult.gaps) {
      aiResult.gaps.forEach((g) => {
        issues.push({ severity: 'low', message: g });
      });
    }

    if (issues.length === 0) {
      logger.success('No improvements needed - skill looks great!');
      return;
    }

    // Display issues
    logger.subheader('Issues Found');
    console.log();

    issues.forEach((issue, i) => {
      const severityColor = issue.severity === 'high' ? chalk.red : issue.severity === 'medium' ? chalk.yellow : chalk.blue;
      console.log(`${i + 1}. ${severityColor(`[${issue.severity.toUpperCase()}]`)} ${issue.message}`);
    });

    console.log();

    // Ask which to fix
    if (options.auto) {
      // Auto-apply all
      await applyImprovements(name, content, issues, baseDir);
    } else {
      // Interactive mode
      const { selectedIssues } = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'selectedIssues',
          message: 'Select issues to fix:',
          choices: issues.map((issue, i) => ({
            name: `${issue.message}`,
            value: i,
            checked: issue.severity === 'high',
          })),
        },
      ]);

      if (selectedIssues.length === 0) {
        logger.info('No issues selected');
        return;
      }

      const selectedMessages = selectedIssues.map((i) => issues[i].message);
      await applyImprovements(name, content, selectedMessages.map((m) => ({ message: m })), baseDir);
    }

  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
}

async function applyImprovements(name, content, issues, baseDir) {
  const spin = logger.spinner('Generating improvements...');
  spin.start();

  try {
    const improvedContent = await claude.improveSkill(
      content,
      issues.map((i) => i.message).join('\n')
    );

    spin.succeed('Improvements generated');

    // Show diff preview
    console.log();
    logger.subheader('Preview');
    console.log(chalk.gray('─'.repeat(60)));
    console.log(improvedContent.substring(0, 500) + '...');
    console.log(chalk.gray('─'.repeat(60)));

    // Confirm
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Apply these improvements?',
        default: true,
      },
    ]);

    if (!confirm) {
      logger.info('Improvements discarded');
      return;
    }

    // Save
    await fs.writeSkill(name, improvedContent, baseDir);

    // Re-validate
    const newResult = await validator.validateSkill(improvedContent);
    const oldScore = (await validator.validateSkill(content)).quality.score;
    const newScore = newResult.quality.score;

    console.log();
    logger.success('Skill improved!');
    console.log(`  Quality: ${oldScore} → ${chalk.green(newScore)}`);

  } catch (error) {
    spin.fail('Improvement failed');
    throw error;
  }
}

export default improveCommand;
