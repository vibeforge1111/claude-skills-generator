import detector from './detector.js';

// Generate MCP config for Claude Code
export function generateMcpConfig(mcpNames, options = {}) {
  const { customArgs = {} } = options;

  const mcpServers = {};

  for (const name of mcpNames) {
    const info = detector.getMcpInfo(name);

    if (info) {
      mcpServers[name] = {
        command: 'npx',
        args: ['-y', info.package, ...(customArgs[name] || info.defaultArgs)],
      };
    } else {
      // Unknown MCP - use generic format
      mcpServers[name] = {
        command: 'npx',
        args: ['-y', `@anthropic/mcp-server-${name}`],
      };
    }
  }

  return { mcpServers };
}

// Generate config snippet as JSON string
export function generateConfigSnippet(mcpNames, options = {}) {
  const config = generateMcpConfig(mcpNames, options);
  return JSON.stringify(config, null, 2);
}

// Generate installation instructions
export function generateInstallInstructions(mcpNames) {
  const instructions = [];

  instructions.push('# MCP Server Installation');
  instructions.push('');
  instructions.push('Add the following to your Claude Code settings:');
  instructions.push('');
  instructions.push('## Location');
  instructions.push('- Project: `.claude/settings.json`');
  instructions.push('- User: `~/.claude/settings.json`');
  instructions.push('');
  instructions.push('## Configuration');
  instructions.push('```json');
  instructions.push(generateConfigSnippet(mcpNames));
  instructions.push('```');
  instructions.push('');
  instructions.push('## Individual Servers');
  instructions.push('');

  for (const name of mcpNames) {
    const info = detector.getMcpInfo(name);
    if (info) {
      instructions.push(`### ${name}`);
      instructions.push(`- Package: \`${info.package}\``);
      instructions.push(`- Description: ${info.description}`);
      if (info.defaultArgs.length > 0) {
        instructions.push(`- Default args: \`${info.defaultArgs.join(' ')}\``);
      }
      instructions.push('');
    }
  }

  return instructions.join('\n');
}

// Parse MCP config from settings file
export function parseMcpConfig(settingsContent) {
  try {
    const settings = JSON.parse(settingsContent);
    return settings.mcpServers || {};
  } catch {
    return {};
  }
}

// Check which required MCPs are missing from config
export function checkMissingMcps(requiredMcps, configuredMcps) {
  const configured = new Set(Object.keys(configuredMcps));
  return requiredMcps.filter((mcp) => !configured.has(mcp));
}

export default {
  generateMcpConfig,
  generateConfigSnippet,
  generateInstallInstructions,
  parseMcpConfig,
  checkMissingMcps,
};
