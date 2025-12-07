import Ajv from 'ajv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = path.join(__dirname, '../../schemas/skill.schema.json');

let ajv = null;
let validate = null;

// Initialize validator
async function initValidator() {
  if (validate) return validate;

  const schemaContent = await fs.readFile(SCHEMA_PATH, 'utf-8');
  const schema = JSON.parse(schemaContent);

  ajv = new Ajv({ allErrors: true, verbose: true });
  validate = ajv.compile(schema);

  return validate;
}

// Validate frontmatter against schema
export async function validateSchema(frontmatter) {
  const validator = await initValidator();
  const valid = validator(frontmatter);

  if (valid) {
    return {
      valid: true,
      errors: [],
    };
  }

  const errors = validator.errors.map((err) => {
    const field = err.instancePath.replace('/', '') || err.params.missingProperty || 'root';
    return `${field}: ${err.message}`;
  });

  return {
    valid: false,
    errors,
  };
}

// Get schema for reference
export async function getSchema() {
  const schemaContent = await fs.readFile(SCHEMA_PATH, 'utf-8');
  return JSON.parse(schemaContent);
}

export default {
  validateSchema,
  getSchema,
};
