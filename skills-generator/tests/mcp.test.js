import { describe, it, expect } from 'vitest';
import detector from '../src/services/mcp/detector.js';
import config from '../src/services/mcp/config.js';

describe('MCP Detector', () => {
  describe('detectMcps', () => {
    it('should detect filesystem MCP', () => {
      const content = 'This skill reads and writes files to the filesystem.';
      const result = detector.detectMcps(content);

      expect(result.some((m) => m.key === 'filesystem')).toBe(true);
    });

    it('should detect browser-tools MCP', () => {
      const content = 'This skill uses browser automation with puppeteer.';
      const result = detector.detectMcps(content);

      expect(result.some((m) => m.key === 'browser-tools')).toBe(true);
    });

    it('should detect git MCP', () => {
      const content = 'This skill creates commits and manages branches.';
      const result = detector.detectMcps(content);

      expect(result.some((m) => m.key === 'git')).toBe(true);
    });

    it('should detect github MCP', () => {
      const content = 'This skill creates pull requests on GitHub.';
      const result = detector.detectMcps(content);

      expect(result.some((m) => m.key === 'github')).toBe(true);
    });

    it('should detect multiple MCPs', () => {
      const content = 'Read files from filesystem and make HTTP requests to the API.';
      const result = detector.detectMcps(content);

      expect(result.length).toBeGreaterThan(1);
    });

    it('should return empty array for no matches', () => {
      const content = 'This is a simple skill with no special requirements.';
      const result = detector.detectMcps(content);

      expect(result).toHaveLength(0);
    });
  });

  describe('getMcpInfo', () => {
    it('should return info for known MCP', () => {
      const info = detector.getMcpInfo('filesystem');

      expect(info).not.toBeNull();
      expect(info.name).toBe('filesystem');
      expect(info.package).toContain('mcp-server-filesystem');
    });

    it('should return null for unknown MCP', () => {
      const info = detector.getMcpInfo('unknown-mcp');

      expect(info).toBeNull();
    });
  });

  describe('listKnownMcps', () => {
    it('should return all known MCPs', () => {
      const mcps = detector.listKnownMcps();

      expect(mcps.length).toBeGreaterThan(5);
      expect(mcps.some((m) => m.key === 'filesystem')).toBe(true);
    });
  });
});

describe('MCP Config', () => {
  describe('generateMcpConfig', () => {
    it('should generate config for single MCP', () => {
      const result = config.generateMcpConfig(['filesystem']);

      expect(result.mcpServers).toBeDefined();
      expect(result.mcpServers.filesystem).toBeDefined();
      expect(result.mcpServers.filesystem.command).toBe('npx');
    });

    it('should generate config for multiple MCPs', () => {
      const result = config.generateMcpConfig(['filesystem', 'git']);

      expect(Object.keys(result.mcpServers)).toHaveLength(2);
    });

    it('should use custom args when provided', () => {
      const result = config.generateMcpConfig(['filesystem'], {
        customArgs: { filesystem: ['/custom/path'] },
      });

      expect(result.mcpServers.filesystem.args).toContain('/custom/path');
    });
  });

  describe('generateConfigSnippet', () => {
    it('should return valid JSON string', () => {
      const result = config.generateConfigSnippet(['filesystem']);

      expect(() => JSON.parse(result)).not.toThrow();
    });
  });

  describe('checkMissingMcps', () => {
    it('should identify missing MCPs', () => {
      const required = ['filesystem', 'git', 'github'];
      const configured = { filesystem: {} };

      const missing = config.checkMissingMcps(required, configured);

      expect(missing).toContain('git');
      expect(missing).toContain('github');
      expect(missing).not.toContain('filesystem');
    });

    it('should return empty when all configured', () => {
      const required = ['filesystem'];
      const configured = { filesystem: {} };

      const missing = config.checkMissingMcps(required, configured);

      expect(missing).toHaveLength(0);
    });
  });
});
