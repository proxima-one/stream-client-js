import { strict as assert } from "assert";
import { PausableStream } from "./pausableStream";
import { Subscription } from "rxjs";
import { barrier, Barrier } from "./barrier";

export class BufferedStreamReader<T> {
  public readonly buffer: T[] = [];
  private subscription: Subscription | undefined;
  private isCompleted: boolean = false;
  private error?: any;
  private dataWaitLock: Barrier | undefined;

  private constructor(
    private readonly stream: PausableStream<T | T[]>,
    private readonly bufferSize: number
  ) {}

  public static fromStream<T>(
    stream: PausableStream<T | T[]>,
    buffer?: number
  ): BufferedStreamReader<T> {
    return new BufferedStreamReader<T>(stream, buffer ?? Number.MAX_VALUE);
  }

  public readExactSync(count: number): T[] {
    assert(this.buffer.length >= count);
    return this.dequeue(count);
  }

  public async read(count: number): Promise<T[] | undefined> {
    this.ensureStarted();

    if (count === 0) return [];

    await this.awaitForData();

    if (this.error) throw this.error;

    if (this.buffer.length == 0 && this.isCompleted) return undefined;

    return this.dequeue(count);
  }

  public dispose() {
    this.resolveDataAwaiter();
    if (!this.subscription) return;

    this.subscription.unsubscribe();
    this.isCompleted = true;
  }

  public ensureStarted() {
    if (this.subscription) return;

    this.subscription = this.stream.observable.subscribe({
      next: val => {
        if (Array.isArray(val)) this.buffer.push(...val);
        else this.buffer.push(val);

        this.resolveDataAwaiter();

        if (
          this.buffer.length > this.bufferSize &&
          !this.stream.controller.isPaused
        ) {
          this.stream.controller.pause();
        }
      },
      error: err => {
        this.error = err;
        this.resolveDataAwaiter();
      },
      complete: () => {
        this.isCompleted = true;
        this.resolveDataAwaiter();
      },
    });
  }

  private async awaitForData() {
    if (this.buffer.length > 0 || this.error || this.isCompleted) return;

    this.dataWaitLock = barrier(1);
    await this.dataWaitLock.lock;
    this.dataWaitLock = undefined;
  }

  private resolveDataAwaiter() {
    if (this.dataWaitLock) this.dataWaitLock.unlock();
  }

  private dequeue(count: number): T[] {
    const result = this.buffer.splice(0, count);

    if (
      this.buffer.length <= this.bufferSize &&
      this.stream.controller.isPaused
    ) {
      this.stream.controller.resume();
    }

    return result;
  }
}
