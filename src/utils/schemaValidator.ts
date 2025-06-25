import Ajv from 'ajv';
const ajv = new Ajv();

const schemas: Record<string, any> = {};
export function registerSchema(topic: string, schema: any) {
  schemas[topic] = ajv.compile(schema);
}

export function validateMessage(topic: string, message: any): boolean {
  const validate = schemas[topic];
  if (!validate) return true; // no schema means valid
  const valid = validate(message);
  if (!valid) console.warn(`Schema validation failed for topic ${topic}:`, validate.errors);
  return valid;
}