import { beforeEach, describe, expect, it } from 'vitest';
import { z } from 'zod';
import { loadConfigFromEnv } from '.';
import { booleanTransformSchema, numberTransformSchema, stringArrayTransformSchema } from '../custom-zod-types';
// Define a schema with Zod
const configSchema = z.object({
  service: z.object({
    name: z.string(),
    version: z.string(),
  }),
  server: z.object({
    port: numberTransformSchema,
    url: z.string(),
  }),
  nodeEnv: z.string().default('development'),
  features: stringArrayTransformSchema.optional(),
  isFeatureEnabled: booleanTransformSchema.optional(),
});

// Nested environment variable mapping
const environmentMapping = {
  service: {
    name: 'TEST_SERVICE_NAME',
    version: 'TEST_SERVICE_VERSION',
  },
  server: {
    port: 'TEST_SERVICE_PORT',
    url: 'TEST_SERVICE_URL',
  },
  nodeEnv: 'NODE_ENV',
  features: 'FEATURES',
  isFeatureEnabled: 'IS_FEATURE_ENABLED',
};

// Set up the test suite
describe('loadConfigFromEnv', () => {
  beforeEach(() => {
    process.env['TEST_SERVICE_NAME'] = 'MyService';
    process.env['TEST_SERVICE_VERSION'] = '1.0.0';
    process.env['TEST_SERVICE_PORT'] = '8080';
    process.env['TEST_SERVICE_URL'] = 'http://localhost';
    process.env['NODE_ENV'] = 'production';
    process.env['FEATURES'] = 'feature1,feature2';
    process.env['IS_FEATURE_ENABLED'] = 'true';
  });

  describe('with valid environment variables', () => {
    it('should load configuration correctly from env', () => {
      const config = loadConfigFromEnv(configSchema, environmentMapping);

      expect(config.service.name).toBe('MyService');
      expect(config.service.version).toBe('1.0.0');
      expect(config.server.port).toBe(8080);
      expect(config.server.url).toBe('http://localhost');
      expect(config.nodeEnv).toBe('production');
      expect(config.features).toEqual(['feature1', 'feature2']);
      expect(config.isFeatureEnabled).toBe(true);
    });
  });

  describe('with invalid environment variables', () => {
    it('should throw an error for invalid number', () => {
      process.env['TEST_SERVICE_PORT'] = 'not-a-number';
      expect(() => loadConfigFromEnv(configSchema, environmentMapping)).toThrow('Invalid env value for port');
    });

    it('should throw an error for invalid boolean', () => {
      process.env['IS_FEATURE_ENABLED'] = 'not-a-boolean';
      expect(() => loadConfigFromEnv(configSchema, environmentMapping)).toThrow('Invalid boolean');
    });
  });

  describe('with default values', () => {
    it('should use default values when environment variables are not set', () => {
      delete process.env['NODE_ENV'];
      const config = loadConfigFromEnv(configSchema, environmentMapping);

      expect(config.nodeEnv).toBe('development');
    });
  });

  describe('with missing environment variables', () => {
    it('should throw an error for missing required variables', () => {
      delete process.env['TEST_SERVICE_NAME'];
      expect(() => loadConfigFromEnv(configSchema, environmentMapping)).toThrow('Invalid env value for name');
    });

    it('should use the Key to uppercase if environmentMapping is missing a key', () => {
      const eventsMappingWithoutFeatures = {
        service: {
          name: 'TEST_SERVICE_NAME',
          version: 'TEST_SERVICE_VERSION',
        },
        server: {
          port: 'TEST_SERVICE_PORT',
          url: 'TEST_SERVICE_URL',
        },
        nodeEnv: 'NODE_ENV',
        isFeatureEnabled: 'IS_FEATURE_ENABLED',
      };

      const config = loadConfigFromEnv(configSchema, eventsMappingWithoutFeatures);

      expect(config.features).toEqual(['feature1', 'feature2']);
    });
  });
});
