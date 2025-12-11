// Test script to validate the upgraded quality scoring against superpowers skills
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import quality from './src/services/validator/quality.js';
const { calculateQualityScore, validateSkillQuality, WEIGHTS } = quality;

// Parse a SKILL.md file
function parseSkill(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: body } = matter(content);

  // Extract sections (simplified)
  const sections = {};
  const sectionRegex = /##\s+([^\n]+)\n([\s\S]*?)(?=##\s+|$)/g;
  let match;
  while ((match = sectionRegex.exec(body)) !== null) {
    const sectionName = match[1].toLowerCase().replace(/\s+/g, '');
    sections[sectionName] = match[2].trim();
  }

  return { frontmatter, sections, body };
}

// Test skills directory
const SUPERPOWERS_DIR = path.join(process.env.USERPROFILE, '.claude/plugins/cache/superpowers/skills');

// Skills to test
const skillsToTest = [
  'test-driven-development',
  'systematic-debugging',
  'verification-before-completion',
  'brainstorming',
  'root-cause-tracing',
];

console.log('='.repeat(70));
console.log('WORLD-CLASS SKILL VALIDATOR CALIBRATION TEST');
console.log('='.repeat(70));
console.log('');
console.log('Testing against known world-class skills from superpowers...');
console.log('Expected: All skills should score 70+ (Production Ready)');
console.log('Target: Most should score 85+ (World-Class)');
console.log('');

const results = [];

for (const skillName of skillsToTest) {
  const skillPath = path.join(SUPERPOWERS_DIR, skillName, 'SKILL.md');

  if (!fs.existsSync(skillPath)) {
    console.log(`⚠️  ${skillName}: Not found at ${skillPath}`);
    continue;
  }

  try {
    const parsed = parseSkill(skillPath);
    const result = validateSkillQuality(parsed);

    results.push({ name: skillName, ...result });

    // Display result
    const icon = result.score >= 85 ? '✅' : result.score >= 70 ? '🟢' : '🟡';
    console.log(`${icon} ${skillName}: ${result.score}/100 (${result.tier.label})`);

    // Show breakdown
    console.log('   Breakdown:');
    for (const [key, value] of Object.entries(result.breakdown)) {
      const max = WEIGHTS[key] || 0;
      const status = value === max ? '✓' : value > 0 ? '~' : '✗';
      if (max > 0) {
        console.log(`   ${status} ${key}: ${value}/${max}`);
      }
    }

    if (result.criticalMissing.length > 0) {
      console.log('   Missing CRITICAL:');
      result.criticalMissing.forEach(s => console.log(`     - ${s.message.split(' - ')[0]}`));
    }

    console.log('');
  } catch (error) {
    console.log(`❌ ${skillName}: Error - ${error.message}`);
  }
}

// Summary
console.log('='.repeat(70));
console.log('SUMMARY');
console.log('='.repeat(70));

const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
const worldClass = results.filter(r => r.score >= 85).length;
const prodReady = results.filter(r => r.score >= 70).length;

console.log(`Average Score: ${avgScore.toFixed(1)}/100`);
console.log(`World-Class (85+): ${worldClass}/${results.length}`);
console.log(`Production Ready (70+): ${prodReady}/${results.length}`);
console.log('');

if (avgScore < 70) {
  console.log('⚠️  CALIBRATION NEEDED: Average below 70 for known good skills');
  console.log('   Consider adjusting weights or detection patterns');
} else if (avgScore >= 85) {
  console.log('✅ CALIBRATION GOOD: Validator correctly identifies world-class skills');
} else {
  console.log('🟡 CALIBRATION OK: Validator working but may need refinement');
}
