import inquirer from 'inquirer';
import chalk from 'chalk';

// Template choices
const TEMPLATES = [
  { name: 'Basic - General purpose skill', value: 'basic' },
  { name: 'Debugging - Systematic troubleshooting', value: 'debugging' },
  { name: 'Document - File processing and extraction', value: 'document' },
  { name: 'API - External API integration', value: 'api' },
];

// Common MCP servers
const COMMON_MCPS = [
  { name: 'filesystem - Read/write files', value: 'filesystem' },
  { name: 'browser-tools - Web automation', value: 'browser-tools' },
  { name: 'git - Git operations', value: 'git' },
  { name: 'database - Database access', value: 'database' },
];

// Run the new skill wizard
export async function runNewSkillWizard(initialName) {
  console.log();
  console.log(chalk.cyan.bold('🔮 Create New Skill'));
  console.log(chalk.gray('─'.repeat(40)));
  console.log();

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Skill name:',
      default: initialName,
      validate: (input) => {
        if (!input) return 'Name is required';
        if (!/^[a-z][a-z0-9-]*$/.test(input)) {
          return 'Name must be lowercase, start with a letter, and contain only letters, numbers, and hyphens';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'description',
      message: 'Description:',
      validate: (input) => {
        if (!input) return 'Description is required';
        if (input.length < 10) return 'Description must be at least 10 characters';
        return true;
      },
    },
    {
      type: 'list',
      name: 'template',
      message: 'Template:',
      choices: TEMPLATES,
    },
    {
      type: 'confirm',
      name: 'scanContext',
      message: 'Scan current project for context?',
      default: true,
    },
    {
      type: 'checkbox',
      name: 'mcps',
      message: 'Required MCP servers:',
      choices: COMMON_MCPS,
    },
    {
      type: 'confirm',
      name: 'useAI',
      message: 'Use AI to generate skill content?',
      default: true,
    },
  ]);

  return answers;
}

// Prompt for additional wizard options based on template
export async function runTemplatePrompts(template) {
  const prompts = [];

  switch (template) {
    case 'debugging':
      prompts.push({
        type: 'input',
        name: 'topic',
        message: 'What topic/technology is this debugging skill for?',
        default: 'general',
      });
      break;

    case 'document':
      prompts.push({
        type: 'input',
        name: 'documentType',
        message: 'What document type will this process?',
        default: 'JSON',
      });
      break;

    case 'api':
      prompts.push(
        {
          type: 'input',
          name: 'apiName',
          message: 'API name:',
          default: 'External API',
        },
        {
          type: 'input',
          name: 'apiBaseUrl',
          message: 'API base URL:',
          default: 'https://api.example.com',
        }
      );
      break;
  }

  if (prompts.length === 0) {
    return {};
  }

  return inquirer.prompt(prompts);
}

// Confirm before creating
export async function confirmCreate(skillName, outputPath) {
  console.log();
  console.log(chalk.gray('─'.repeat(40)));
  console.log(chalk.bold('Summary:'));
  console.log(`  Skill: ${chalk.cyan(skillName)}`);
  console.log(`  Path: ${chalk.gray(outputPath)}`);
  console.log();

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Create this skill?',
      default: true,
    },
  ]);

  return confirm;
}

// Ask about post-creation actions
export async function askPostCreate() {
  const { actions } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'actions',
      message: 'What would you like to do next?',
      choices: [
        { name: 'Validate the skill', value: 'validate' },
        { name: 'Test in playground', value: 'test' },
        { name: 'Open in editor', value: 'edit' },
      ],
    },
  ]);

  return actions;
}

export default {
  runNewSkillWizard,
  runTemplatePrompts,
  confirmCreate,
  askPostCreate,
};
