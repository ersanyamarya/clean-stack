/* eslint-disable security/detect-object-injection */
import { Logger } from '@clean-stack/global_types';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Socket as NetSocket } from 'net';

/* eslint-disable @typescript-eslint/ban-types */

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
  logger.warn('--------> Closing idle connections <--------');

  Object.values(sockets).forEach((socket: Socket) => {
    if (socket.isIdle) {
      socket.destroy();
    }
  });
};

/**
 * It closes all the sockets, then closes the server, and then exits the process
 * @param {Server} server - The HTTP server that we're shutting down.
 * @param {SocketsMap} sockets - A map of socket IDs to socket instances.
 * @param {Logger} logger - The logger instance.
 * @param {Function} [onShutdown] - A function that will be called when the server is shutting down.
 */
const shutdown = async (logger: Logger, onShutdown?: Function, server?: Server, sockets?: SocketsMap): Promise<void> => {
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
 * The `gracefulShutdown` function handles graceful shutdown of a server in response to SIGINT and
 * SIGTERM signals.
 * @param {Logger} logger - The `logger` parameter is an instance of a Logger class that is used for
 * logging messages and warnings in the application.
 * @param {Function} [onShutdown] - The `onShutdown` parameter is a function that can be passed to the
 * `gracefulShutdown` function. It represents a callback function that will be executed during the
 * shutdown process. This function can be used to perform any necessary cleanup or final actions before
 * the server shuts down completely.
 * @param {Server} [server] - The `server` parameter is a reference to the server instance that you
 * want to gracefully shut down. It is used to close the server and release any resources associated
 * with it during the shutdown process.
 */
export const gracefulShutdown = (logger: Logger, onShutdown?: Function, server?: Server): void => {
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
