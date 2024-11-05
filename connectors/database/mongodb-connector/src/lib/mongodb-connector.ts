import { ConnectorFactory, STATUSES } from '@clean-stack/framework/global-types';
import { connect, connection, ConnectOptions, Schema } from 'mongoose';
function isValidUTF8(str: string): boolean {
  try {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(str);
    const decoder = new TextDecoder('utf-8', { fatal: true });
    decoder.decode(encoded);
    return true;
  } catch (e) {
    return false;
  }
}

Schema.Types.String.set('validate', {
  validator: isValidUTF8,
  message: (props: { value: unknown }) => `${props.value} is not a valid UTF-8 encoded string!`,
});

export type MongoDBConfig = {
  uri: string;
  name?: string;
  options?: ConnectOptions;
};

export const createMongoDBConnector: ConnectorFactory<MongoDBConfig> = (logger, { uri, name, options }) => {
  return {
    async connect() {
      connect(uri, options);

      connection.once('connected', () => {
        logger.info('Connected to MongoDB');
      });

      connection.on('error', error => {
        logger.error(error.message);
      });

      return {
        name: name || 'mongodb',
        healthCheck: async () => {
          const connected = connection.readyState === 1;
          const statusIndex: number = connection.readyState <= 3 ? connection.readyState : 4;
          // eslint-disable-next-line security/detect-object-injection
          return { status: STATUSES[statusIndex], connected };
        },
      };
    },
    async disconnect() {
      await connection.close();
    },
  };
};

export function getMongoDBConnection() {
  if (!connection) {
    throw new Error('MongoDB connection not initialized');
  }
  return connection;
}
