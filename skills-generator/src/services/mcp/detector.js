// Known MCP servers and their detection patterns
const MCP_REGISTRY = {
  filesystem: {
    name: 'filesystem',
    package: '@anthropic/mcp-server-filesystem',
    description: 'Read and write files',
    patterns: [
      /read.*file/i,
      /write.*file/i,
      /file\s*system/i,
      /filesystem/i,
      /create.*file/i,
      /delete.*file/i,
    ],
    defaultArgs: ['./'],
  },
  'browser-tools': {
    name: 'browser-tools',
    package: '@anthropic/mcp-server-puppeteer',
    description: 'Web automation and scraping',
    patterns: [
      /browser/i,
      /puppeteer/i,
      /web.*scraping/i,
      /screenshot/i,
      /automat.*web/i,
    ],
    defaultArgs: [],
  },
  git: {
    name: 'git',
    package: '@anthropic/mcp-server-git',
    description: 'Git operations',
    patterns: [
      /\bgit\b/i,
      /commit/i,
      /branch/i,
      /repository/i,
      /version\s*control/i,
    ],
    defaultArgs: [],
  },
  github: {
    name: 'github',
    package: '@anthropic/mcp-server-github',
    description: 'GitHub API operations',
    patterns: [
      /github/i,
      /pull\s*request/i,
      /issue/i,
      /\bpr\b/i,
    ],
    defaultArgs: [],
  },
  postgres: {
    name: 'postgres',
    package: '@anthropic/mcp-server-postgres',
    description: 'PostgreSQL database',
    patterns: [
      /postgres/i,
      /postgresql/i,
      /\bpg\b/i,
      /sql\s*database/i,
    ],
    defaultArgs: ['postgresql://localhost/db'],
  },
  sqlite: {
    name: 'sqlite',
    package: '@anthropic/mcp-server-sqlite',
    description: 'SQLite database',
    patterns: [
      /sqlite/i,
    ],
    defaultArgs: ['./database.db'],
  },
  fetch: {
    name: 'fetch',
    package: '@anthropic/mcp-server-fetch',
    description: 'HTTP requests',
    patterns: [
      /\bfetch\b/i,
      /http\s*request/i,
      /api\s*call/i,
      /rest\s*api/i,
    ],
    defaultArgs: [],
  },
  memory: {
    name: 'memory',
    package: '@anthropic/mcp-server-memory',
    description: 'Persistent memory storage',
    patterns: [
      /\bmemory\b/i,
      /remember/i,
      /persistent.*storage/i,
    ],
    defaultArgs: [],
  },
};

// Detect required MCPs from skill content
export function detectMcps(content) {
  const detected = new Set();

  for (const [key, mcp] of Object.entries(MCP_REGISTRY)) {
    for (const pattern of mcp.patterns) {
      if (pattern.test(content)) {
        detected.add(key);
        break;
      }
    }
  }

  return Array.from(detected).map((key) => ({
    key,
    ...MCP_REGISTRY[key],
  }));
}

// Get MCP info by name
export function getMcpInfo(name) {
  return MCP_REGISTRY[name] || null;
}

// List all known MCPs
export function listKnownMcps() {
  return Object.entries(MCP_REGISTRY).map(([key, mcp]) => ({
    key,
    ...mcp,
  }));
}

// Check if MCP is known
export function isKnownMcp(name) {
  return name in MCP_REGISTRY;
}

export default {
  detectMcps,
  getMcpInfo,
  listKnownMcps,
  isKnownMcp,
  MCP_REGISTRY,
};
