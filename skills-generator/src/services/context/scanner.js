import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

// Tech stack detection patterns
const TECH_PATTERNS = {
  // JavaScript/TypeScript
  node: { files: ['package.json'], name: 'Node.js' },
  typescript: { files: ['tsconfig.json'], name: 'TypeScript' },
  react: { deps: ['react', 'react-dom'], name: 'React' },
  nextjs: { files: ['next.config.js', 'next.config.mjs'], deps: ['next'], name: 'Next.js' },
  vue: { deps: ['vue'], name: 'Vue.js' },
  angular: { deps: ['@angular/core'], name: 'Angular' },
  express: { deps: ['express'], name: 'Express' },
  vite: { files: ['vite.config.js', 'vite.config.ts'], deps: ['vite'], name: 'Vite' },

  // Python
  python: { files: ['pyproject.toml', 'requirements.txt', 'setup.py'], name: 'Python' },
  django: { deps: ['django'], files: ['manage.py'], name: 'Django' },
  fastapi: { deps: ['fastapi'], name: 'FastAPI' },
  flask: { deps: ['flask'], name: 'Flask' },

  // Other languages
  rust: { files: ['Cargo.toml'], name: 'Rust' },
  go: { files: ['go.mod'], name: 'Go' },
  java: { files: ['pom.xml', 'build.gradle'], name: 'Java' },

  // Tools
  docker: { files: ['Dockerfile', 'docker-compose.yml'], name: 'Docker' },
  kubernetes: { files: ['*.yaml', '*.yml'], patterns: ['kind: Deployment'], name: 'Kubernetes' },
  terraform: { files: ['*.tf'], name: 'Terraform' },

  // Testing
  jest: { deps: ['jest'], files: ['jest.config.js'], name: 'Jest' },
  vitest: { deps: ['vitest'], name: 'Vitest' },
  pytest: { deps: ['pytest'], name: 'Pytest' },

  // Databases
  mongodb: { deps: ['mongodb', 'mongoose'], name: 'MongoDB' },
  postgres: { deps: ['pg', 'postgres'], name: 'PostgreSQL' },
  prisma: { files: ['prisma/schema.prisma'], deps: ['prisma'], name: 'Prisma' },
};

// Scan project for tech stack
export async function scanTechStack(baseDir = process.cwd()) {
  const detected = [];

  // Check for config files
  for (const [key, pattern] of Object.entries(TECH_PATTERNS)) {
    if (pattern.files) {
      for (const file of pattern.files) {
        try {
          if (file.includes('*')) {
            const matches = await glob(path.join(baseDir, file));
            if (matches.length > 0) {
              detected.push({ key, name: pattern.name, source: 'file', file });
              break;
            }
          } else {
            await fs.access(path.join(baseDir, file));
            detected.push({ key, name: pattern.name, source: 'file', file });
            break;
          }
        } catch {
          // File doesn't exist
        }
      }
    }
  }

  // Check package.json dependencies
  try {
    const pkgPath = path.join(baseDir, 'package.json');
    const pkgContent = await fs.readFile(pkgPath, 'utf-8');
    const pkg = JSON.parse(pkgContent);
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };

    for (const [key, pattern] of Object.entries(TECH_PATTERNS)) {
      if (pattern.deps) {
        for (const dep of pattern.deps) {
          if (allDeps[dep]) {
            if (!detected.find((d) => d.key === key)) {
              detected.push({ key, name: pattern.name, source: 'dependency', dep });
            }
            break;
          }
        }
      }
    }
  } catch {
    // No package.json
  }

  // Check Python requirements
  try {
    const reqPath = path.join(baseDir, 'requirements.txt');
    const reqContent = await fs.readFile(reqPath, 'utf-8');
    const deps = reqContent.split('\n').map((l) => l.split('==')[0].split('>=')[0].trim().toLowerCase());

    for (const [key, pattern] of Object.entries(TECH_PATTERNS)) {
      if (pattern.deps) {
        for (const dep of pattern.deps) {
          if (deps.includes(dep.toLowerCase())) {
            if (!detected.find((d) => d.key === key)) {
              detected.push({ key, name: pattern.name, source: 'python-dep', dep });
            }
            break;
          }
        }
      }
    }
  } catch {
    // No requirements.txt
  }

  return detected;
}

// Get project structure summary
export async function getProjectStructure(baseDir = process.cwd()) {
  const structure = {
    hasSource: false,
    hasTests: false,
    hasDocs: false,
    hasConfig: false,
    directories: [],
  };

  const commonDirs = ['src', 'lib', 'app', 'tests', 'test', '__tests__', 'docs', 'config', 'scripts'];

  for (const dir of commonDirs) {
    try {
      const stat = await fs.stat(path.join(baseDir, dir));
      if (stat.isDirectory()) {
        structure.directories.push(dir);
        if (['src', 'lib', 'app'].includes(dir)) structure.hasSource = true;
        if (['tests', 'test', '__tests__'].includes(dir)) structure.hasTests = true;
        if (dir === 'docs') structure.hasDocs = true;
        if (dir === 'config') structure.hasConfig = true;
      }
    } catch {
      // Directory doesn't exist
    }
  }

  return structure;
}

// Get project metadata
export async function getProjectMetadata(baseDir = process.cwd()) {
  const metadata = {
    name: path.basename(baseDir),
    description: null,
    version: null,
    author: null,
  };

  // Try package.json
  try {
    const pkgPath = path.join(baseDir, 'package.json');
    const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));
    metadata.name = pkg.name || metadata.name;
    metadata.description = pkg.description;
    metadata.version = pkg.version;
    metadata.author = pkg.author;
  } catch {
    // No package.json
  }

  return metadata;
}

export default {
  scanTechStack,
  getProjectStructure,
  getProjectMetadata,
  TECH_PATTERNS,
};
