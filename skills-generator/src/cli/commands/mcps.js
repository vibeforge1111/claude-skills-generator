import chalk from 'chalk';
import logger from '../../lib/logger.js';
import fs from '../../lib/filesystem.js';
import mcp from '../../services/mcp/index.js';

export async function mcpsCommand(name, options) {
  try {
    const baseDir = process.cwd();

    // Check if skill exists
    if (!(await fs.skillExists(name, baseDir))) {
      logger.error(`Skill "${name}" not found`);
      process.exit(1);
    }

    logger.header(`MCP Requirements: ${name}`);
    console.log();

    // Run full analysis
    const analysis = await mcp.fullMcpAnalysis(name, baseDir);

    // Display declared MCPs
    logger.subheader('Declared MCPs');

    if (analysis.declared.required.length > 0) {
      console.log(chalk.cyan('Required:'));
      analysis.declared.required.forEach((m) => {
        const info = mcp.detector.getMcpInfo(m);
        const status = analysis.configured.includes(m) ? chalk.green('✓') : chalk.red('✗');
        console.log(`  ${status} ${m}${info ? chalk.gray(` - ${info.description}`) : ''}`);
      });
    } else {
      console.log(chalk.gray('  No required MCPs declared'));
    }

    if (analysis.declared.optional.length > 0) {
      console.log();
      console.log(chalk.cyan('Optional:'));
      analysis.declared.optional.forEach((m) => {
        const info = mcp.detector.getMcpInfo(m);
        const status = analysis.configured.includes(m) ? chalk.green('✓') : chalk.gray('○');
        console.log(`  ${status} ${m}${info ? chalk.gray(` - ${info.description}`) : ''}`);
      });
    }

    // Display detected MCPs
    if (analysis.detected.length > 0) {
      console.log();
      logger.subheader('Detected from Content');
      analysis.detected.forEach((m) => {
        const declared = analysis.declared.required.includes(m.key) || analysis.declared.optional.includes(m.key);
        const label = declared ? chalk.gray('(declared)') : chalk.yellow('(undeclared)');
        console.log(`  • ${m.key} ${label}`);
      });
    }

    // Show undeclared warning
    if (analysis.undeclared.length > 0) {
      console.log();
      logger.warn('Some detected MCPs are not declared in frontmatter');
      console.log(chalk.gray('  Consider adding them to mcps.required or mcps.optional'));
    }

    // Show missing warning
    if (analysis.missing.length > 0) {
      console.log();
      logger.warn('Missing MCP configurations:');
      analysis.missing.forEach((m) => {
        console.log(chalk.red(`  ✗ ${m}`));
      });
    }

    // Generate config if requested
    if (options.config) {
      console.log();
      logger.subheader('MCP Configuration');
      console.log();
      console.log(chalk.gray('Add to .claude/settings.json:'));
      console.log();
      console.log(mcp.config.generateConfigSnippet(analysis.declared.required));
    }

    // Status
    console.log();
    if (analysis.ready) {
      logger.success('All required MCPs are configured');
    } else {
      logger.warn('Some required MCPs need configuration');
      console.log(chalk.gray(`\nRun with --config to get configuration snippet`));
    }

  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
}

export default mcpsCommand;
