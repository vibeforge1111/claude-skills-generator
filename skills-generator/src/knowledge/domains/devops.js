/**
 * DevOps Domain Knowledge
 * CI/CD, deployment, infrastructure automation
 */

export default {
  key: 'devops',
  name: 'DevOps & CI/CD',
  description: 'CI/CD pipelines, deployment automation, infrastructure management',

  tools: ['docker', 'kubernetes', 'terraform', 'ansible', 'github-actions', 'jenkins', 'helm', 'argocd'],

  mcps: {
    required: ['filesystem', 'git'],
    recommended: ['github'],
    optional: ['browser-tools'],
  },

  patterns: [
    'deploy',
    'pipeline',
    'CI/CD',
    'container',
    'kubernetes',
    'docker',
    'terraform',
    'infrastructure',
    'automation',
    'release',
    'rollback',
    'staging',
    'production',
    'helm',
    'manifest',
    'workflow',
  ],

  trainingSources: {
    curated: [
      {
        type: 'doc',
        url: 'https://docs.docker.com/',
        topics: ['containers', 'dockerfile', 'compose'],
      },
      {
        type: 'doc',
        url: 'https://kubernetes.io/docs/',
        topics: ['pods', 'deployments', 'services'],
      },
      {
        type: 'doc',
        url: 'https://docs.github.com/en/actions',
        topics: ['workflows', 'actions', 'ci-cd'],
      },
    ],
    youtube: [
      { id: 'docker-basics', title: 'Docker in 100 Seconds', duration: '2m' },
      { id: 'k8s-intro', title: 'Kubernetes Crash Course', duration: '30m' },
      { id: 'ghactions-tutorial', title: 'GitHub Actions Full Tutorial', duration: '45m' },
    ],
  },

  archetypes: ['ci-pipeline', 'deployment-manager', 'infrastructure-provisioner'],

  defaultMascot: {
    name: 'DEPLOY-X',
    personality: 'efficient, precise, reliable',
  },

  capabilityLevels: {
    basic: {
      tools: ['docker'],
      mcps: ['filesystem'],
      training: [],
      description: 'Basic container operations',
    },
    standard: {
      tools: ['docker', 'github-actions'],
      mcps: ['filesystem', 'git', 'github'],
      training: ['docker-basics', 'ci-basics'],
      description: 'Container builds with CI/CD',
    },
    expert: {
      tools: ['docker', 'kubernetes', 'github-actions'],
      mcps: ['filesystem', 'git', 'github'],
      training: ['k8s-fundamentals', 'ci-advanced'],
      description: 'Full container orchestration',
    },
    stacked: {
      tools: ['docker', 'kubernetes', 'terraform', 'helm', 'argocd'],
      mcps: ['filesystem', 'git', 'github', 'browser-tools'],
      training: ['devops-full-course'],
      description: 'Enterprise DevOps pipeline',
    },
  },

  commonErrors: [
    {
      pattern: 'image not found',
      tool: 'docker',
      solution: 'Check image name/tag or run docker pull first',
    },
    {
      pattern: 'kubectl: command not found',
      tool: 'kubernetes',
      solution: 'Install kubectl and configure kubeconfig',
    },
    {
      pattern: 'workflow file is invalid',
      tool: 'github-actions',
      solution: 'Check YAML syntax and action references',
    },
  ],
};
