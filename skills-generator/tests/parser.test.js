import { describe, it, expect } from 'vitest';
import parser from '../src/lib/parser.js';

const SAMPLE_SKILL = `---
name: sample-skill
description: A sample skill for testing
version: 1.0.0
author: tester
mcps:
  required:
    - filesystem
  optional:
    - browser-tools
triggers:
  - when testing parser
tags:
  - testing
  - sample
---

# sample-skill

## Purpose

This is the purpose section.

## When to Use

Use this when testing the parser.

## Instructions

Follow these instructions carefully.

## Examples

Example content here.
`;

describe('Parser', () => {
  describe('parseSkill', () => {
    it('should parse frontmatter correctly', () => {
      const result = parser.parseSkill(SAMPLE_SKILL);

      expect(result.frontmatter.name).toBe('sample-skill');
      expect(result.frontmatter.description).toBe('A sample skill for testing');
      expect(result.frontmatter.version).toBe('1.0.0');
      expect(result.frontmatter.mcps.required).toContain('filesystem');
      expect(result.frontmatter.triggers).toHaveLength(1);
    });

    it('should parse body correctly', () => {
      const result = parser.parseSkill(SAMPLE_SKILL);

      expect(result.body).toContain('# sample-skill');
      expect(result.body).toContain('## Purpose');
    });

    it('should extract sections', () => {
      const result = parser.parseSkill(SAMPLE_SKILL);

      expect(result.sections.purpose).toBe('This is the purpose section.');
      expect(result.sections.whenToUse).toBe('Use this when testing the parser.');
      expect(result.sections.instructions).toBe('Follow these instructions carefully.');
      expect(result.sections.examples).toBe('Example content here.');
    });
  });

  describe('validateFrontmatter', () => {
    it('should pass valid frontmatter', () => {
      const frontmatter = {
        name: 'test',
        description: 'A test skill',
      };
      const result = parser.validateFrontmatter(frontmatter);
      expect(result.valid).toBe(true);
    });

    it('should fail missing name', () => {
      const frontmatter = {
        description: 'A test skill',
      };
      const result = parser.validateFrontmatter(frontmatter);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: name');
    });

    it('should fail missing description', () => {
      const frontmatter = {
        name: 'test',
      };
      const result = parser.validateFrontmatter(frontmatter);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: description');
    });
  });

  describe('serializeSkill', () => {
    it('should serialize skill back to string', () => {
      const skill = {
        frontmatter: {
          name: 'test',
          description: 'Test skill',
        },
        body: '# Test\n\nContent here.',
      };

      const result = parser.serializeSkill(skill);

      expect(result).toContain('---');
      expect(result).toContain('name: test');
      expect(result).toContain('# Test');
    });
  });

  describe('createSkillContent', () => {
    it('should create skill content from data', () => {
      const data = {
        name: 'my-skill',
        description: 'My awesome skill',
        purpose: 'Do something awesome',
      };

      const result = parser.createSkillContent(data);

      expect(result).toContain('name: my-skill');
      expect(result).toContain('description: My awesome skill');
      expect(result).toContain('Do something awesome');
    });
  });
});
