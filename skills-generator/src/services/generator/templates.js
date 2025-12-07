import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, '../../templates');

// Available templates
export const TEMPLATE_TYPES = ['basic', 'debugging', 'document', 'api'];

// Get template file path
export function getTemplatePath(templateName) {
  return path.join(TEMPLATES_DIR, `${templateName}.md`);
}

// Load template content
export async function loadTemplate(templateName) {
  const templatePath = getTemplatePath(templateName);
  return fs.readFile(templatePath, 'utf-8');
}

// Check if template exists
export async function templateExists(templateName) {
  try {
    await fs.access(getTemplatePath(templateName));
    return true;
  } catch {
    return false;
  }
}

// List available templates
export async function listTemplates() {
  const files = await fs.readdir(TEMPLATES_DIR);
  return files
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((f) => f.replace('.md', ''));
}

// Fill template placeholders
export function fillTemplate(template, data) {
  let result = template;

  // Replace all {{key}} placeholders
  for (const [key, value] of Object.entries(data)) {
    const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(placeholder, value || '');
  }

  return result;
}

// Get default values for a template
export function getTemplateDefaults(templateName) {
  const defaults = {
    basic: {
      purpose: 'A general-purpose skill for common tasks.',
      trigger1: 'User explicitly requests this functionality',
      trigger2: 'Task matches the skill\'s domain',
      instructions: 'Follow the user\'s request carefully and provide helpful output.',
      examplePrompt1: 'Help me with [task]',
      exampleBehavior1: 'Analyze the request, execute the task, and confirm completion.',
      examplePrompt2: 'What if [edge case]?',
      exampleBehavior2: 'Handle the edge case gracefully with appropriate fallback.',
      error1: 'Invalid input',
      cause1: 'User provided malformed data',
      solution1: 'Validate input and request clarification',
      ref1: '#',
    },
    debugging: {
      topic: 'general',
      exampleError: 'TypeError: Cannot read property X of undefined',
      errorDocsUrl: '#',
      debuggingGuideUrl: '#',
    },
    document: {
      documentType: 'JSON',
      dataType: 'data fields',
      outputFormat: 'CSV',
      format1: 'JSON',
      notes1: 'Full support',
      format2: 'YAML',
      notes2: 'Full support',
      specUrl: '#',
      libraryUrl: '#',
    },
    api: {
      apiName: 'External API',
      apiBaseUrl: 'https://api.example.com',
      API_KEY_VAR: 'API_KEY',
      API_URL_VAR: 'API_URL',
      authMethod: 'Bearer token',
      authInstructions: 'Include the API key in the Authorization header.',
      operation1: 'List Resources',
      operation1Description: 'Get all resources',
      endpoint1: '/api/resources',
      method1: 'GET',
      requestBody1: '{}',
      operation2: 'Create Resource',
      operation2Description: 'Create a new resource',
      endpoint2: '/api/resources',
      method2: 'POST',
      rateLimit: '100 requests/minute',
      desc1: 'List all resources',
      desc2: 'Create new resource',
      apiDocsUrl: '#',
      authDocsUrl: '#',
      errorDocsUrl: '#',
    },
  };

  return defaults[templateName] || defaults.basic;
}

// Generate skill content from template
export async function generateFromTemplate(templateName, data) {
  const template = await loadTemplate(templateName);
  const defaults = getTemplateDefaults(templateName);
  const mergedData = { ...defaults, ...data };
  return fillTemplate(template, mergedData);
}

export default {
  TEMPLATE_TYPES,
  getTemplatePath,
  loadTemplate,
  templateExists,
  listTemplates,
  fillTemplate,
  getTemplateDefaults,
  generateFromTemplate,
};
