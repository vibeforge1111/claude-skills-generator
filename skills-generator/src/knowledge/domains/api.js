/**
 * API Domain Knowledge
 * API integration, REST, GraphQL, webhooks
 */

export default {
  key: 'api',
  name: 'API Integration',
  description: 'REST APIs, GraphQL, webhooks, API design and consumption',

  tools: ['fetch', 'axios', 'graphql', 'openapi', 'postman', 'swagger', 'grpc', 'trpc'],

  mcps: {
    required: ['filesystem'],
    recommended: ['browser-tools'],
    optional: ['git', 'github'],
  },

  patterns: [
    'API',
    'REST',
    'GraphQL',
    'endpoint',
    'request',
    'response',
    'webhook',
    'fetch',
    'HTTP',
    'authentication',
    'OAuth',
    'JWT',
    'rate limit',
    'pagination',
    'OpenAPI',
    'Swagger',
  ],

  trainingSources: {
    curated: [
      {
        type: 'doc',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
        topics: ['fetch', 'requests', 'responses'],
      },
      {
        type: 'doc',
        url: 'https://graphql.org/learn/',
        topics: ['queries', 'mutations', 'schemas'],
      },
      {
        type: 'doc',
        url: 'https://swagger.io/specification/',
        topics: ['openapi', 'documentation', 'schemas'],
      },
    ],
    youtube: [
      { id: 'rest-best-practices', title: 'REST API Best Practices', duration: '20m' },
      { id: 'graphql-intro', title: 'GraphQL Crash Course', duration: '35m' },
      { id: 'oauth-explained', title: 'OAuth 2.0 Explained', duration: '25m' },
    ],
  },

  archetypes: ['api-client', 'graphql-handler', 'webhook-processor', 'api-documenter'],

  defaultMascot: {
    name: 'FETCH-42',
    personality: 'connected, responsive, reliable',
  },

  capabilityLevels: {
    basic: {
      tools: ['fetch'],
      mcps: ['filesystem'],
      training: [],
      description: 'Basic HTTP requests',
    },
    standard: {
      tools: ['fetch', 'axios'],
      mcps: ['filesystem', 'browser-tools'],
      training: ['api-basics'],
      description: 'REST API integration',
    },
    expert: {
      tools: ['fetch', 'axios', 'graphql'],
      mcps: ['filesystem', 'browser-tools', 'git'],
      training: ['api-advanced', 'graphql-basics'],
      description: 'REST and GraphQL integration',
    },
    stacked: {
      tools: ['fetch', 'axios', 'graphql', 'openapi', 'trpc'],
      mcps: ['filesystem', 'browser-tools', 'git', 'github'],
      training: ['api-full-course'],
      description: 'Enterprise API integration suite',
    },
  },

  commonErrors: [
    {
      pattern: 'CORS',
      tool: 'fetch',
      solution: 'Configure server CORS headers or use a proxy',
    },
    {
      pattern: '401 Unauthorized',
      tool: 'api',
      solution: 'Check authentication token/credentials',
    },
    {
      pattern: '429 Too Many Requests',
      tool: 'api',
      solution: 'Implement rate limiting/backoff strategy',
    },
  ],
};
