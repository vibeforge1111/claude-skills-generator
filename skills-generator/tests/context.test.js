import { describe, it, expect } from 'vitest';
import context from '../src/services/context/index.js';
import scanner from '../src/services/context/scanner.js';

describe('Context Scanner', () => {
  describe('scanTechStack', () => {
    it('should detect Node.js from package.json', async () => {
      // This test runs in the skills-generator directory which has package.json
      const result = await scanner.scanTechStack();

      expect(result.some((t) => t.key === 'node')).toBe(true);
    });

    it('should include detection source', async () => {
      const result = await scanner.scanTechStack();

      result.forEach((tech) => {
        expect(tech).toHaveProperty('source');
        expect(tech).toHaveProperty('name');
      });
    });
  });

  describe('getProjectStructure', () => {
    it('should detect src directory', async () => {
      const result = await scanner.getProjectStructure();

      expect(result.hasSource).toBe(true);
      expect(result.directories).toContain('src');
    });

    it('should detect tests directory', async () => {
      const result = await scanner.getProjectStructure();

      expect(result.hasTests).toBe(true);
    });
  });

  describe('getProjectMetadata', () => {
    it('should get project name', async () => {
      const result = await scanner.getProjectMetadata();

      expect(result.name).toBe('skill');
    });

    it('should get description if available', async () => {
      const result = await scanner.getProjectMetadata();

      expect(result.description).toBeDefined();
    });
  });
});

describe('Context Service', () => {
  describe('analyzeProject', () => {
    it('should return complete analysis', async () => {
      const result = await context.analyzeProject();

      expect(result).toHaveProperty('metadata');
      expect(result).toHaveProperty('techStack');
      expect(result).toHaveProperty('structure');
      expect(result).toHaveProperty('summary');
    });

    it('should generate summary string', async () => {
      const result = await context.analyzeProject();

      expect(typeof result.summary).toBe('string');
      expect(result.summary.length).toBeGreaterThan(0);
    });
  });

  describe('suggestSkillsForStack', () => {
    it('should suggest skills for Node.js', () => {
      const stack = [{ key: 'node', name: 'Node.js' }];
      const suggestions = context.suggestSkillsForStack(stack);

      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some((s) => s.template)).toBe(true);
    });

    it('should include general suggestions', () => {
      const suggestions = context.suggestSkillsForStack([]);

      expect(suggestions.some((s) => s.name === 'code-review')).toBe(true);
    });
  });
});
