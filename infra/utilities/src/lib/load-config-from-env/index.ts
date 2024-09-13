/* eslint-disable security/detect-object-injection */
import { z, ZodObject, ZodRawShape } from 'zod';

/**
 * Loads configuration from environment variables based on a Zod schema and an optional environment variable mapping.
 *
 * @template ConfigShape - The shape of the configuration schema.
 * @template EnvMapping - The mapping of environment variable names to configuration keys.
 *
 * @param {ZodObject<ConfigShape>} schema - The Zod schema object that defines the configuration shape.
 * @param {EnvMapping} envMapping - An optional mapping of environment variable names to configuration keys.
 *
 * @returns {z.infer<typeodf schema>} - The configuration object populated with values from environment variables.
 *
 * @throws {Error} - Throws an error if an environment variable does not match the schema.
 */

export function loadConfigFromEnv<ConfigShape extends ZodRawShape, EnvMapping extends Record<string, unknown>>(
  schema: ZodObject<ConfigShape>,
  envMapping: EnvMapping
): z.infer<typeof schema> {
  const config: Record<string, unknown> = {};

  for (const key in schema.shape) {
    const envKey = envMapping[key] || key.toUpperCase(); // Use the mapping or default to uppercase key

    const schemaType = schema.shape[key];

    if (isZodObject(schemaType)) {
      // Recursively handle nested configurations
      config[key] = loadConfigFromEnv(schemaType, envMapping[key] as Record<string, unknown>);
    } else {
      const envValue = process.env[envKey as string];
      // Parse the environment variable or use the default
      const data = schemaType.safeParse(envValue);
      if (data.success) config[key] = data.data;
      else throw new Error(`Invalid env value for ${key}/${envKey}: ${data.error.errors[0].message}`);
    }
  }

  return config as z.infer<typeof schema>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isZodObject(schemaType: any): schemaType is ZodObject<any> {
  return !!schemaType._def.shape;
}
