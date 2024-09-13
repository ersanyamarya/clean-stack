/* eslint-disable security/detect-object-injection */
import { z, ZodObject, ZodRawShape } from 'zod';

/**
 * The function `loadConfigFromEnv` loads configuration values from environment variables based on a
 * specified schema and mapping.
 * @param schema - The `schema` parameter in the `loadConfigFromEnv` function is a Zod schema that
 * defines the shape of the configuration object you want to load from environment variables. It
 * specifies the structure of the configuration object and the types of its properties.
 * @param {EnvMapping} envMapping - The `envMapping` parameter is a mapping object that associates
 * configuration keys with their corresponding environment variable names. It allows you to specify
 * custom environment variable names for each configuration key. If a key is not found in the
 * `envMapping`, the function will default to using the uppercase version of the key as
 * @returns The `loadConfigFromEnv` function returns a configuration object inferred from the provided
 * Zod schema. The shape of the returned object matches the shape defined in the Zod schema passed to
 * the function.
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
