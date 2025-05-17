/* eslint-disable security/detect-object-injection */
import { z } from 'zod';

type EnvConfig = Record<string, unknown>;

function interpolateEnvVariables(envKey: string): string {
  const varRegex = /\$(\w+)/g;
  const matches = envKey.match(varRegex);
  if (!matches) return envKey;

  return matches.reduce((acc, match) => {
    const envVar = process.env[match.slice(1)];
    return envVar ? acc.replace(match, envVar) : acc;
  }, envKey);
}

function processEnvValue(key: string, value: z.ZodTypeAny): string | undefined {
  const envKey = value.description || key;

  if (envKey.includes('$')) {
    return interpolateEnvVariables(envKey);
  }

  const envValue = process.env[envKey];
  if (envValue) return envValue;
  if (value instanceof z.ZodDefault) return value._def.defaultValue();
  return undefined;
}

function formatValidationErrors(error: z.ZodError): string {
  const { fieldErrors } = error.flatten();
  return Object.entries(fieldErrors)
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : ''}`)
    .join('\n');
}

export function loadConfigFromEnv<T extends z.ZodRawShape>(schema: z.ZodObject<T>): z.infer<typeof schema> {
  const envs = Object.entries(schema.shape).reduce((acc, [key, value]) => {
    if (value instanceof z.ZodObject) {
      acc[key] = loadConfigFromEnv(value);
      return acc;
    }

    const envValue = processEnvValue(key, value);
    if (envValue !== undefined) {
      acc[key] = envValue;
    }

    return acc;
  }, {} as EnvConfig);

  const env = schema.safeParse(envs);

  if (!env.success) {
    const errorMessage = formatValidationErrors(env.error);
    console.error(errorMessage);
    throw new Error(`Environment variable validation failed:\n${errorMessage}`);
  }

  return env.data;
}
