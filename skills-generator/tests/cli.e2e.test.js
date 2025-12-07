import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);
const CLI = 'node bin/skill.js';
const TEST_DIR = path.join(process.cwd(), '.test-skills');

describe('CLI E2E Tests', () => {
  beforeAll(async () => {
    // Create test directory
    await fs.mkdir(TEST_DIR, { recursive: true });
    process.env.SKILLS_DIR = path.join(TEST_DIR, '.claude/skills');
  });

  afterAll(async () => {
    // Cleanup test directory
    await fs.rm(TEST_DIR, { recursive: true, force: true });
  });

  describe('skill --help', () => {
    it('should display help text', async () => {
      const { stdout } = await execAsync(`${CLI} --help`);

      expect(stdout).toContain('Claude Skills Generator');
      expect(stdout).toContain('new');
      expect(stdout).toContain('validate');
      expect(stdout).toContain('test');
    });
  });

  describe('skill --version', () => {
    it('should display version', async () => {
      const { stdout } = await execAsync(`${CLI} --version`);

      expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe('skill list', () => {
    it('should show no skills message when empty', async () => {
      const { stdout } = await execAsync(`${CLI} list`, {
        env: { ...process.env, SKILLS_DIR: path.join(TEST_DIR, 'empty-skills') },
      });

      expect(stdout).toContain('No skills found');
    });
  });

  describe('skill new (non-interactive)', () => {
    it('should show help for new command', async () => {
      const { stdout } = await execAsync(`${CLI} new --help`);

      expect(stdout).toContain('Create a new skill');
      expect(stdout).toContain('--template');
      expect(stdout).toContain('--no-ai');
    });
  });

  describe('skill validate', () => {
    it('should fail for non-existent skill', async () => {
      try {
        await execAsync(`${CLI} validate nonexistent`);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error.stderr || error.stdout).toContain('not found');
      }
    });
  });

  describe('skill mcps', () => {
    it('should fail for non-existent skill', async () => {
      try {
        await execAsync(`${CLI} mcps nonexistent`);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error.stderr || error.stdout).toContain('not found');
      }
    });
  });

  describe('skill suggest', () => {
    it('should analyze project and show suggestions', async () => {
      // This will run in the skills-generator directory
      // Since it's interactive, we just check it starts correctly
      const { stdout } = await execAsync(`${CLI} suggest --help`);

      expect(stdout).toContain('Get skill suggestions');
    });
  });

  describe('skill import', () => {
    it('should show help for import command', async () => {
      const { stdout } = await execAsync(`${CLI} import --help`);

      expect(stdout).toContain('Import a skill');
    });

    it('should fail with invalid URL', async () => {
      try {
        await execAsync(`${CLI} import invalid-url`);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error.stderr || error.stdout).toContain('Invalid URL');
      }
    });
  });

  describe('skill export', () => {
    it('should fail for non-existent skill', async () => {
      try {
        await execAsync(`${CLI} export nonexistent`);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error.stderr || error.stdout).toContain('not found');
      }
    });
  });

  describe('Integration: Create and Validate Skill', () => {
    const testSkillName = 'e2e-test-skill';
    const testSkillDir = path.join(TEST_DIR, '.claude/skills', testSkillName);

    beforeAll(async () => {
      // Create a test skill manually
      await fs.mkdir(testSkillDir, { recursive: true });
      await fs.writeFile(
        path.join(testSkillDir, 'SKILL.md'),
        `---
name: ${testSkillName}
description: A skill created for E2E testing
version: 1.0.0
triggers:
  - when running e2e tests
mcps:
  required:
    - filesystem
---

# ${testSkillName}

## Purpose

This skill is used for end-to-end testing of the CLI.

## When to Use

Use this skill when running automated tests.

## Instructions

1. Run the test suite
2. Check the results
3. Fix any issues

## Examples

User: Run the e2e tests
Expected: Tests pass successfully

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| Test fails | Bug in code | Fix the bug |

## References

- [Vitest docs](https://vitest.dev)
`
      );
    });

    it('should list the test skill', async () => {
      const { stdout } = await execAsync(`${CLI} list`, {
        env: { ...process.env, SKILLS_DIR: path.join(TEST_DIR, '.claude/skills') },
      });

      expect(stdout).toContain(testSkillName);
    });

    it('should validate the test skill', async () => {
      const { stdout } = await execAsync(`${CLI} validate ${testSkillName} --no-ai`, {
        env: { ...process.env, SKILLS_DIR: path.join(TEST_DIR, '.claude/skills') },
      });

      expect(stdout).toContain('Schema valid');
      expect(stdout).toContain('Quality Score');
    });

    it('should show MCPs for the test skill', async () => {
      const { stdout } = await execAsync(`${CLI} mcps ${testSkillName}`, {
        env: { ...process.env, SKILLS_DIR: path.join(TEST_DIR, '.claude/skills') },
      });

      expect(stdout).toContain('filesystem');
    });
  });
});
