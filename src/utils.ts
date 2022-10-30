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

export class SimpleCache<T> {
  private _objects: Record<string, T>;
  private _durations: Record<string, number>;

  constructor(public readonly ttl = 300000) {
    this._objects = {};
    this._durations = {};
  }

  public set(key: string, value: T) {
    this._objects[key] = value;
    this._durations[key] = Date.now() + this.ttl;
  }

  public contains(key: string): boolean {
    this._removeIfOverdue(key);
    return key in this._objects;
  }

  private _removeIfOverdue(key: string): void {
    if (key in this._durations && this._durations[key] <= Date.now()) {
      this.remove(key);
    }
  }

  public remove(key: string) {
    delete this._objects[key];
    delete this._durations[key];
  }

  public get(key: string): T {
    if (this.contains(key)) {
      return this._objects[key];
    }
    throw new Error("Cache does not contain value at key: " + key);
  }
}

export function decodeJson(binary: Uint8Array | string): any {
  const buffer =
    typeof binary == "string"
      ? Buffer.from(binary, "base64")
      : Buffer.from(binary);
  return JSON.parse(buffer.toString("utf8"));
}
