const DEFAULT_BATCH_SIZE = 4;

export async function batchProcessArray<T>(array: T[], processFn: (item: T) => Promise<void>, batchSize = DEFAULT_BATCH_SIZE): Promise<void> {
  for (let i = 0; i < array.length; i += batchSize) {
    const batch = array.slice(i, i + batchSize);
    await Promise.all(batch.map(item => processFn(item)));
  }
}
