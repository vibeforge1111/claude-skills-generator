/**
 * Testing Domain Knowledge
 * Unit testing, integration testing, E2E testing, test automation
 */

export default {
  key: 'testing',
  name: 'Testing & QA',
  description: 'Unit testing, integration testing, E2E testing, test automation',

  tools: ['jest', 'vitest', 'playwright', 'cypress', 'pytest', 'mocha', 'testing-library', 'msw'],

  mcps: {
    required: ['filesystem'],
    recommended: ['git'],
    optional: ['browser-tools'],
  },

  patterns: [
    'test',
    'spec',
    'unit',
    'integration',
    'e2e',
    'end-to-end',
    'mock',
    'stub',
    'fixture',
    'coverage',
    'assertion',
    'TDD',
    'BDD',
    'regression',
    'snapshot',
    'playwright',
    'cypress',
  ],

  trainingSources: {
    curated: [
      {
        type: 'doc',
        url: 'https://vitest.dev/guide/',
        topics: ['unit-testing', 'mocking', 'coverage'],
      },
      {
        type: 'doc',
        url: 'https://playwright.dev/docs/intro',
        topics: ['e2e', 'browser-automation', 'selectors'],
      },
      {
        type: 'doc',
        url: 'https://testing-library.com/docs/',
        topics: ['component-testing', 'queries', 'best-practices'],
      },
    ],
    youtube: [
      { id: 'vitest-intro', title: 'Vitest Complete Guide', duration: '25m' },
      { id: 'playwright-e2e', title: 'Playwright E2E Testing', duration: '40m' },
      { id: 'tdd-tutorial', title: 'TDD in Practice', duration: '30m' },
    ],
  },

  archetypes: ['test-runner', 'e2e-automator', 'coverage-analyzer', 'mock-generator'],

  defaultMascot: {
    name: 'TEST-BOT',
    personality: 'methodical, thorough, persistent',
  },

  capabilityLevels: {
    basic: {
      tools: ['vitest'],
      mcps: ['filesystem'],
      training: [],
      description: 'Basic unit testing',
    },
    standard: {
      tools: ['vitest', 'testing-library'],
      mcps: ['filesystem', 'git'],
      training: ['unit-testing-basics'],
      description: 'Unit and component testing',
    },
    expert: {
      tools: ['vitest', 'playwright', 'msw'],
      mcps: ['filesystem', 'git', 'browser-tools'],
      training: ['testing-advanced', 'mocking-strategies'],
      description: 'Full testing suite with E2E',
    },
    stacked: {
      tools: ['vitest', 'playwright', 'cypress', 'msw', 'testing-library'],
      mcps: ['filesystem', 'git', 'github', 'browser-tools'],
      training: ['testing-full-course', 'tdd-mastery'],
      description: 'Enterprise testing infrastructure',
    },
  },

  commonErrors: [
    {
      pattern: 'test timeout',
      tool: 'vitest',
      solution: 'Increase timeout with { timeout: 10000 } or check for async issues',
    },
    {
      pattern: 'element not found',
      tool: 'playwright',
      solution: 'Use waitFor or check selector specificity',
    },
    {
      pattern: 'mock not called',
      tool: 'jest',
      solution: 'Ensure mock is imported before the module being tested',
    },
  ],
};
