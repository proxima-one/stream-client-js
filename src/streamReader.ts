import { State, Transition, StreamStateRef } from "./model";
import {
  bufferTime,
  catchError,
  filter,
  firstValueFrom,
  take,
  timeout,
  TimeoutError,
  of,
} from "rxjs";
import { ProximaStreamsClient } from "./client";

// temporary solution, will be generalized using common proxima-streaming package once open sourced
export class StreamReader {
  bufferTimeInterval = 10 as const;

  private lastState: State;
  public constructor(
    private readonly client: ProximaStreamsClient,
    private readonly streamId: string,
    fromState: State
  ) {
    this.lastState = fromState;
  }

  public async tryRead(
    maxCount: number,
    timeoutMs: number
  ): Promise<Transition[]> {
    const stateChanges = await this.client.getTransitionsAfter(
      new StreamStateRef(this.streamId, this.lastState),
      maxCount
    );

    if (stateChanges.length > 0) {
      this.lastState = stateChanges[stateChanges.length - 1].newState;
      return stateChanges;
    }

    const liveStream = this.client
      .streamTransitionsAfter(new StreamStateRef(this.streamId, this.lastState))
      .pipe(
        timeout({ first: timeoutMs }),
        bufferTime(this.bufferTimeInterval, this.bufferTimeInterval, maxCount),
        filter((x) => x.length > 0),
        take(1)
      );

    const firstLiveStateChanges = await firstValueFrom(
      liveStream.pipe(
        catchError((err) => {
          if (err instanceof TimeoutError) return of([]);
          console.debug("stream error occurred", err);
          return of([]);
        })
      )
    );

    if (firstLiveStateChanges.length > 0) {
      this.lastState =
        firstLiveStateChanges[firstLiveStateChanges.length - 1].newState;
      return firstLiveStateChanges;
    }

    return [];
  }
}
