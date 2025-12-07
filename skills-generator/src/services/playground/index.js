import parser from '../../lib/parser.js';
import prompts from './prompts.js';
import sandbox from './sandbox.js';

// Run playground tests for a skill
export async function testSkill(content, options = {}) {
  const { customPromptsFile, maxTests = 5 } = options;

  // Parse skill
  const parsed = parser.parseSkill(content);

  // Generate test prompts
  let testPrompts = await prompts.generateTestPrompts(content, parsed);

  // Add custom prompts if provided
  if (customPromptsFile) {
    const customPrompts = await prompts.loadCustomPrompts(customPromptsFile);
    testPrompts = [...customPrompts, ...testPrompts];
  }

  // Run tests
  const results = await sandbox.runTestSuite(content, testPrompts, { maxTests });

  // Generate suggestions based on results
  const suggestions = generateSuggestions(results);

  return {
    skillName: parsed.frontmatter.name,
    ...results,
    suggestions,
  };
}

// Generate improvement suggestions from test results
function generateSuggestions(results) {
  const suggestions = [];

  // Check pass rate
  if (results.summary.passRate < 50) {
    suggestions.push('Skill has low activation rate - review trigger conditions and instructions');
  }

  // Check for patterns in failures
  const poorResults = results.results.filter((r) => r.analysis?.quality === 'poor');
  if (poorResults.length > 0) {
    const types = poorResults.map((r) => r.prompt.type);
    if (types.includes('trigger')) {
      suggestions.push('Trigger-based prompts are failing - make triggers more specific');
    }
    if (types.includes('edge')) {
      suggestions.push('Edge case handling needs improvement');
    }
  }

  // Check for instruction following
  const notFollowing = results.results.filter((r) => r.analysis && !r.analysis.followedInstructions);
  if (notFollowing.length > results.results.length / 2) {
    suggestions.push('Instructions may not be clear enough - add more specific steps');
  }

  // Add notes from analysis
  results.results.forEach((r) => {
    if (r.analysis?.notes) {
      r.analysis.notes.forEach((note) => {
        if (note.includes('short') && !suggestions.includes('Consider adding more detail to responses')) {
          suggestions.push('Consider adding more detail to skill instructions');
        }
      });
    }
  });

  return suggestions;
}

export default {
  testSkill,
};
