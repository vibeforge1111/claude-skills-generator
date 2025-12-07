import chalk from 'chalk';
import logger from '../../lib/logger.js';
import fs from '../../lib/filesystem.js';
import validator from '../../services/validator/index.js';
import aiReview from '../../services/validator/ai-review.js';

export async function validateCommand(name, options) {
  try {
    const baseDir = process.cwd();

    // Check if skill exists
    if (!(await fs.skillExists(name, baseDir))) {
      logger.error(`Skill "${name}" not found`);
      process.exit(1);
    }

    logger.header(`Validating: ${name}`);
    console.log();

    // Read skill content
    const content = await fs.readSkill(name, baseDir);

    // Run validation
    const result = await validator.validateSkill(content);

    // Display schema results
    logger.subheader('Schema Validation');
    if (result.schema.valid) {
      logger.success('Schema valid');
    } else {
      logger.error('Schema invalid');
      result.schema.errors.forEach((err) => {
        logger.listItem(chalk.red(err), 1);
      });
    }

    // Display quality results
    console.log();
    logger.subheader('Quality Score');
    const scoreColor = result.quality.score >= 70 ? chalk.green : result.quality.score >= 50 ? chalk.yellow : chalk.red;
    console.log(`  ${scoreColor(`${result.quality.score}/${result.quality.maxScore}`)} (${result.quality.grade} - ${result.quality.label})`);

    if (options.verbose) {
      console.log();
      console.log(chalk.gray('  Breakdown:'));
      for (const [key, value] of Object.entries(result.quality.breakdown)) {
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^has/, '').trim();
        const check = value > 0 ? chalk.green('✓') : chalk.red('✗');
        console.log(`    ${check} ${label}: ${value}`);
      }
    }

    // Display token results
    if (result.tokens) {
      console.log();
      logger.subheader('Token Analysis');
      const tokenColor = result.tokens.withinRecommended ? chalk.green : chalk.yellow;
      console.log(`  Estimated tokens: ${tokenColor(result.tokens.count)}`);
      console.log(`  ${result.tokens.recommendation}`);
    }

    // Run AI review if enabled
    if (!options.noAi) {
      console.log();
      const aiResult = await aiReview.reviewWithAI(content);

      if (aiResult.available) {
        logger.subheader('AI Review');
        console.log(`  ${aiResult.summary}`);

        if (aiResult.strengths.length > 0 && options.verbose) {
          console.log();
          console.log(chalk.green('  Strengths:'));
          aiResult.strengths.forEach((s) => {
            logger.listItem(s, 2);
          });
        }

        if (aiResult.gaps.length > 0) {
          console.log();
          console.log(chalk.yellow('  Gaps:'));
          aiResult.gaps.forEach((g) => {
            logger.listItem(g, 2);
          });
        }

        if (aiResult.score !== null) {
          console.log();
          console.log(`  AI Score: ${aiResult.score}/100`);
        }
      }
    }

    // Display suggestions
    if (result.suggestions.length > 0) {
      console.log();
      logger.subheader('Suggestions');
      result.suggestions.forEach((s) => {
        logger.listItem(s, 1);
      });
    }

    // Final verdict
    console.log();
    if (result.valid && result.quality.score >= 70) {
      logger.success('Skill passed validation');
    } else if (result.valid) {
      logger.warn('Skill is valid but could be improved');
    } else {
      logger.error('Skill failed validation');
      process.exit(1);
    }

  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
}

export default validateCommand;
