import chalk from 'chalk';
import logger from '../../lib/logger.js';
import generator from '../../services/generator/index.js';
import { runNewSkillWizard, runTemplatePrompts, confirmCreate, askPostCreate } from '../prompts/wizard.js';
import fs from '../../lib/filesystem.js';

export async function newCommand(name, options, command) {
  try {
    // Get global options from parent command
    const globalOpts = command?.parent?.opts?.() || {};

    // Run wizard to gather info
    const wizardData = await runNewSkillWizard(name, {
      sarcasm: globalOpts.sarcasm || false,
      noMascot: globalOpts.mascot === false,
    });

    // Get template-specific prompts
    const templateData = await runTemplatePrompts(wizardData.template);

    // Get project context if requested
    let projectContext = null;
    if (wizardData.scanContext && !options.noContext) {
      projectContext = await scanProjectContext();
    }

    // Show summary and confirm
    const outputPath = fs.getSkillFilePath(wizardData.name);
    const confirmed = await confirmCreate(wizardData.name, outputPath);

    if (!confirmed) {
      logger.info('Skill creation cancelled');
      return;
    }

    // Generate the skill
    const result = await generator.generateSkill({
      name: wizardData.name,
      description: wizardData.description,
      template: wizardData.template,
      templateData: {
        ...templateData,
        mcps: {
          required: wizardData.mcps,
          optional: [],
        },
      },
      useAI: wizardData.useAI && !options.noAi,
      projectContext,
    });

    // Success!
    console.log();
    logger.success(`Skill created: ${chalk.cyan(result.path)}`);

    // Ask about post-creation actions
    const actions = await askPostCreate();

    if (actions.includes('validate')) {
      console.log(chalk.yellow('\nRun: skill validate ' + wizardData.name));
    }
    if (actions.includes('test')) {
      console.log(chalk.yellow('\nRun: skill test ' + wizardData.name));
    }
    if (actions.includes('edit')) {
      console.log(chalk.yellow('\nRun: skill edit ' + wizardData.name));
    }

  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
}

// Scan current project for context
async function scanProjectContext() {
  const spin = logger.spinner('Scanning project context...');
  spin.start();

  const context = [];

  try {
    // Check for package.json
    try {
      const pkg = await fs.readJson('package.json');
      context.push(`Project: ${pkg.name || 'Node.js project'}`);
      if (pkg.dependencies) {
        const deps = Object.keys(pkg.dependencies).slice(0, 10);
        context.push(`Dependencies: ${deps.join(', ')}`);
      }
    } catch {
      // Not a Node project
    }

    // Check for common config files
    const configFiles = [
      'tsconfig.json',
      'vite.config.js',
      'next.config.js',
      'webpack.config.js',
      '.eslintrc.json',
      'pyproject.toml',
      'Cargo.toml',
      'go.mod',
    ];

    for (const file of configFiles) {
      try {
        await fs.readJson(file).catch(() => null);
        context.push(`Config: ${file}`);
      } catch {
        // File doesn't exist
      }
    }

    spin.succeed('Project context scanned');

    if (context.length === 0) {
      return null;
    }

    return context.join('\n');
  } catch {
    spin.fail('Could not scan project context');
    return null;
  }
}

export default newCommand;
