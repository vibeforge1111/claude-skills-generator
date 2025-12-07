import inquirer from 'inquirer';
import chalk from 'chalk';
import mascot from '../../mascot/index.js';
import knowledge from '../../knowledge/index.js';

// Template choices
const TEMPLATES = [
  { name: 'Basic - General purpose skill', value: 'basic' },
  { name: 'Debugging - Systematic troubleshooting', value: 'debugging' },
  { name: 'Document - File processing and extraction', value: 'document' },
  { name: 'API - External API integration', value: 'api' },
];

// Capability levels
const CAPABILITY_LEVELS = [
  { name: 'Basic - Simple task, minimal context', value: 'basic' },
  { name: 'Standard - Multiple steps, error handling', value: 'standard' },
  { name: 'Expert - Domain expertise, tool integration', value: 'expert' },
  { name: 'Stacked - Full pipeline, extensive training', value: 'stacked' },
];

// Training depth options
const TRAINING_DEPTHS = [
  { name: 'None - Use defaults only', value: 'none' },
  { name: 'Curated - Recommended sources', value: 'curated' },
  { name: 'Extended - Include tutorials & docs', value: 'extended' },
  { name: 'Custom - Provide your own URLs', value: 'custom' },
];

// Get domain-aware MCP choices
function getMcpChoices(domain) {
  const baseMcps = [
    { name: 'filesystem - Read/write files', value: 'filesystem' },
    { name: 'git - Git operations', value: 'git' },
    { name: 'github - GitHub API', value: 'github' },
    { name: 'browser-tools - Web automation', value: 'browser-tools' },
    { name: 'database - Database access', value: 'database' },
  ];

  // Pre-select based on domain
  const domainInfo = knowledge.getDomain(domain);
  if (domainInfo) {
    return baseMcps.map((mcp) => ({
      ...mcp,
      checked: domainInfo.mcps.includes(mcp.value),
    }));
  }
  return baseMcps;
}

// Run the new skill wizard with progressive questions
export async function runNewSkillWizard(initialName, options = {}) {
  const { sarcasm = false, noMascot = false } = options;

  // Configure mascot
  mascot.configureMascot({ enabled: !noMascot, sarcasm });

  // Welcome
  mascot.welcome();
  console.log();
  console.log(chalk.gray('─'.repeat(50)));
  console.log();

  // Q1: Basic info
  const basicInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Skill name:',
      default: initialName,
      validate: (input) => {
        if (!input) return 'Name is required';
        if (!/^[a-z][a-z0-9-]*$/.test(input)) {
          return 'Lowercase, start with letter, use hyphens';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'description',
      message: 'What should this skill do?',
      validate: (input) => {
        if (!input) return 'Description is required';
        if (input.length < 10) return 'Be more specific (10+ chars)';
        return true;
      },
    },
  ]);

  // Detect domain from description
  const detectedDomain = knowledge.detectDomain(basicInfo.description);

  // Q2: Domain selection
  const domainChoices = knowledge.listDomains().map((d) => ({
    name: d.name,
    value: d.key,
  }));
  domainChoices.push({ name: 'Other / Custom', value: 'custom' });

  const { domain } = await inquirer.prompt([
    {
      type: 'list',
      name: 'domain',
      message: 'What domain is this skill for?',
      choices: domainChoices,
      default: detectedDomain || 'custom',
    },
  ]);

  // Q3: Capability level
  const { capabilityLevel } = await inquirer.prompt([
    {
      type: 'list',
      name: 'capabilityLevel',
      message: 'How capable should this skill be?',
      choices: CAPABILITY_LEVELS,
      default: 'standard',
    },
  ]);

  // Q4: Tools/MCPs (domain-aware)
  const { mcps } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'mcps',
      message: 'Which MCP servers does this skill need?',
      choices: getMcpChoices(domain),
    },
  ]);

  // Q5: Training depth (based on capability)
  let trainingDepth = 'none';
  let customTrainingUrls = [];

  if (capabilityLevel !== 'basic') {
    const trainingAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'trainingDepth',
        message: 'How much training should we include?',
        choices: TRAINING_DEPTHS,
        default: capabilityLevel === 'stacked' ? 'extended' : 'curated',
      },
    ]);
    trainingDepth = trainingAnswer.trainingDepth;

    if (trainingDepth === 'custom') {
      const { urls } = await inquirer.prompt([
        {
          type: 'input',
          name: 'urls',
          message: 'Training URLs (comma-separated):',
        },
      ]);
      customTrainingUrls = urls.split(',').map((u) => u.trim()).filter(Boolean);
    }
  }

  // Q6: Mascot (optional)
  let skillMascot = null;
  const { wantsMascot } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'wantsMascot',
      message: 'Should this skill have its own mascot?',
      default: capabilityLevel === 'expert' || capabilityLevel === 'stacked',
    },
  ]);

  if (wantsMascot) {
    const suggestedMascot = knowledge.getSuggestedMascot(domain);
    const mascotAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'mascotName',
        message: 'Name your mascot:',
        default: suggestedMascot.name,
      },
      {
        type: 'input',
        name: 'mascotPersonality',
        message: 'Personality (e.g., "vigilant, terse"):',
        default: suggestedMascot.personality,
      },
    ]);
    skillMascot = {
      name: mascotAnswers.mascotName,
      personality: mascotAnswers.mascotPersonality,
      domain,
    };
  }

  // Q7: Template & AI
  const finalOptions = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Base template:',
      choices: TEMPLATES,
      default: domain === 'api' ? 'api' : 'basic',
    },
    {
      type: 'confirm',
      name: 'scanContext',
      message: 'Scan current project for context?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'useAI',
      message: 'Use AI to generate content?',
      default: true,
    },
  ]);

  return {
    ...basicInfo,
    domain,
    capabilityLevel,
    mcps,
    trainingDepth,
    customTrainingUrls,
    mascot: skillMascot,
    ...finalOptions,
  };
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
export async function confirmCreate(skillName, outputPath, wizardData = {}) {
  console.log();
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.bold('Summary:'));
  console.log(`  Skill: ${chalk.cyan(skillName)}`);
  console.log(`  Path: ${chalk.gray(outputPath)}`);

  if (wizardData.domain) {
    console.log(`  Domain: ${chalk.yellow(wizardData.domain)}`);
  }
  if (wizardData.capabilityLevel) {
    console.log(`  Level: ${chalk.yellow(wizardData.capabilityLevel)}`);
  }
  if (wizardData.mcps && wizardData.mcps.length > 0) {
    console.log(`  MCPs: ${chalk.green(wizardData.mcps.join(', '))}`);
  }
  if (wizardData.mascot) {
    console.log(`  Mascot: ${chalk.magenta(wizardData.mascot.name)}`);
  }
  console.log();

  // Show mascot thinking
  mascot.thinking('Preparing to create skill...');

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
