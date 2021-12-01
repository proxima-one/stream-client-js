export class LimitedResourceAccessor {
  private readonly waiting: WaitingConsumer[] = [];

  public async getResource<T>(accessFunc: (() => T | undefined)): Promise<T> {
    const resource = accessFunc();
    if (resource !== undefined)
      return resource;

    return new Promise(resolve => {
      const queueItem = new WaitingConsumer(accessFunc, resolve);
      this.waiting.push(queueItem);
    });
  }

  public stateChanged(): void {
    const toDelete: number[] = [];

    for (let i = 0; i < this.waiting.length; i++) {
      const consumer = this.waiting[i];
      try {
        const resource = consumer.accessFunc();
        if (resource) {
          consumer.resolve(resource);
          toDelete.push(i);
        }
      } catch(err) {
        console.error("Error while accessing resource", err);
      }
    }

    for (let i = toDelete.length - 1; i >= 0; i--)
      this.waiting.splice(toDelete[i], 1);
  }
}

class WaitingConsumer {
  public readonly accessFunc: (() => any | undefined);
  public readonly resolve: ((val: any) => void);

  public constructor(func: () => any, resolve: (val: any) => void) {
    this.accessFunc = func;
    this.resolve = resolve;
  }
}
