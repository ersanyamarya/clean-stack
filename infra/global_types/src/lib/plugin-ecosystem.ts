import { Logger } from './logger';

/**
 * An array of possible statuses for the plugin ecosystem.
 *
 * The statuses include:
 * - 'connected': The plugin is successfully connected.
 * - 'disconnected': The plugin is not connected.
 * - 'error': There was an error with the plugin.
 * - 'connecting': The plugin is in the process of connecting.
 * - 'disconnecting': The plugin is in the process of disconnecting.
 * - 'reconnecting': The plugin is attempting to reconnect.
 * - 'unknown': The status of the plugin is unknown.
 *
 * @constant
 * @type {readonly string[]}
 */
export const STATUSES = ['connected', 'disconnected', 'error', 'connecting', 'disconnecting', 'reconnecting', 'unknown'] as const;

type Status = (typeof STATUSES)[number];

/**
 * Represents the health check status of a plugin.
 *
 * @typedef {Object} HealthCheck
 * @property {boolean} [connected] - Indicates if the plugin is connected.
 * @property {Status} [status] - The current status of the plugin.
 */
export type HealthCheck = {
  connected?: boolean;
  status?: Status;
};

/**
 * Represents a plugin with a specific configuration type.
 *
 * @template PluginConfig - The type of the configuration object for the plugin.
 */
export interface Plugin<PluginConfig extends Record<string, unknown>> {
  /**
   * Connects the plugin using the provided configuration.
   *
   * @param config - The configuration object for the plugin.
   * @returns A promise that resolves to an object containing the plugin's name and a health check function.
   */
  connect(config: PluginConfig): Promise<{
    name: string;
    healthCheck: () => Promise<HealthCheck>;
  }>;

  /**
   * Disconnects the plugin.
   *
   * @returns A promise that resolves when the plugin is disconnected.
   */
  disconnect(): Promise<void>;
}

/**
 * A factory function type for creating plugins.
 *
 * @template PluginConfig - A type parameter extending a record with string keys and unknown values.
 * @param logger - An instance of the Logger to be used by the plugin.
 * @returns A Plugin instance configured with the specified PluginConfig.
 */
export type PluginFactory<PluginConfig extends Record<string, unknown>> = (logger: Logger) => Plugin<PluginConfig>;
