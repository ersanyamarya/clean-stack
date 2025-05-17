import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { loadConfigFromEnv } from './index';

describe('loadConfigFromEnv', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  // Happy Path Tests
  describe('when loading simple environment variables', () => {
    it('loads values from environment variables with matching keys', () => {
      // Arrange
      // Arrange
      process.env['PORT'] = '3000';
      process.env['HOST'] = 'localhost';
      const schema = z.object({
        port: z.string().describe('PORT'),
        host: z.string().describe('HOST'),
      });

      // Act
      const config = loadConfigFromEnv(schema);

      // Assert
      expect(config).toEqual({
        port: '3000',
        host: 'localhost',
      });
    });

    it('uses default values when environment variables are not set', () => {
      // Arrange
      const schema = z.object({
        port: z.string().default('8080').describe('PORT'),
        host: z.string().default('127.0.0.1').describe('HOST'),
      });

      // Act
      const config = loadConfigFromEnv(schema);

      // Assert
      expect(config).toEqual({
        port: '8080',
        host: '127.0.0.1',
      });
    });
  });

  describe('when interpolating environment variables', () => {
    it('interpolates environment variables in values', () => {
      // Arrange
      process.env['BASE_URL'] = 'http://example.com';
      process.env['API_PATH'] = '/api';
      const schema = z.object({
        apiUrl: z.string().describe('$BASE_URL$API_PATH'),
      });

      // Act
      const config = loadConfigFromEnv(schema);

      // Assert
      expect(config).toEqual({
        apiUrl: 'http://example.com/api',
      });
    });

    it('leaves unmatched variables unchanged', () => {
      // Arrange
      process.env['BASE_URL'] = 'http://example.com';
      const schema = z.object({
        apiUrl: z.string().describe('$BASE_URL$UNDEFINED_VAR'),
      });

      // Act
      const config = loadConfigFromEnv(schema);

      // Assert
      expect(config).toEqual({
        apiUrl: 'http://example.com$UNDEFINED_VAR',
      });
    });
  });

  describe('when handling nested objects', () => {
    it('loads nested configuration objects', () => {
      // Arrange
      process.env['DB_HOST'] = 'localhost';
      process.env['DB_PORT'] = '27017';
      process.env['DB_NAME'] = 'testdb';
      const schema = z.object({
        database: z.object({
          host: z.string().describe('DB_HOST'),
          port: z.string().describe('DB_PORT'),
          name: z.string().describe('DB_NAME'),
        }),
      });

      // Act
      const config = loadConfigFromEnv(schema);

      // Assert
      expect(config).toEqual({
        database: {
          host: 'localhost',
          port: '27017',
          name: 'testdb',
        },
      });
    });
  });

  // Sad Path Tests
  describe('when validation fails', () => {
    it('throws error for missing required variables', () => {
      // Arrange
      const schema = z.object({
        requiredValue: z.string().describe('REQUIRED_VALUE'),
      });

      // Act & Assert
      expect(() => loadConfigFromEnv(schema)).toThrow('Environment variable validation failed');
      expect(console.error).toHaveBeenCalled();
    });

    it('throws error with formatted validation messages', () => {
      // Arrange
      const schema = z.object({
        port: z.number().describe('PORT'),
      });
      process.env['PORT'] = 'not-a-number';

      // Act & Assert
      expect(() => loadConfigFromEnv(schema)).toThrow('Environment variable validation failed');
      expect(console.error).toHaveBeenCalled();
    });
  });
});
