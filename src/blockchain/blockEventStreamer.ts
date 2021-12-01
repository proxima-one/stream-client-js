import { Observable } from "rxjs";
import { BlockBase, BlockEvent, HashLike, NewBlockEvent, UndoBlockEvent } from "./model";

export class BlockEventStreamer<TBlock extends BlockBase> {
  safeDepth = 10000 as const;

  private tree: BlockTree<TBlock>;
  private headPath: TBlock[];
  private headPathIndex: Record<string, TBlock | undefined>;

  private get empty(): boolean {
    return this.headPath.length === 0;
  }

  public constructor() {
    this.tree = new BlockTree<TBlock>();
    this.headPath = [];
    this.headPathIndex = {};
  }

  public applyEvents(events: ReadonlyArray<BlockEvent<TBlock>>): void {
    for (let event of events) {
      if (event.type === "new") {
        this.tree.addBlock(event.block);
        this.pushHead(event.block);
      }
      if (event.type === "undo") {
        this.popHead(event.block);
      }
    }
  }

  public produceEventsForNewBlock(block: TBlock): BlockEvent<TBlock>[] {
    if (this.empty)
      return [new NewBlockEvent(block)];

    // no events needed if block is on current head branch
    if (this.headPathIndex[hashToString(block.hash)])
      return [];

    const ancestorBlockPath = this.findPathToCommonAncestorOnHeadPath(block);

    if (!ancestorBlockPath)
      throw new Error(`Can't generate events to produce consistent stream update: no common ancestor with current head. Block: [${block.number} ${hashToString(block.hash)} ${hashToString(block.parentHash)} ]`);

    // pop current head to ancestorBlock
    // generate events for new path

    const ancestorBlock = ancestorBlockPath[0];
    const events: BlockEvent<TBlock>[] = [];

    for (let i = this.headPath.length - 1; i >= 0; i--) {
      if (hashToString(this.headPath[i].hash) === hashToString(ancestorBlock.hash))
        break;

      events.push(new UndoBlockEvent(this.headPath[i]));
    }

    for (let i = 1; i < ancestorBlockPath.length; i++) {
      events.push(new NewBlockEvent(ancestorBlockPath[i]));
    }

    return events;
  }

  public getLastSafeBlockOnActiveChain(): TBlock | undefined {
    if (this.headPath.length < this.safeDepth)
      return undefined;

    return this.headPath[this.headPath.length - this.safeDepth];
  }

  private findPathToCommonAncestorOnHeadPath(block: TBlock): TBlock[] | undefined {
    let curBlock: TBlock | undefined = block;
    const path: TBlock[] = [];
    do {
      path.push(curBlock);
      if (this.headPathIndex[hashToString(curBlock.hash)]) {
        path.reverse();
        return path;
      }
    } while(curBlock = this.tree.findBlock(hashToString(curBlock.parentHash)))

    return undefined;
  }

  private pushHead(block: TBlock): void {
    this.ensureNextBlockValid(block);
    this.headPath.push(block);
    this.headPathIndex[hashToString(block.hash)] = block;
  }

  private popHead(block: TBlock): void {
    if (this.headPath.length === 0) {
      // assume our instance doesn't hold whole chain tree, but only some latest events
      // so try to act as this block exists
      this.tree.addBlock(block);
      return;
    }

    const blockToPop = this.headPath[this.headPath.length - 1];
    if (hashToString(blockToPop.hash) !== hashToString(block.hash))
      throw new Error(`Data inconsistency: head block ${hashToString(blockToPop.hash)} doesn't match undo block ${hashToString(block.hash)}`);

    this.headPath.pop();
    this.headPathIndex[hashToString(blockToPop.hash)] = undefined;
  }

  private ensureNextBlockValid(nextBlock: TBlock) {
    const head = this.headPath.length !== 0 ? this.headPath[this.headPath.length-1] : undefined;
    if (!head)
      return;

    if (hashToString(nextBlock.parentHash) !== hashToString(head.hash) || nextBlock.number !== head.number + 1)
      throw new Error(`Data inconsistency: block ${nextBlock.number}-${hashToString(nextBlock.hash)} (parentHash: ${hashToString(nextBlock.parentHash)}) can't follow block ${head.number}-${hashToString(head.hash)}`);
  }
}

class BlockTree<TBlock extends BlockBase> {
  private readonly blocksByHash: Record<string, TBlock> = {};
  private size: number = 0;

  public addBlock(block: TBlock): void {
    if (this.blocksByHash[hashToString(block.hash)])
      return;

    // first block
    if (this.size === 0) {
      this.blocksByHash[hashToString(block.hash)] = block;
      return;
    }

    const parentBlock = this.blocksByHash[hashToString(block.parentHash)];
    if (parentBlock && (parentBlock.number != block.number - 1))
      throw new Error(`Can't add block ${block.number} ${block.hash}: blockNumber is inconsistent with parent block ${parentBlock.hash} ${parentBlock.hash}`);

    this.blocksByHash[hashToString(block.hash)] = block;
    this.size++;
  }

  public findBlock(hash: string): TBlock | undefined {
    return this.blocksByHash[hash];
  }
}

export function streamBlockEvents<T extends BlockBase>(lastCommitedEvents: ReadonlyArray<BlockEvent<T>>, minSafeLastEvents: number, maxReorgDepth: number = 10): (source: Observable<T>) => Observable<BlockEvent<T>> {
  return function(source: Observable<T>): Observable<BlockEvent<T>> {
    return new Observable<BlockEvent<T>>(subscriber => {
      const lastEvents: BlockEvent<T>[] = [];

      let streamer = new BlockEventStreamer<T>();
      streamer.applyEvents(lastCommitedEvents);

      let stopped = false;
      const subscription = source.subscribe(block => {
          if (stopped)
            return;
          const events = streamer.produceEventsForNewBlock(block);
          if (events.length === 0)
            return;

          if (events.length > maxReorgDepth) {
            //console.log("Produced Events: ", JSON.stringify(events));
            //console.log("LastEvents: ", JSON.stringify(lastEvents));
            console.log("Block: ", JSON.stringify(block));
            //console.log("Tree: ", JSON.stringify(streamer));
            subscriber.error(new Error("too many undo events, failing fast to prevent data inconsistency"));
            subscription.unsubscribe();
            stopped = true;
            return;
          }

          streamer.applyEvents(events);
          for (let ev of events) {
            subscriber.next(ev);
            lastEvents.push(ev);
          }

          // rebuild BlockEventStreamer with last minSafeLastEvents events to reduce its state
          if (lastEvents.length > minSafeLastEvents * 2) {
            lastEvents.splice(0, lastEvents.length - minSafeLastEvents);

            streamer = new BlockEventStreamer<T>();
            streamer.applyEvents(lastEvents);
          }

        },
        err => subscriber.error(err),
        () => subscriber.complete()
      );
    });
  };
}

function hashToString(hash: HashLike): string {
  return typeof (hash) === "string" ? hash : hash.toHexString();
}
