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
  for (let i = 0; i <= retryCount; i++) {
    try {
      await func();
      return;
    } catch (err) {
      if (i == retryCount) throw err;
      await sleep(waitInMs * (i + 1));
    }
  }
}

export function decodeJson(binary: Uint8Array | string): any {
  const buffer =
    typeof binary == "string"
      ? Buffer.from(binary, "base64")
      : Buffer.from(binary);
  return JSON.parse(buffer.toString("utf8"));
}
