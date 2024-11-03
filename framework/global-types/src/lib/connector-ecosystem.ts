import { Logger } from './logger';

export const STATUSES = ['connected', 'disconnected', 'error', 'connecting', 'disconnecting', 'reconnecting', 'unknown'] as const;

type Status = (typeof STATUSES)[number];

/**
 * Represents the health check status of a connector.
 *
 * @typedef {Object} HealthCheck
 * @property {boolean} [connected] - Indicates if the connector is connected.
 * @property {Status} [status] - The current status of the connector.
 */
export type HealthCheck = {
  connected?: boolean;
  status?: Status;
  [key: string]: unknown;
};

/**
 * Represents a connector with a specific configuration type.
 *
 * @template ConnectorConfig - The type of the configuration object for the connector.
 */
export interface Connector<ConnectorConfig extends Record<string, unknown>> {
  /**
   * Connects the connector using the provided configuration.
   *
   * @param config - The configuration object for the connector.
   * @returns A promise that resolves to an object containing the connector's name and a health check function.
   */
  connect(): Promise<{
    name: string;
    healthCheck: () => Promise<HealthCheck>;
  }>;

  /**
   * Disconnects the connector.
   *
   * @returns A promise that resolves when the connector is disconnected.
   */
  disconnect(): Promise<void>;
}

/**
 * A factory function type for creating connectors.
 *
 * @template ConnectorConfig - A type parameter extending a record with string keys and unknown values.
 * @param logger - An instance of the Logger to be used by the connector.
 * @returns A Connector instance configured with the specified ConnectorConfig.
 */
export type ConnectorFactory<ConnectorConfig extends Record<string, unknown>> = (logger: Logger, config: ConnectorConfig) => Connector<ConnectorConfig>;
