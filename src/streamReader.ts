import { StreamClient, StreamMessage } from "./client";
import {
  bufferTime,
  catchError,
  filter,
  firstValueFrom,
  Observable,
  take,
  timeout,
  TimeoutError,
  of,
} from "rxjs";

// temporary solution, will be generalized using common proxima-streaming package once open sourced
export class StreamReader {
  bufferTimeInterval = 10 as const;

  public constructor(
    private readonly client: StreamClient,
    private readonly streamId: string,
    private lastMessageId?: string
  ) {}

  public async tryRead(
    maxCount: number,
    timeoutMs: number
  ): Promise<StreamMessage[]> {
    const storedMessages = (
      await this.client.getNextMessages(this.streamId, {
        latest: this.lastMessageId,
        messageCount: maxCount,
      })
    ).messagesList;

    if (storedMessages.length > 0) {
      this.lastMessageId = storedMessages[storedMessages.length - 1].id;
      return storedMessages;
    }

    const liveMessagesStream = this.client
      .streamMessages(this.streamId, { latest: this.lastMessageId })
      .pipe(
        timeout({ first: timeoutMs }),
        bufferTime(this.bufferTimeInterval, this.bufferTimeInterval, maxCount),
        filter((x) => x.length > 0),
        take(1)
      );

    const firstMessages = await firstValueFrom(
      liveMessagesStream.pipe(
        catchError((err) => {
          if (err instanceof TimeoutError) return of([]);
          console.debug("streamMessages error occurred", err);
          return of([]);
        })
      )
    );

    if (firstMessages.length > 0) {
      this.lastMessageId = firstMessages[firstMessages.length - 1].id;
      return firstMessages;
    }

    return [];
  }
}
