/**
 * Documentation Domain Knowledge
 * Documentation generation, markdown, technical writing
 */

export default {
  key: 'documentation',
  name: 'Documentation',
  description: 'Documentation generation, markdown, technical writing, API docs',

  tools: ['markdown', 'jsdoc', 'typedoc', 'docusaurus', 'mkdocs', 'readme', 'swagger-ui'],

  mcps: {
    required: ['filesystem'],
    recommended: ['git'],
    optional: ['browser-tools', 'github'],
  },

  patterns: [
    'documentation',
    'docs',
    'readme',
    'markdown',
    'wiki',
    'jsdoc',
    'typedoc',
    'API docs',
    'guide',
    'tutorial',
    'reference',
    'changelog',
    'comments',
    'docstring',
  ],

  trainingSources: {
    curated: [
      {
        type: 'doc',
        url: 'https://www.markdownguide.org/',
        topics: ['syntax', 'extended-syntax', 'best-practices'],
      },
      {
        type: 'doc',
        url: 'https://jsdoc.app/',
        topics: ['tags', 'types', 'templates'],
      },
      {
        type: 'doc',
        url: 'https://docusaurus.io/docs',
        topics: ['static-sites', 'versioning', 'search'],
      },
    ],
    youtube: [
      { id: 'markdown-tutorial', title: 'Markdown Complete Guide', duration: '15m' },
      { id: 'jsdoc-basics', title: 'JSDoc for Beginners', duration: '20m' },
      { id: 'docusaurus-setup', title: 'Docusaurus Documentation Site', duration: '30m' },
    ],
  },

  archetypes: ['documentation-generator', 'readme-writer', 'api-documenter', 'changelog-manager'],

  defaultMascot: {
    name: 'DOC-HELPER',
    personality: 'organized, clear, thorough',
  },

  capabilityLevels: {
    basic: {
      tools: ['markdown'],
      mcps: ['filesystem'],
      training: [],
      description: 'Basic markdown documentation',
    },
    standard: {
      tools: ['markdown', 'jsdoc'],
      mcps: ['filesystem', 'git'],
      training: ['markdown-basics'],
      description: 'Markdown and code documentation',
    },
    expert: {
      tools: ['markdown', 'jsdoc', 'typedoc'],
      mcps: ['filesystem', 'git', 'github'],
      training: ['documentation-best-practices'],
      description: 'Full documentation suite',
    },
    stacked: {
      tools: ['markdown', 'jsdoc', 'typedoc', 'docusaurus', 'swagger-ui'],
      mcps: ['filesystem', 'git', 'github', 'browser-tools'],
      training: ['documentation-full-course'],
      description: 'Enterprise documentation pipeline',
    },
  },

  commonErrors: [
    {
      pattern: 'broken link',
      tool: 'markdown',
      solution: 'Check relative paths and ensure target files exist',
    },
    {
      pattern: 'undocumented',
      tool: 'jsdoc',
      solution: 'Add @param and @returns tags to functions',
    },
    {
      pattern: 'build failed',
      tool: 'docusaurus',
      solution: 'Check frontmatter syntax and file structure',
    },
  ],
};
