import chalk from 'chalk';
import logger from '../../lib/logger.js';
import fs from '../../lib/filesystem.js';
import claude from '../../lib/claude.js';
import playground from '../../services/playground/index.js';

export async function testCommand(name, options) {
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
      console.log(chalk.gray('\nSet ANTHROPIC_API_KEY environment variable to run tests.'));
      process.exit(1);
    }

    logger.header(`Testing: ${name}`);
    console.log();

    // Read skill content
    const content = await fs.readSkill(name, baseDir);

    // Run playground tests
    const spin = logger.spinner('Running playground tests...');
    spin.start();

    const results = await playground.testSkill(content, {
      customPromptsFile: options.prompts,
      maxTests: 5,
    });

    spin.stop();

    // Display results
    logger.subheader('Test Results');
    console.log();

    for (const result of results.results) {
      const icon = result.success && result.analysis?.quality !== 'poor'
        ? chalk.green('✓')
        : chalk.red('✗');

      console.log(`${icon} ${chalk.bold(result.prompt.id)} (${result.prompt.type})`);
      console.log(chalk.gray(`  Prompt: "${result.prompt.prompt.substring(0, 60)}..."`));

      if (result.success) {
        const quality = result.analysis?.quality || 'unknown';
        const qualityColor = quality === 'good' ? chalk.green : quality === 'fair' ? chalk.yellow : chalk.red;
        console.log(`  Quality: ${qualityColor(quality)}`);

        if (result.analysis?.notes?.length > 0) {
          result.analysis.notes.forEach((note) => {
            console.log(chalk.gray(`  • ${note}`));
          });
        }
      } else {
        console.log(chalk.red(`  Error: ${result.error}`));
      }
      console.log();
    }

    // Display summary
    logger.subheader('Summary');
    const { summary } = results;
    const passColor = summary.passRate >= 80 ? chalk.green : summary.passRate >= 50 ? chalk.yellow : chalk.red;

    console.log(`  Total: ${summary.total}`);
    console.log(`  Passed: ${chalk.green(summary.passed)}`);
    console.log(`  Failed: ${chalk.red(summary.failed)}`);
    console.log(`  Pass Rate: ${passColor(summary.passRate + '%')}`);

    // Display suggestions
    if (results.suggestions.length > 0) {
      console.log();
      logger.subheader('Suggestions');
      results.suggestions.forEach((s) => {
        logger.listItem(s, 1);
      });
    }

    // Final verdict
    console.log();
    if (summary.passRate >= 80) {
      logger.success('Skill passed playground tests');
    } else if (summary.passRate >= 50) {
      logger.warn('Skill partially passed - review suggestions');
    } else {
      logger.error('Skill failed playground tests');
      process.exit(1);
    }

  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
}

export default testCommand;
