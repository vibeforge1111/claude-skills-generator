import scanner from './scanner.js';

// Get full project context
export async function analyzeProject(baseDir = process.cwd()) {
  const [techStack, structure, metadata] = await Promise.all([
    scanner.scanTechStack(baseDir),
    scanner.getProjectStructure(baseDir),
    scanner.getProjectMetadata(baseDir),
  ]);

  return {
    metadata,
    techStack,
    structure,
    summary: generateSummary(metadata, techStack, structure),
  };
}

// Generate human-readable summary
function generateSummary(metadata, techStack, structure) {
  const parts = [];

  if (metadata.name) {
    parts.push(`Project: ${metadata.name}`);
  }

  if (metadata.description) {
    parts.push(`Description: ${metadata.description}`);
  }

  if (techStack.length > 0) {
    const techNames = techStack.map((t) => t.name);
    parts.push(`Tech stack: ${techNames.join(', ')}`);
  }

  if (structure.directories.length > 0) {
    parts.push(`Structure: ${structure.directories.join(', ')}`);
  }

  const features = [];
  if (structure.hasTests) features.push('has tests');
  if (structure.hasDocs) features.push('has docs');
  if (features.length > 0) {
    parts.push(`Features: ${features.join(', ')}`);
  }

  return parts.join('\n');
}

// Get context for AI prompts
export async function getContextForAI(baseDir = process.cwd()) {
  const analysis = await analyzeProject(baseDir);
  return analysis.summary;
}

// Suggest skills based on project
export function suggestSkillsForStack(techStack) {
  const suggestions = [];

  const skillMap = {
    react: [
      { name: 'react-component', description: 'Create React components', template: 'basic' },
      { name: 'react-hooks', description: 'React hooks patterns', template: 'basic' },
    ],
    nextjs: [
      { name: 'nextjs-routing', description: 'Next.js routing patterns', template: 'basic' },
      { name: 'nextjs-api', description: 'Next.js API routes', template: 'api' },
    ],
    typescript: [
      { name: 'typescript-types', description: 'TypeScript type definitions', template: 'basic' },
    ],
    node: [
      { name: 'node-debugging', description: 'Node.js debugging', template: 'debugging' },
    ],
    python: [
      { name: 'python-debugging', description: 'Python debugging', template: 'debugging' },
    ],
    django: [
      { name: 'django-views', description: 'Django views patterns', template: 'basic' },
      { name: 'django-models', description: 'Django model design', template: 'basic' },
    ],
    docker: [
      { name: 'docker-debugging', description: 'Docker troubleshooting', template: 'debugging' },
    ],
    prisma: [
      { name: 'prisma-queries', description: 'Prisma database queries', template: 'basic' },
    ],
    jest: [
      { name: 'jest-testing', description: 'Jest test patterns', template: 'basic' },
    ],
    vitest: [
      { name: 'vitest-testing', description: 'Vitest test patterns', template: 'basic' },
    ],
  };

  for (const tech of techStack) {
    const techSuggestions = skillMap[tech.key];
    if (techSuggestions) {
      suggestions.push(...techSuggestions.map((s) => ({ ...s, reason: `Based on ${tech.name}` })));
    }
  }

  // Add general suggestions
  suggestions.push({
    name: 'code-review',
    description: 'Code review best practices',
    template: 'basic',
    reason: 'Useful for any project',
  });

  return suggestions;
}

export default {
  analyzeProject,
  getContextForAI,
  suggestSkillsForStack,
};
