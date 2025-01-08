import { Schema, SchemaType } from 'mongoose';

export function mongooseSchemaToText(schema: Schema, indent = ''): string {
  let output = '';
  const paths = schema.paths;

  for (const [key, schemaType] of Object.entries(paths)) {
    output += `${indent}${key}: {\n`;
    const config = getSchemaTypeConfig(schemaType);
    output += formatSchemaConfig(config, indent + '  ');
    output += `${indent}}\n`;
  }

  return output;
}

function getSchemaTypeConfig(schemaType: SchemaType): Record<string, any> {
  const config: Record<string, any> = {};
  const options = (schemaType as any).options || {};

  if (schemaType.instance === 'Array') {
    const itemType = (schemaType as any).$embeddedSchemaType || (schemaType as any).caster;
    if (itemType) {
      if (itemType instanceof Schema) {
        config['type'] = 'Array';
        config['items'] = parseSubSchema(itemType);
      } else {
        const { type, items } = getArrayTypeInfo(itemType);
        config['type'] = type;
        if (items) {
          config['items'] = items;
        }
      }
    }
  } else if ((schemaType as any).schema instanceof Schema) {
    config['type'] = 'Object';
    config['schema'] = parseSubSchema((schemaType as any).schema);
  } else {
    config['type'] = schemaType.instance;
  }

  if (schemaType.isRequired) config['isRequired'] = true;
  if (options.default !== undefined) config['default'] = options.default;
  if (options.enum?.length) config['enum'] = options.enum;
  if (options.ref) config['ref'] = options.ref;
  if (options.min !== undefined) config['min'] = options.min;
  if (options.max !== undefined) config['max'] = options.max;

  return config;
}

function getArrayTypeInfo(schemaType: SchemaType): { type: string; items?: any } {
  if (schemaType.instance === 'Array') {
    const itemType = (schemaType as any).$embeddedSchemaType || (schemaType as any).caster;
    if (itemType) {
      if (itemType.instance === 'Array') {
        // Handle nested arrays
        const nestedType = getArrayTypeInfo(itemType);
        return {
          type: `Array<${nestedType.type}>`,
          items: nestedType,
        };
      }
      return {
        type: `Array<${itemType.instance}>`,
        items: {
          type: itemType.instance,
        },
      };
    }
  }
  return { type: schemaType.instance };
}

function parseSubSchema(schema: Schema): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, schemaType] of Object.entries(schema.paths)) {
    result[key] = getSchemaTypeConfig(schemaType);
  }

  return result;
}

function formatSchemaConfig(config: Record<string, any>, indent: string): string {
  let output = '';

  for (const [key, value] of Object.entries(config)) {
    // Only recurse if it's one of our "container" keys ('schema' or 'items')
    // and 'value' is actually an object (not null, not a string, not an array).
    if ((key === 'schema' || key === 'items') && value && typeof value === 'object' && !Array.isArray(value)) {
      output += `${indent}${key}: {\n`;
      for (const [subKey, subValue] of Object.entries(value)) {
        output += `${indent}  ${subKey}: {\n`;
        // Here we recurse again if subValue is also an object
        // otherwise, just print the primitive value
        if (subValue && typeof subValue === 'object' && !Array.isArray(subValue)) {
          output += formatSchemaConfig(subValue as Record<string, any>, indent + '    ');
        } else {
          output += `${indent}    value: ${JSON.stringify(subValue)}\n`;
        }
        output += `${indent}  }\n`;
      }
      output += `${indent}}\n`;
    } else {
      // For all other keys or non-object values, just print directly
      output += `${indent}${key}: ${JSON.stringify(value)}\n`;
    }
  }

  return output;
}
