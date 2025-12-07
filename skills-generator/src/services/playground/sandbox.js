import claude from '../../lib/claude.js';

// Run a skill test in sandbox
export async function runTest(skillContent, testPrompt) {
  if (!claude.isConfigured()) {
    return {
      success: false,
      error: 'Claude API not configured',
      response: null,
      analysis: null,
    };
  }

  try {
    // Run the prompt with skill as system message
    const response = await claude.chat({
      system: `You are Claude with the following skill loaded. Follow the skill instructions when responding.

${skillContent}`,
      messages: [{ role: 'user', content: testPrompt.prompt }],
      maxTokens: 2048,
      temperature: 0.7,
    });

    // Analyze the response
    const analysis = await analyzeResponse(response.content, skillContent, testPrompt);

    return {
      success: true,
      response: response.content,
      analysis,
      usage: response.usage,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      response: null,
      analysis: null,
    };
  }
}

// Analyze if response follows skill instructions
async function analyzeResponse(response, skillContent, testPrompt) {
  // Basic heuristic analysis
  const analysis = {
    activated: false,
    followedInstructions: false,
    quality: 'unknown',
    notes: [],
  };

  // Check if response seems to follow skill structure
  const responseLength = response.length;

  if (responseLength < 50) {
    analysis.notes.push('Response is very short');
    analysis.quality = 'poor';
  } else if (responseLength > 100) {
    analysis.activated = true;
    analysis.notes.push('Response has substantive content');
  }

  // Check for common skill patterns in response
  if (response.includes('Step') || response.includes('1.') || response.includes('First')) {
    analysis.followedInstructions = true;
    analysis.notes.push('Response follows structured format');
  }

  // Check for error handling awareness
  if (response.toLowerCase().includes('error') || response.toLowerCase().includes('issue')) {
    analysis.notes.push('Response addresses potential issues');
  }

  // Try AI analysis if available
  if (claude.isConfigured()) {
    try {
      const aiAnalysis = await claude.prompt(
        `Analyze if this response correctly follows the skill instructions.

SKILL:
${skillContent.substring(0, 1000)}...

TEST PROMPT: ${testPrompt.prompt}
EXPECTED: ${testPrompt.expectedBehavior}

RESPONSE:
${response.substring(0, 1000)}...

Rate as JSON: {"activated": bool, "followedInstructions": bool, "quality": "good|fair|poor", "notes": ["..."]}`,
        'You are analyzing skill test results. Be brief and accurate.',
        { maxTokens: 256, temperature: 0.1 }
      );

      const jsonMatch = aiAnalysis.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return { ...analysis, ...parsed };
      }
    } catch {
      // AI analysis failed, use heuristic
    }
  }

  // Determine overall quality
  if (analysis.activated && analysis.followedInstructions) {
    analysis.quality = 'good';
  } else if (analysis.activated) {
    analysis.quality = 'fair';
  } else {
    analysis.quality = 'poor';
  }

  return analysis;
}

// Run multiple tests
export async function runTestSuite(skillContent, testPrompts, options = {}) {
  const { maxTests = 5, stopOnFail = false } = options;

  const results = [];
  const promptsToRun = testPrompts.slice(0, maxTests);

  for (const prompt of promptsToRun) {
    const result = await runTest(skillContent, prompt);
    results.push({
      prompt,
      ...result,
    });

    if (stopOnFail && !result.success) {
      break;
    }
  }

  // Calculate summary
  const passed = results.filter((r) => r.success && r.analysis?.quality !== 'poor').length;
  const failed = results.length - passed;

  return {
    results,
    summary: {
      total: results.length,
      passed,
      failed,
      passRate: Math.round((passed / results.length) * 100),
    },
  };
}

export default {
  runTest,
  runTestSuite,
};
