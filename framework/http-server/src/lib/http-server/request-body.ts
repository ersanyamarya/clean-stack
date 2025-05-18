import { IncomingMessage } from 'http';

// Helper function to read the stream into a buffer
function streamToBuffer(stream: IncomingMessage): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });
    stream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    stream.on('error', (err: Error) => {
      reject(err);
    });
  });
}

export function getRequestBody(req: IncomingMessage) {
  const bodyPromise = streamToBuffer(req);

  return {
    buffer: () => bodyPromise,
    async json<T = unknown>() {
      const buf = await bodyPromise;
      try {
        return JSON.parse(buf.toString()) as T;
      } catch {
        throw new Error('Invalid JSON body');
      }
    },
    async text() {
      const buf = await bodyPromise;
      return buf.toString();
    },
  };
}
