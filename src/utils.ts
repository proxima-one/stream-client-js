export async function runWorkers(
  worker: () => Promise<void>,
  count: number
): Promise<void> {
  const tasks: Promise<void>[] = [];
  for (let i = 0; i < count; i++) {
    tasks.push(worker());
  }

  await Promise.all(tasks);
}

export async function execAndReturnWithRetry<T>(
  func: () => Promise<T>,
  retryCount: number,
  waitInMs: number
): Promise<T> {
  let result: T;
  await execWithRetry(
    async () => {
      result = await func();
    },
    retryCount,
    waitInMs
  );

  return result!;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function execWithRetry(
  func: () => Promise<void>,
  retryCount: number,
  waitInMs: number
): Promise<void> {
  for (let i = 0; i < retryCount + 1; i++) {
    try {
      await func();
      return;
    } catch (err) {
      if (i == retryCount - 1) throw err;
      await sleep(waitInMs * (i + 1));
    }
  }
}
