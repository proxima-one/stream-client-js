import { Observable, Subscriber, TeardownLogic, OperatorFunction } from "rxjs";
import { barrier, Barrier } from "./barrier";

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
    ) => TeardownLogic,
    existingController?: StreamController
  ): PausableStream<T> {
    const controller = existingController ?? new SimplePauseController();

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
