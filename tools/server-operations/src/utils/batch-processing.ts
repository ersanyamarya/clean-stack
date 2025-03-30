/**
 * Default number of items to process in parallel
 */
const DEFAULT_BATCH_SIZE = 4;

/**
 * Process an array of items in batches asynchronously.
 * This function chunks the input array into smaller batches and processes them in parallel.
 * Each batch is processed before moving to the next one, preventing memory overload.
 *
 * @template T - The type of items in the array
 * @param {T[]} items - The array of items to process
 * @param {(item: T) => Promise<void>} processItem - Async function to process each item
 * @param {number} [batchSize=DEFAULT_BATCH_SIZE] - Number of items to process in parallel
 * @throws {Error} If processItem throws an error for any item
 * @returns {Promise<void>}
 *
 * @example
 * const items = [1, 2, 3, 4, 5];
 * await batchProcessArray(items, async (num) => {
 *   await someAsyncOperation(num);
 * });
 */
export const batchProcessArray = async <T>(
  items: readonly T[],
  processItem: (item: T) => Promise<void>,
  batchSize: number = DEFAULT_BATCH_SIZE
): Promise<void> => {
  const chunks = Array.from({ length: Math.ceil(items.length / batchSize) }).map((_, index) => items.slice(index * batchSize, (index + 1) * batchSize));

  for (const chunk of chunks) {
    try {
      await Promise.all(chunk.map(item => processItem(item)));
    } catch (error) {
      throw new Error(`Batch processing failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};
