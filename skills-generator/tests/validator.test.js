import { describe, it, expect } from 'vitest';
import validator from '../src/services/validator/index.js';
import quality from '../src/services/validator/quality.js';
import tokens from '../src/services/validator/tokens.js';

const VALID_SKILL = `---
name: test-skill
description: A test skill for validation
version: 1.0.0
triggers:
  - when testing validation
mcps:
  required:
    - filesystem
---

# test-skill

## Purpose

This is a test skill that validates the validation system.

## When to Use

Use this skill when you need to test the validation functionality.

## Instructions

1. First, do this
2. Then, do that
3. Finally, complete the task

## Examples

### Example 1
User: Test the skill
Expected: Validation passes

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| Test fails | Invalid input | Fix the input |

## References

- [Test docs](https://example.com)
`;

const MINIMAL_SKILL = `---
name: minimal
description: Minimal skill
---

# Minimal

Short content.
`;

describe('Validator Service', () => {
  describe('validateSkill', () => {
    it('should validate a complete skill', async () => {
      const result = await validator.validateSkill(VALID_SKILL);

      expect(result.valid).toBe(true);
      expect(result.schema.valid).toBe(true);
      expect(result.quality.score).toBeGreaterThan(70);
    });

    it('should identify issues in minimal skill', async () => {
      const result = await validator.validateSkill(MINIMAL_SKILL);

      expect(result.quality.score).toBeLessThan(50);
      expect(result.suggestions.length).toBeGreaterThan(0);
    });
  });

  describe('quickValidate', () => {
    it('should pass valid frontmatter', async () => {
      const result = await validator.quickValidate(VALID_SKILL);
      expect(result.valid).toBe(true);
    });

    it('should fail missing required fields', async () => {
      const result = await validator.quickValidate(`---
name: test
---
Content
`);
      expect(result.valid).toBe(false);
    });
  });
});

describe('Quality Scoring', () => {
  it('should give high score to complete skills', () => {
    const parsed = {
      frontmatter: {
        name: 'test',
        triggers: ['when testing'],
        mcps: { required: ['filesystem'] },
      },
      sections: {
        purpose: 'This is a detailed purpose section.',
        whenToUse: 'Use when you need to test things.',
        instructions: 'Step 1: Do this. Step 2: Do that.',
        examples: 'Example: User says X, expect Y.',
        errorHandling: 'Handle errors by doing Z.',
        references: 'See docs at example.com.',
      },
      body: 'A'.repeat(1000),
    };

    const result = quality.calculateQualityScore(parsed);
    expect(result.score).toBeGreaterThanOrEqual(80);
  });

  it('should give low score to incomplete skills', () => {
    const parsed = {
      frontmatter: { name: 'test' },
      sections: {},
      body: 'Short.',
    };

    const result = quality.calculateQualityScore(parsed);
    expect(result.score).toBeLessThan(30);
  });

  it('should return correct grade', () => {
    expect(quality.getQualityGrade(95).grade).toBe('A');
    expect(quality.getQualityGrade(85).grade).toBe('B');
    expect(quality.getQualityGrade(75).grade).toBe('C');
    expect(quality.getQualityGrade(65).grade).toBe('D');
    expect(quality.getQualityGrade(45).grade).toBe('F');
  });
});

describe('Token Analysis', () => {
  it('should estimate tokens correctly', () => {
    const text = 'Hello world this is a test.';
    const estimate = tokens.estimateTokens(text);
    expect(estimate).toBeGreaterThan(0);
    expect(estimate).toBeLessThan(20);
  });

  it('should check token limits', () => {
    const shortText = 'Short.';
    const result = tokens.checkTokenLimits(shortText);
    expect(result.withinRecommended).toBe(true);
    expect(result.withinAbsolute).toBe(true);
  });

  it('should detect progressive disclosure patterns', () => {
    const withReferences = '## References\n[Link](https://example.com)';
    const result = tokens.checkProgressiveDisclosure(withReferences);
    expect(result.usesProgressiveDisclosure).toBe(true);
    expect(result.patterns.hasReferences).toBe(true);
    expect(result.patterns.hasExternalLinks).toBe(true);
  });
});
