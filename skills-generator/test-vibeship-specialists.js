// Test script to validate vibeship-spawner specialists
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import quality from './src/services/validator/quality.js';
const { validateSkillQuality, WEIGHTS } = quality;

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

// Specialists directory
const SPECIALISTS_DIR = 'C:\\Users\\USER\\Desktop\\vibeship orchestrator\\vibeship-orchestrator\\skills\\specialists';

// Get all specialist files
const specialistFiles = fs.readdirSync(SPECIALISTS_DIR)
  .filter(f => f.endsWith('.md'))
  .map(f => ({ name: f.replace('.md', ''), path: path.join(SPECIALISTS_DIR, f) }));

console.log('='.repeat(70));
console.log('VIBESHIP-SPAWNER SPECIALISTS QUALITY ASSESSMENT');
console.log('='.repeat(70));
console.log('');
console.log(`Testing ${specialistFiles.length} specialists against world-class criteria...`);
console.log('');

const results = [];

for (const { name, path: filePath } of specialistFiles) {
  try {
    const parsed = parseSkill(filePath);
    const result = validateSkillQuality(parsed);
    results.push({ name, ...result });
  } catch (error) {
    console.log(`❌ ${name}: Error - ${error.message}`);
  }
}

// Sort by score descending
results.sort((a, b) => b.score - a.score);

// Display results
console.log('RESULTS (sorted by score):\n');

for (const result of results) {
  const icon = result.score >= 85 ? '✅' : result.score >= 70 ? '🟢' : result.score >= 55 ? '🟡' : '🟠';
  console.log(`${icon} ${result.name}: ${result.score}/100 (${result.tier.label})`);
}

// Summary
console.log('');
console.log('='.repeat(70));
console.log('SUMMARY');
console.log('='.repeat(70));

const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
const worldClass = results.filter(r => r.score >= 85).length;
const prodReady = results.filter(r => r.score >= 70).length;
const needsWork = results.filter(r => r.score >= 55 && r.score < 70).length;
const incomplete = results.filter(r => r.score < 55).length;

console.log(`Total Specialists: ${results.length}`);
console.log(`Average Score: ${avgScore.toFixed(1)}/100`);
console.log('');
console.log('Distribution:');
console.log(`  ✅ World-Class (85+): ${worldClass}`);
console.log(`  🟢 Production Ready (70-84): ${prodReady - worldClass}`);
console.log(`  🟡 Needs Enhancement (55-69): ${needsWork}`);
console.log(`  🟠 Draft/Incomplete (<55): ${incomplete}`);

// Most common missing patterns
console.log('');
console.log('MOST COMMON MISSING PATTERNS:');
const missingCounts = {};
for (const result of results) {
  for (const [key, value] of Object.entries(result.breakdown)) {
    if (value === 0 && WEIGHTS[key]) {
      missingCounts[key] = (missingCounts[key] || 0) + 1;
    }
  }
}

const sortedMissing = Object.entries(missingCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);

for (const [pattern, count] of sortedMissing) {
  const weight = WEIGHTS[pattern];
  console.log(`  - ${pattern} (${weight} pts): missing in ${count}/${results.length} specialists`);
}

// Detailed breakdown for worst performers
console.log('');
console.log('='.repeat(70));
console.log('DETAILED VIEW - LOWEST SCORING SPECIALISTS');
console.log('='.repeat(70));

const worstPerformers = results.slice(-3);
for (const result of worstPerformers) {
  console.log(`\n${result.name}: ${result.score}/100`);
  console.log('Missing CRITICAL:');
  result.criticalMissing.forEach(s => console.log(`  - ${s.message.split(' - ')[0].substring(0, 60)}...`));
}
