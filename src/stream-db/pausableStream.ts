import { Observable, Subscriber, TeardownLogic } from "rxjs";
import { OperatorFunction } from "rxjs";

export class PausableStream<T> {
  private constructor(
    public readonly controller: StreamController,
    public readonly observable: Observable<T>
  ) {}

  public static create<T>(
    subscribe: (
      this: Observable<T>,
      subscriber: Subscriber<T>,
      pauseState: PauseState
    ) => TeardownLogic
  ): PausableStream<T> {
    const controller = new SimplePauseController();

    const observable: Observable<T> = new Observable<T>(subscriber =>
      subscribe.call(observable, subscriber, controller)
    );
    return new PausableStream<T>(controller, observable);
  }

  public updateObservable<V>(
    func: (observable: Observable<T>) => Observable<V>
  ): PausableStream<V> {
    return new PausableStream<V>(this.controller, func(this.observable));
  }

  public pipe<A>(operator: OperatorFunction<T, A>): PausableStream<A> {
    return new PausableStream<A>(
      this.controller,
      this.observable.pipe(operator)
    );
  }
}

export interface PauseState {
  isPaused: boolean;
  waitUntilResumed(): Promise<void>;
}

export interface StreamController extends PauseState {
  pause(): void;
  resume(): void;
}

export class SimplePauseController implements StreamController {
  private pauseBarrier?: Barrier;

  public get isPaused() {
    return this.pauseBarrier !== undefined;
  }

  public pause() {
    if (this.pauseBarrier) return;

    this.pauseBarrier = barrier();
  }

  public resume() {
    this.pauseBarrier?.unlock();
    this.pauseBarrier = undefined;
  }

  public async waitUntilResumed(): Promise<void> {
    if (!this.pauseBarrier) return;

    await this.pauseBarrier.lock;
  }
}

export function barrier(resourcesCount: number = 1): Barrier {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let unlock = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let unlockWithError = (err: any) => {};

  let resourcesLeft = resourcesCount;
  const lock = new Promise<void>((resolve, reject) => {
    unlock = () => {
      resourcesLeft--;
      if (resourcesLeft <= 0) resolve();
    };
    unlockWithError = (err: any) => reject(err);

    if (resourcesLeft === 0) resolve();
  });
  return { lock, unlock, unlockWithError };
}

export type Barrier = {
  lock: Promise<void>;
  unlock: () => void;
  unlockWithError: (err: any) => void;
};
