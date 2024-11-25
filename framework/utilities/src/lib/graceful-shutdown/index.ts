/* eslint-disable security/detect-object-injection */
import { Logger } from '@clean-stack/framework/global-types';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Socket as NetSocket } from 'net';

interface Socket extends NetSocket {
  isIdle: boolean;
}

interface SocketsMap {
  [key: number]: Socket;
}

/**
 * When a request is received, the socket is marked as not idle. When the response is finished, the
 * socket is marked as idle
 * @param {IncomingMessage} request - The incoming HTTP request.
 * @param {ServerResponse} response - The response object.
 * @param {Logger} logger - The logger instance.
 */
const onRequest = (request: IncomingMessage, response: ServerResponse): void => {
  const socket = request.socket as Socket;
  socket.isIdle = false;

  response.on('finish', () => {
    socket.isIdle = true;
  });
};

/**
 * It creates a map of socket IDs to sockets, and adds a listener to the server that listens for new
 * connections. When a new connection is made, it creates a new socket ID and adds the socket to the
 * map. It also adds a listener to the socket that listens for the socket to close, and removes the
 * socket from the map when it does
 * @param {Server} server - The server that the socket is connected to.
 * @returns A map of socket IDs to sockets.
 */
const getSockets = (server: Server): SocketsMap => {
  const sockets: SocketsMap = {};
  let nextSocketId = 0;

  server.on('request', onRequest);
  server.on('connection', (socket: Socket): void => {
    socket.isIdle = true;

    const socketId = nextSocketId++;
    sockets[socketId] = socket;

    socket.once('close', (): void => {
      delete sockets[socketId];
    });
  });

  return sockets;
};

/**
 * Close all idle sockets
 * @param {SocketsMap} sockets - A map of socket IDs to sockets.
 * @param {Logger} logger - The logger instance.
 */
const closeSockets = (sockets: SocketsMap, logger: Logger): void => {
  logger.warn('Closing idle connections');

  Object.values(sockets).forEach((socket: Socket) => {
    if (socket.isIdle) {
      socket.destroy();
    }
  });
};

/**
 * Gracefully shuts down the server and performs any necessary cleanup.
 *
 * @param logger - The logger instance to log messages.
 * @param onShutdown - An optional callback function to execute additional shutdown logic.
 * @param server - An optional server instance to close.
 * @param sockets - An optional map of sockets to close.
 * @returns A promise that resolves when the shutdown process is complete.
 */
const shutdown = async (logger: Logger, onShutdown?: () => Promise<void> | void, server?: Server, sockets?: SocketsMap): Promise<void> => {
  if (sockets) {
    closeSockets(sockets, logger);
  }

  if (onShutdown) {
    await onShutdown();
  }

  if (server) {
    server.close(err => {
      if (err) {
        logger.error('Error while shutting down', { err });

        return process.exit(1);
      }

      process.exit(0);
    });
  }
};

/**
 * Sets up graceful shutdown handlers for SIGINT and SIGTERM signals.
 *
 * @param logger - The logger instance to use for logging shutdown messages.
 * @param onShutdown - An optional callback function to execute during shutdown.
 *                      This function can return a Promise or void.
 * @param server - An optional server instance to handle active connections during shutdown.
 */
export const gracefulShutdown = (logger: Logger, onShutdown?: () => Promise<void> | void, server?: Server): void => {
  let sockets: SocketsMap = {};

  if (server) {
    sockets = getSockets(server);
  }

  process.on('SIGINT', async (): Promise<void> => {
    logger.warn('Got SIGINT. Graceful shutdown');
    await shutdown(logger, onShutdown, server, sockets);
  });

  process.on('SIGTERM', async (): Promise<void> => {
    logger.warn('Got SIGTERM. Graceful shutdown');
    await shutdown(logger, onShutdown, server, sockets);
  });
};
