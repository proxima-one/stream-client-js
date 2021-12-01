import { Observable, of } from "rxjs";


import {
  BlockBase,
  BlockEvent,
  NewBlockEvent,
  UndoBlockEvent,
  BlockEventStreamer,
  streamBlockEvents
  // @ts-ignore
} from ".";

describe("BlockEventStreamer", () => {
  const validBlockchain: BlockBase[] = [
    {
      hash: "1",
      parentHash:"0",
      number: 1
    },
    {
      hash: "2",
      parentHash:"1",
      number: 2
    },
    {
      hash: "3",
      parentHash:"2",
      number: 3
    },
  ];

  it("should generate simple event for new block", () => {
    const sut = new BlockEventStreamer<BlockBase>();

    const events = sut.produceEventsForNewBlock(validBlockchain[0]);

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe("new");
    expect(events[0].block).toBe(validBlockchain[0]);

    sut.applyEvents(events);

    const events2 = sut.produceEventsForNewBlock(validBlockchain[1]);
    expect(events2).toHaveLength(1);
    expect(events2[0].type).toBe("new");
    expect(events2[0].block).toBe(validBlockchain[1]);
  });


  it("should generate undo events in case of fork", () => {
    const sut = new BlockEventStreamer<BlockBase>();

    sut.applyEvents([
      new NewBlockEvent({
        number: 0,
        hash: "0",
        parentHash: ""
      }),
      new NewBlockEvent({
        number: 1,
        hash: "1",
        parentHash: "0"
      }),
      new NewBlockEvent({
        number: 2,
        hash: "2",
        parentHash: "1"
      }),
    ]);

    const events = sut.produceEventsForNewBlock({
      number: 1,
      hash: "1A",
      parentHash: "0"
    });

    expect(events).toEqual([
      new UndoBlockEvent({
        number: 2,
        hash: "2",
        parentHash: "1"
      }),
      new UndoBlockEvent({
        number: 1,
        hash: "1",
        parentHash: "0"
      }),
      new NewBlockEvent({
        number: 1,
        hash: "1A",
        parentHash: "0"
      })
    ]);
    sut.applyEvents(events);
  });

  it("should apply last events even they're not consistent to support partial state based on latest events", () => {
    const sut = new BlockEventStreamer<BlockBase>();

    sut.applyEvents([
      new UndoBlockEvent({
        number: 2,
        hash: "2",
        parentHash: "1"
      }),
      new UndoBlockEvent({
        number: 1,
        hash: "1",
        parentHash: "0"
      }),
      new NewBlockEvent({
        number: 1,
        hash: "1A",
        parentHash: "0"
      })
    ]);

    const events = sut.produceEventsForNewBlock({
      number: 1,
      hash: "2A",
      parentHash: "1A"
    });

    expect(events).toEqual([
      new NewBlockEvent({
        number: 1,
        hash: "2A",
        parentHash: "1A"
      })
    ]);
  });

  describe("stream operator", () => {
    it("should convert blocks stream to consistent events stream", async () => {
      const newBlockEvents: Observable<BlockBase> = of(
        { number: 1, hash: "0x1111", parentHash: "" },
        { number: 2, hash: "0x2222", parentHash: "0x1111" },
        { number: 3, hash: "0x3333", parentHash: "0x2222" },
        { number: 4, hash: "0x4444", parentHash: "0x3333" },
        { number: 5, hash: "0x5555", parentHash: "0x4444" },
        // first fork occurs here
        { number: 3, hash: "0x33331", parentHash: "0x2222" },
        { number: 4, hash: "0x44441", parentHash: "0x33331" },
        { number: 5, hash: "0x55551", parentHash: "0x44441" },
        { number: 6, hash: "0x66661", parentHash: "0x55551" },

        // hmmm, let's go to the first original branch
        { number: 6, hash: "0x6666", parentHash: "0x5555" },
      );

      const blockchainEventStream = newBlockEvents.pipe(
        streamBlockEvents([], 10)
      );

      const producedEvents: BlockEvent<BlockBase>[] = [];
      blockchainEventStream.subscribe(ev => producedEvents.push(ev));
      await blockchainEventStream.toPromise();

      expect(producedEvents).toEqual([
        new NewBlockEvent({ number: 1, hash: "0x1111", parentHash: "" }),
        new NewBlockEvent({ number: 2, hash: "0x2222", parentHash: "0x1111" }),
        new NewBlockEvent({ number: 3, hash: "0x3333", parentHash: "0x2222" }),
        new NewBlockEvent({ number: 4, hash: "0x4444", parentHash: "0x3333" }),
        new NewBlockEvent({ number: 5, hash: "0x5555", parentHash: "0x4444" }),

        // und last blocks since new block #3 has different hash, so block#2 is closest ancestor to the new fork
        new UndoBlockEvent({ number: 5, hash: "0x5555", parentHash: "0x4444" }),
        new UndoBlockEvent({ number: 4, hash: "0x4444", parentHash: "0x3333" }),
        new UndoBlockEvent({ number: 3, hash: "0x3333", parentHash: "0x2222" }),

        new NewBlockEvent({ number: 3, hash: "0x33331", parentHash: "0x2222" }),
        new NewBlockEvent({ number: 4, hash: "0x44441", parentHash: "0x33331" }),
        new NewBlockEvent({ number: 5, hash: "0x55551", parentHash: "0x44441" }),
        new NewBlockEvent({ number: 6, hash: "0x66661", parentHash: "0x55551" }),

        // go to original branch
        new UndoBlockEvent({ number: 6, hash: "0x66661", parentHash: "0x55551" }),
        new UndoBlockEvent({ number: 5, hash: "0x55551", parentHash: "0x44441" }),
        new UndoBlockEvent({ number: 4, hash: "0x44441", parentHash: "0x33331" }),
        new UndoBlockEvent({ number: 3, hash: "0x33331", parentHash: "0x2222" }),


        new NewBlockEvent({ number: 3, hash: "0x3333", parentHash: "0x2222" }),
        new NewBlockEvent({ number: 4, hash: "0x4444", parentHash: "0x3333" }),
        new NewBlockEvent({ number: 5, hash: "0x5555", parentHash: "0x4444" }),
        new NewBlockEvent({ number: 6, hash: "0x6666", parentHash: "0x5555" }),
      ]);
    });

    it("should not generate event if block is already on active chain (support blocks restore)", async () => {
      const newBlockEvents: Observable<BlockBase> = of(
        { number: 1, hash: "0x1111", parentHash: "" },
        { number: 2, hash: "0x2222", parentHash: "0x1111" },
        { number: 3, hash: "0x3333", parentHash: "0x2222" },
        { number: 2, hash: "0x2222", parentHash: "0x1111" },
        { number: 3, hash: "0x3333", parentHash: "0x2222" }
      );

      const blockchainEventStream = newBlockEvents.pipe(
        streamBlockEvents([], 10)
      );

      const producedEvents: BlockEvent<BlockBase>[] = [];
      blockchainEventStream.subscribe(ev => producedEvents.push(ev));
      await blockchainEventStream.toPromise();

      expect(producedEvents).toEqual([
        new NewBlockEvent({ number: 1, hash: "0x1111", parentHash: "" }),
        new NewBlockEvent({ number: 2, hash: "0x2222", parentHash: "0x1111" }),
        new NewBlockEvent({ number: 3, hash: "0x3333", parentHash: "0x2222" })
      ]);
    });


    it("should generate correct stream in case of several undoes (this event occurred in bsc)", async () => {
      const newBlockEvents: Observable<BlockBase> = of(
        { number: 7559404, hash: "0x73f86f4a46c87ae98abb4535c8ae59003451c5fe5a0de57d7fd460f72cc3f6f6", parentHash: "0xb31141f09ac64676bb723e82642e5a747633bb06cd7e2c4d183cf7ad3e5ba1fa"},
        { number: 7559405, hash: "0x62ef77c76b300b024eef9deb6e9fa9f54e22d487d6e777ef0d8279b02c052ad2", parentHash: "0x73f86f4a46c87ae98abb4535c8ae59003451c5fe5a0de57d7fd460f72cc3f6f6"},
      );

      const blockchainEventStream = newBlockEvents.pipe(
        streamBlockEvents([
          new NewBlockEvent<BlockBase>({ number: 7559402, hash: "0x4c94a0d05c560af2c8cd535424f63f918f82450ff8fb1a51a827817ab2eb092f", parentHash: "0x0953b43791eaecc085dc3c119c66c15360a48fe0b9a0ecc695efc9f76f011d36"}),
          new NewBlockEvent<BlockBase>({ number: 7559403, hash: "0xb31141f09ac64676bb723e82642e5a747633bb06cd7e2c4d183cf7ad3e5ba1fa", parentHash: "0x4c94a0d05c560af2c8cd535424f63f918f82450ff8fb1a51a827817ab2eb092f"}),
          new NewBlockEvent<BlockBase>({ number: 7559404, hash: "0x36a2f1e1c2dd4dfd7f6248211018260b72ff05e45f6f593367aab777dbd3924d", parentHash: "0xb31141f09ac64676bb723e82642e5a747633bb06cd7e2c4d183cf7ad3e5ba1fa"}),
          new UndoBlockEvent<BlockBase>({ number: 7559404, hash: "0x36a2f1e1c2dd4dfd7f6248211018260b72ff05e45f6f593367aab777dbd3924d", parentHash: "0xb31141f09ac64676bb723e82642e5a747633bb06cd7e2c4d183cf7ad3e5ba1fa"}),
          new NewBlockEvent<BlockBase>({ number: 7559404, hash: "0x73f86f4a46c87ae98abb4535c8ae59003451c5fe5a0de57d7fd460f72cc3f6f6", parentHash: "0xb31141f09ac64676bb723e82642e5a747633bb06cd7e2c4d183cf7ad3e5ba1fa"}),
          new UndoBlockEvent<BlockBase>({ number: 7559404, hash: "0x73f86f4a46c87ae98abb4535c8ae59003451c5fe5a0de57d7fd460f72cc3f6f6", parentHash: "0xb31141f09ac64676bb723e82642e5a747633bb06cd7e2c4d183cf7ad3e5ba1fa"}),
          new NewBlockEvent<BlockBase>({ number: 7559404, hash: "0x36a2f1e1c2dd4dfd7f6248211018260b72ff05e45f6f593367aab777dbd3924d", parentHash: "0xb31141f09ac64676bb723e82642e5a747633bb06cd7e2c4d183cf7ad3e5ba1fa"}),
          new NewBlockEvent<BlockBase>({ number: 7559405, hash: "0x1a0255fc61848724abccabaed10a2f765bd5fb3343e2a41e9a355bfe906f9061", parentHash: "0x36a2f1e1c2dd4dfd7f6248211018260b72ff05e45f6f593367aab777dbd3924d"}),
        ], 10)
      );

      const producedEvents: BlockEvent<BlockBase>[] = [];
      blockchainEventStream.subscribe(ev => producedEvents.push(ev));
      await blockchainEventStream.toPromise();

      expect(producedEvents).toEqual([
        new UndoBlockEvent<BlockBase>({ number: 7559405, hash: "0x1a0255fc61848724abccabaed10a2f765bd5fb3343e2a41e9a355bfe906f9061", parentHash: "0x36a2f1e1c2dd4dfd7f6248211018260b72ff05e45f6f593367aab777dbd3924d"}),
        new UndoBlockEvent<BlockBase>({ number: 7559404, hash: "0x36a2f1e1c2dd4dfd7f6248211018260b72ff05e45f6f593367aab777dbd3924d", parentHash: "0xb31141f09ac64676bb723e82642e5a747633bb06cd7e2c4d183cf7ad3e5ba1fa"}),
        new NewBlockEvent({ number: 7559404, hash: "0x73f86f4a46c87ae98abb4535c8ae59003451c5fe5a0de57d7fd460f72cc3f6f6", parentHash: "0xb31141f09ac64676bb723e82642e5a747633bb06cd7e2c4d183cf7ad3e5ba1fa"}),
        new NewBlockEvent({ number: 7559405, hash: "0x62ef77c76b300b024eef9deb6e9fa9f54e22d487d6e777ef0d8279b02c052ad2", parentHash: "0x73f86f4a46c87ae98abb4535c8ae59003451c5fe5a0de57d7fd460f72cc3f6f6"}),
      ]);
    });
  });
});
