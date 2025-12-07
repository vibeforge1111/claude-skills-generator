import chalk from 'chalk';
import inquirer from 'inquirer';
import logger from '../../lib/logger.js';
import claude from '../../lib/claude.js';
import context from '../../services/context/index.js';

export async function suggestCommand() {
  try {
    logger.header('Skill Suggestions');
    console.log();

    const spin = logger.spinner('Analyzing project...');
    spin.start();

    // Analyze project
    const analysis = await context.analyzeProject();

    spin.succeed('Project analyzed');
    console.log();

    // Show project info
    logger.subheader('Project Context');
    logger.keyValue('Name', analysis.metadata.name);
    if (analysis.techStack.length > 0) {
      logger.keyValue('Tech Stack', analysis.techStack.map((t) => t.name).join(', '));
    }
    if (analysis.structure.directories.length > 0) {
      logger.keyValue('Structure', analysis.structure.directories.join(', '));
    }

    // Get suggestions from context
    const localSuggestions = context.suggestSkillsForStack(analysis.techStack);

    // Get AI suggestions if available
    let aiSuggestions = [];
    if (claude.isConfigured()) {
      const aiSpin = logger.spinner('Getting AI suggestions...');
      aiSpin.start();

      try {
        aiSuggestions = await claude.suggestSkills(analysis.summary);
        aiSpin.succeed('AI suggestions ready');
      } catch {
        aiSpin.fail('AI suggestions unavailable');
      }
    }

    // Combine suggestions
    const allSuggestions = [...localSuggestions];

    // Add AI suggestions that aren't duplicates
    for (const ai of aiSuggestions) {
      if (!allSuggestions.find((s) => s.name === ai.name)) {
        allSuggestions.push(ai);
      }
    }

    if (allSuggestions.length === 0) {
      logger.info('No suggestions available for this project');
      return;
    }

    // Display suggestions
    console.log();
    logger.subheader('Suggested Skills');
    console.log();

    allSuggestions.forEach((s, i) => {
      console.log(chalk.cyan.bold(`${i + 1}. ${s.name}`));
      console.log(chalk.gray(`   ${s.description}`));
      console.log(chalk.gray(`   Template: ${s.template} | ${s.reason}`));
      console.log();
    });

    // Ask if user wants to create any
    const { selected } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selected',
        message: 'Select skills to create:',
        choices: allSuggestions.map((s, i) => ({
          name: `${s.name} - ${s.description}`,
          value: i,
        })),
      },
    ]);

    if (selected.length === 0) {
      logger.info('No skills selected');
      return;
    }

    // Create selected skills
    for (const idx of selected) {
      const suggestion = allSuggestions[idx];
      console.log();
      logger.info(`Creating skill: ${suggestion.name}`);
      console.log(chalk.gray(`Run: skill new ${suggestion.name} -t ${suggestion.template}`));
    }

    console.log();
    logger.success(`${selected.length} skill(s) ready to create`);
    console.log(chalk.gray('Run the commands above to create each skill.'));

  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
}

export default suggestCommand;
